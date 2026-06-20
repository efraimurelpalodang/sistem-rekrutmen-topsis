<?php

namespace App\Http\Controllers\HRD;

use App\Http\Controllers\Controller;
use App\Models\HasilTopsis;
use App\Models\Lamaran;
use App\Models\Lowongan;
use App\Services\TopsisService;
use Illuminate\Http\RedirectResponse;
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
   * Pastikan lowongan ini milik HRD yang sedang login.
   */
  private function authorizeOwnership(Lowongan $lowongan): void
  {
    if ($lowongan->pengguna_id !== request()->user()->id) {
      abort(403, 'Anda tidak memiliki akses ke lowongan ini.');
    }
  }
}
