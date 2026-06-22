<?php

namespace App\Http\Controllers\HRD;

use App\Http\Controllers\Controller;
use App\Models\HasilTopsis;
use App\Models\Lamaran;
use App\Models\Lowongan;
use App\Services\TopsisService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class TopsisController extends Controller
{
  public function __construct(
    private readonly TopsisService $topsisService,
  ) {}

  /**
   * Tampilkan hasil ranking TOPSIS untuk satu lowongan.
   * Otomatis recalculate setiap halaman ini dibuka, agar hasil selalu
   * mencerminkan data pelamar terbaru yang sudah selesai tes.
   */
  public function hasil(Lowongan $lowongan): Response
  {
    $this->authorizeOwnership($lowongan);

    $hasilTopsis = $this->topsisService->hitung($lowongan);

    $jumlahSelesaiTes = Lamaran::where('lowongan_id', $lowongan->id)
      ->where('status', Lamaran::STATUS_SELESAI_TES)
      ->count();

    $rankings = HasilTopsis::where('lowongan_id', $lowongan->id)
      ->with([
        'lamaran.pengguna',
        'detailTopsis.kriteria',
      ])
      ->orderBy('ranking')
      ->get();

    return Inertia::render('hrd/topsis/hasil', [
      'lowongan' => $lowongan,
      'rankings' => $rankings,
      'jumlahSelesaiTes' => $jumlahSelesaiTes,
      'belumCukupData' => $hasilTopsis === null && $jumlahSelesaiTes < 2,
    ]);
  }

  /**
   * Terima pelamar berdasarkan hasil rekomendasi TOPSIS.
   */
  public function terima(HasilTopsis $hasilTopsis): RedirectResponse
  {
    $this->authorizeOwnership($hasilTopsis->lowongan);

    $hasilTopsis->lamaran->update(['status' => Lamaran::STATUS_DITERIMA]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => "{$hasilTopsis->lamaran->pengguna->nama} diterima.",
    ]);

    return back();
  }

  /**
   * Tolak pelamar meskipun direkomendasikan TOPSIS (keputusan akhir tetap di HRD).
   */
  public function tolak(HasilTopsis $hasilTopsis): RedirectResponse
  {
    $this->authorizeOwnership($hasilTopsis->lowongan);

    $hasilTopsis->lamaran->update(['status' => Lamaran::STATUS_DITOLAK]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => "{$hasilTopsis->lamaran->pengguna->nama} ditolak.",
    ]);

    return back();
  }

  /**
   * Tampilkan halaman ringkasan keputusan akhir HRD untuk satu lowongan:
   * siapa yang diterima, siapa yang ditolak, dan siapa yang masih
   * berstatus selesai_tes (belum diputuskan).
   */
  public function keputusan(Lowongan $lowongan): Response
  {
    $lamarans = Lamaran::where('lowongan_id', $lowongan->id)
      ->with([
        'pengguna',
        'hasilTopsis',
      ])
      ->get();

    $diterima = $lamarans
      ->where('status', Lamaran::STATUS_DITERIMA)
      ->values();

    $ditolak = $lamarans
      ->where('status', Lamaran::STATUS_DITOLAK)
      ->values();

    $belumDiputuskan = $lamarans
      ->where('status', Lamaran::STATUS_SELESAI_TES)
      ->values();

    $totalDinilai = $diterima->count()
      + $ditolak->count()
      + $belumDiputuskan->count();

    return Inertia::render('hrd/topsis/keputusan', [
      'lowongan' => $lowongan,
      'diterima' => $diterima,
      'ditolak' => $ditolak,
      'belumDiputuskan' => $belumDiputuskan,
      'totalDinilai' => $totalDinilai,
    ]);
  }

  /**
   * Export laporan hasil perhitungan TOPSIS (ranking + detail nilai
   * per kriteria) dalam bentuk PDF.
   */
  public function exportHasilPdf(Lowongan $lowongan): HttpResponse
  {
    $this->authorizeOwnership($lowongan);

    $rankings = HasilTopsis::where('lowongan_id', $lowongan->id)
      ->with([
        'lamaran.pengguna',
        'detailTopsis.kriteria',
      ])
      ->orderBy('ranking')
      ->get();

    $kriterias = $rankings->first()?->detailTopsis->pluck('kriteria')->unique('id')->values() ?? collect();

    $pdf = Pdf::loadView('reports.topsis-hasil', [
      'lowongan' => $lowongan,
      'rankings' => $rankings,
      'kriterias' => $kriterias,
      'tanggalCetak' => now()->translatedFormat('d F Y, H:i'),
    ])->setPaper('a4', 'landscape');

    $namaFile = 'Hasil-TOPSIS-' . str($lowongan->judul)->slug() . '-' . now()->format('Ymd-His') . '.pdf';

    return $pdf->download($namaFile);
  }

  /**
   * Export laporan keputusan akhir HRD (diterima/ditolak/belum
   * diputuskan) dalam bentuk PDF.
   */
  public function exportKeputusanPdf(Lowongan $lowongan): HttpResponse
  {
    $this->authorizeOwnership($lowongan);

    $rankings = HasilTopsis::where('lowongan_id', $lowongan->id)
      ->with(['lamaran.pengguna'])
      ->orderBy('ranking')
      ->get();

    $diterima = $rankings->filter(fn($h) => $h->lamaran->status === Lamaran::STATUS_DITERIMA)->values();
    $ditolak = $rankings->filter(fn($h) => $h->lamaran->status === Lamaran::STATUS_DITOLAK)->values();
    $belumDiputuskan = $rankings->filter(fn($h) => $h->lamaran->status === Lamaran::STATUS_SELESAI_TES)->values();

    $pdf = Pdf::loadView('reports.topsis-keputusan', [
      'lowongan' => $lowongan,
      'diterima' => $diterima,
      'ditolak' => $ditolak,
      'belumDiputuskan' => $belumDiputuskan,
      'totalDinilai' => $rankings->count(),
      'tanggalCetak' => now()->translatedFormat('d F Y, H:i'),
    ])->setPaper('a4', 'portrait');

    $namaFile = 'Keputusan-HRD-' . str($lowongan->judul)->slug() . '-' . now()->format('Ymd-His') . '.pdf';

    return $pdf->download($namaFile);
  }

  /**
   * Pastikan lowongan ini milik HRD yang sedang login.
   */
  private function authorizeOwnership(Lowongan $lowongan): void
  {
    if ($lowongan->pengguna_id !== request()->user()->id) {
      abort(403, 'Anda tidak memiliki akses ke lowongan ini.');
    }
  }
}
