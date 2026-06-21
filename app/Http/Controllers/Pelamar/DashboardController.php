<?php

namespace App\Http\Controllers\Pelamar;

use App\Http\Controllers\Controller;
use App\Models\Lamaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
  /**
   * Tampilkan dashboard pelamar dengan ringkasan lamaran terbaru.
   */
  public function index(Request $request): Response
  {
    $pengguna = $request->user();
    $pengguna->loadMissing('pelamarProfile');

    $lamaransTerbaru = Lamaran::where('pengguna_id', $pengguna->id)
      ->with('lowongan')
      ->latest()
      ->take(5)
      ->get();

    return Inertia::render('pelamar/dashboard', [
      'lamaransTerbaru' => $lamaransTerbaru,
      'profilLengkap' => $pengguna->pelamarProfile !== null,
    ]);
  }
}
