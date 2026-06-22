<?php

namespace App\Http\Controllers\Pelamar;

use App\Http\Controllers\Controller;
use App\Models\Lamaran;
use App\Models\Lowongan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LamaranController extends Controller
{
  /**
   * Tampilkan daftar lamaran milik pelamar yang login.
   */
  public function index(Request $request): Response
  {
    $lamarans = Lamaran::where('pengguna_id', $request->user()->id)
      ->with('lowongan')
      ->latest()
      ->get();

    return Inertia::render('pelamar/lamaran/index', [
      'lamarans' => $lamarans,
    ]);
  }

  /**
   * Tampilkan detail satu lamaran beserta timeline status.
   */
  public function show(Request $request, Lamaran $lamaran): Response
  {
    $this->authorizeOwnership($request, $lamaran);

    $lamaran->load(['lowongan', 'hasilTes']);

    return Inertia::render('pelamar/lamaran/show', [
      'lamaran' => $lamaran,
    ]);
  }

  /**
   * Kirim lamaran baru ke sebuah lowongan.
   */
  public function store(Request $request, Lowongan $lowongan): RedirectResponse
  {
    if ($lowongan->status !== 'aktif') {
      abort(403, 'Lowongan ini sudah tidak menerima lamaran.');
    }

    $sudahMelamar = Lamaran::where('pengguna_id', $request->user()->id)
      ->where('lowongan_id', $lowongan->id)
      ->exists();

    if ($sudahMelamar) {
      Inertia::flash('toast', [
        'type' => 'error',
        'message' => 'Anda sudah pernah melamar ke lowongan ini.',
      ]);

      return back();
    }

    $lamaran = Lamaran::create([
      'pengguna_id' => $request->user()->id,
      'lowongan_id' => $lowongan->id,
      'status' => Lamaran::STATUS_MENUNGGU,
    ]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Lamaran berhasil dikirim. Anda dapat memantau statusnya di halaman Lamaran Saya.',
    ]);

    return to_route('pelamar.lamaran.show', $lamaran->id);
  }

  /**
   * Pastikan lamaran ini milik pelamar yang sedang login.
   */
  private function authorizeOwnership(Request $request, Lamaran $lamaran): void
  {
    if ($lamaran->pengguna_id !== $request->user()->id) {
      abort(403, 'Anda tidak memiliki akses ke lamaran ini.');
    }
  }
}
