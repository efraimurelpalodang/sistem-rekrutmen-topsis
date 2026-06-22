<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Lowongan;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class LowonganController extends Controller
{
  /**
   * Tampilkan daftar lowongan yang sedang aktif untuk publik.
   */
  public function index(): Response
  {
    $lowongans = Lowongan::where('status', 'aktif')
      ->where('tgl_tutup', '>=', now())
      ->withCount('lamarans')
      ->latest()
      ->get();

    return Inertia::render('guest/karir/index', [
      'lowongans' => $lowongans,
    ]);
  }

  /**
   * Tampilkan detail satu lowongan untuk publik.
   */
  public function show(Lowongan $lowongan): Response
  {
    if ($lowongan->status !== 'aktif') {
      abort(404);
    }

    $sudahMelamar = false;

    if (Auth::check() && Auth::user()->role === 'pelamar') {
      $sudahMelamar = $lowongan->lamarans()
        ->where('pengguna_id', Auth::id())
        ->exists();
    }

    return Inertia::render('guest/karir/show', [
      'lowongan' => $lowongan,
      'sudahMelamar' => $sudahMelamar,
    ]);
  }
}
