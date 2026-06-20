<?php

namespace App\Http\Controllers\HRD;

use App\Http\Controllers\Controller;
use App\Models\Lamaran;
use App\Models\Lowongan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SeleksiController extends Controller
{
  /**
   * Tampilkan daftar pelamar yang perlu diseleksi administrasinya
   * untuk satu lowongan tertentu.
   */
  public function index(Lowongan $lowongan): Response
  {
    $this->authorizeOwnership($lowongan);

    $lamarans = Lamaran::with(['pengguna.pelamarProfile'])
      ->where('lowongan_id', $lowongan->id)
      ->latest()
      ->get();

    return Inertia::render('hrd/seleksi/index', [
      'lowongan' => $lowongan,
      'lamarans' => $lamarans,
    ]);
  }

  /**
   * Tampilkan detail berkas satu pelamar untuk direview.
   */
  public function show(Lowongan $lowongan, Lamaran $lamaran): Response
  {
    $this->authorizeOwnership($lowongan);
    $this->authorizeLamaranBelongsToLowongan($lowongan, $lamaran);

    $lamaran->load([
      'pengguna.pelamarProfile',
      'pengguna.pengalamanKerjas',
    ]);

    return Inertia::render('hrd/seleksi/show', [
      'lowongan' => $lowongan,
      'lamaran' => $lamaran,
    ]);
  }

  /**
   * Loloskan pelamar ke tahap berikutnya (menunggu tes teknis).
   */
  public function lolos(Lamaran $lamaran): RedirectResponse
  {
    $this->authorizeOwnership($lamaran->lowongan);

    $lamaran->update(['status' => Lamaran::STATUS_LOLOS_ADMIN]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => "{$lamaran->pengguna->nama} berhasil diloloskan ke tahap berikutnya.",
    ]);

    return back();
  }

  /**
   * Tolak pelamar pada tahap seleksi administrasi.
   */
  public function tolak(Lamaran $lamaran): RedirectResponse
  {
    $this->authorizeOwnership($lamaran->lowongan);

    $lamaran->update(['status' => Lamaran::STATUS_GAGAL_ADMIN]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => "{$lamaran->pengguna->nama} ditolak pada tahap seleksi administrasi.",
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

  /**
   * Pastikan lamaran ini memang milik lowongan yang dimaksud (cegah IDOR via URL).
   */
  private function authorizeLamaranBelongsToLowongan(Lowongan $lowongan, Lamaran $lamaran): void
  {
    if ($lamaran->lowongan_id !== $lowongan->id) {
      abort(404);
    }
  }
}
