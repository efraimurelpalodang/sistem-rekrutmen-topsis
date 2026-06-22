<?php

namespace App\Http\Middleware;

use App\Models\Lamaran;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CekSudahTesMiddleware
{
  /**
   * Handle an incoming request.
   *
   * Memastikan pelamar hanya bisa akses route tes (show/jawab/submit) jika:
   * 1. Lamaran tersebut miliknya
   * 2. Status lamaran adalah 'menunggu_tes' (belum submit) ATAU
   *    sedang dalam proses submit akhir
   * 3. Belum pernah submit hasil tes sebelumnya (tgl_selesai masih null)
   */
  public function handle(Request $request, Closure $next): Response
  {
    $lamaran = Lamaran::with('hasilTes')
      ->findOrFail($request->route('lamaran')->id);

    if ($lamaran->pengguna_id !== $request->user()->id) {
      abort(403, 'Lamaran ini bukan milik Anda.');
    }

    if ($lamaran->status !== Lamaran::STATUS_MENUNGGU_TES) {
      abort(403, 'Anda tidak dapat mengakses tes ini saat ini.');
    }

    if ($lamaran->hasilTes && $lamaran->hasilTes->tgl_selesai !== null) {
      abort(403, 'Anda sudah menyelesaikan tes ini sebelumnya.');
    }

    return $next($request);
  }
}
