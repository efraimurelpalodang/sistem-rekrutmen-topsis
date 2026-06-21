<?php

namespace App\Http\Controllers\Pelamar;

use App\Http\Controllers\Controller;
use App\Models\HasilTes;
use App\Models\JawabanPelamar;
use App\Models\Lamaran;
use App\Models\Soal;
use App\Models\TesTeknis;
use App\Services\TopsisService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TesController extends Controller
{
  public function __construct(
    private readonly TopsisService $topsisService,
  ) {}

  /**
   * Tampilkan halaman pengerjaan tes. Jika belum ada sesi hasil_tes
   * untuk lamaran ini, buat sesi baru (catat waktu mulai). Soal dipilih
   * acak dari bank soal sebanyak jumlah_soal yang ditentukan HRD, dan
   * disimpan urutannya di session agar konsisten selama satu sesi
   * pengerjaan (tidak berubah saat halaman di-refresh).
   */
  public function show(Request $request, Lamaran $lamaran): Response|RedirectResponse
  {
    $tesTeknis = $lamaran->lowongan->tesTeknis;

    if (! $tesTeknis) {
      abort(404, 'Tes teknis untuk lowongan ini belum tersedia.');
    }

    $hasilTes = $lamaran->hasilTes;

    // Jika sudah pernah submit, tidak boleh mengerjakan ulang
    if ($hasilTes && $hasilTes->tgl_selesai !== null) {
      Inertia::flash('toast', [
        'type' => 'error',
        'message' => 'Anda sudah menyelesaikan tes ini sebelumnya.',
      ]);

      return to_route('pelamar.lamaran.show', $lamaran->id);
    }

    // Buat sesi tes baru jika belum ada
    if (! $hasilTes) {
      $hasilTes = HasilTes::create([
        'lamaran_id' => $lamaran->id,
        'nilai' => 0,
        'tgl_mulai' => now(),
        'tgl_selesai' => null,
      ]);
    }

    // Soal acak disimpan di session agar urutan/pilihan konsisten
    // selama satu sesi pengerjaan tes ini.
    $sessionKey = "tes_soal_ids_{$lamaran->id}";

    if (! session()->has($sessionKey)) {
      $soalIds = Soal::where('tes_id', $tesTeknis->id)
        ->inRandomOrder()
        ->limit($tesTeknis->jumlah_soal)
        ->pluck('id')
        ->toArray();

      session([$sessionKey => $soalIds]);
    }

    $soalIds = session($sessionKey);
    $soals = Soal::whereIn('id', $soalIds)
      ->get()
      ->sortBy(fn($soal) => array_search($soal->id, $soalIds))
      ->values();

    // Hitung sisa waktu berdasarkan tgl_mulai + durasi
    $batasWaktu = $hasilTes->tgl_mulai->copy()->addMinutes($tesTeknis->durasi_menit);
    $sisaDetik = max(0, now()->diffInSeconds($batasWaktu, false));

    // Jika waktu sudah habis tapi belum sempat auto-submit (mis. user
    // baru buka lagi setelah lama), langsung proses sebagai auto-submit
    // dengan jawaban yang sudah tersimpan (jika ada) atau kosong.
    if ($sisaDetik <= 0) {
      return $this->prosesSubmit($lamaran, $hasilTes, $tesTeknis, []);
    }

    return Inertia::render('pelamar/tes/kerjakan', [
      'lamaran' => $lamaran->load('lowongan'),
      'tesTeknis' => $tesTeknis,
      'soals' => $soals,
      'sisaDetik' => $sisaDetik,
      'jawabanTersimpan' => JawabanPelamar::where('hasil_tes_id', $hasilTes->id)
        ->pluck('jawaban', 'soal_id'),
    ]);
  }

  /**
   * Simpan satu jawaban secara otomatis saat pelamar memilih opsi
   * (autosave per soal, mencegah kehilangan jawaban jika koneksi putus).
   */
  public function jawab(Request $request, Lamaran $lamaran): RedirectResponse
  {
    $validated = $request->validate([
      'soal_id' => ['required', 'integer', 'exists:soals,id'],
      'jawaban' => ['required', 'in:a,b,c,d'],
    ]);

    $hasilTes = $lamaran->hasilTes;

    if (! $hasilTes || $hasilTes->tgl_selesai !== null) {
      abort(403);
    }

    $soal = Soal::findOrFail($validated['soal_id']);

    JawabanPelamar::updateOrCreate(
      [
        'hasil_tes_id' => $hasilTes->id,
        'soal_id' => $soal->id,
      ],
      [
        'jawaban' => $validated['jawaban'],
        'is_benar' => $soal->jawaban_benar === $validated['jawaban'],
      ],
    );

    return back();
  }

  /**
   * Submit akhir tes (manual oleh pelamar, atau otomatis saat waktu habis).
   */
  public function submit(Request $request, Lamaran $lamaran): RedirectResponse
  {
    $tesTeknis = $lamaran->lowongan->tesTeknis;
    $hasilTes = $lamaran->hasilTes;

    if (! $hasilTes || $hasilTes->tgl_selesai !== null) {
      abort(403, 'Tes ini sudah diselesaikan sebelumnya.');
    }

    $jawabans = $request->input('jawaban', []);

    $response = $this->prosesSubmit($lamaran, $hasilTes, $tesTeknis, $jawabans);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Tes berhasil diselesaikan. Terima kasih atas partisipasi Anda.',
    ]);

    return $response;
  }

  /**
   * Proses akhir submit: simpan sisa jawaban yang belum ter-autosave,
   * hitung nilai akhir, tutup sesi tes, update status lamaran menjadi
   * selesai_tes, lalu trigger kalkulasi ulang TOPSIS untuk lowongan ini.
   *
   * @param  array<int, string>  $jawabans  [soal_id => jawaban] dari form submit
   */
  private function prosesSubmit(
    Lamaran $lamaran,
    HasilTes $hasilTes,
    ?TesTeknis $tesTeknis,
    array $jawabans,
  ): RedirectResponse {
    return DB::transaction(function () use ($lamaran, $hasilTes, $tesTeknis, $jawabans) {
      foreach ($jawabans as $soalId => $jawaban) {
        if (! in_array($jawaban, ['a', 'b', 'c', 'd'], true)) {
          continue;
        }

        $soal = Soal::find($soalId);
        if (! $soal) {
          continue;
        }

        JawabanPelamar::updateOrCreate(
          [
            'hasil_tes_id' => $hasilTes->id,
            'soal_id' => $soal->id,
          ],
          [
            'jawaban' => $jawaban,
            'is_benar' => $soal->jawaban_benar === $jawaban,
          ],
        );
      }

      $totalSoal = $tesTeknis?->jumlah_soal ?? 0;
      $jumlahBenar = JawabanPelamar::where('hasil_tes_id', $hasilTes->id)
        ->where('is_benar', true)
        ->count();

      $nilai = $totalSoal > 0 ? round(($jumlahBenar / $totalSoal) * 100, 2) : 0;

      $hasilTes->update([
        'nilai' => $nilai,
        'tgl_selesai' => now(),
      ]);

      $lamaran->update(['status' => Lamaran::STATUS_SELESAI_TES]);

      // Bersihkan session urutan soal acak, sesi tes sudah selesai
      session()->forget("tes_soal_ids_{$lamaran->id}");

      // Trigger otomatis recalculate TOPSIS untuk lowongan ini,
      // sesuai keputusan: dihitung ulang tiap ada pelamar selesai tes.
      $this->topsisService->hitung($lamaran->lowongan);

      return to_route('pelamar.lamaran.show', $lamaran->id);
    });
  }
}
