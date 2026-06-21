<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CekProfilLengkapMiddleware
{
  /**
   * Handle an incoming request.
   *
   * Memastikan pelamar sudah melengkapi data profil (pendidikan, nilai
   * akademik) sebelum bisa mengirim lamaran. Data ini wajib lengkap
   * lebih dulu karena dipakai langsung sebagai input kalkulasi TOPSIS.
   */
  public function handle(Request $request, Closure $next): Response
  {
    $pengguna = $request->user();
    $pengguna->loadMissing('pelamarProfile');

    if (! $pengguna->pelamarProfile) {
      Inertia::flash('toast', [
        'type' => 'error',
        'message' => 'Lengkapi profil Anda terlebih dahulu sebelum melamar.',
      ]);

      return redirect()->route('pelamar.profil.edit');
    }

    return $next($request);
  }
}
