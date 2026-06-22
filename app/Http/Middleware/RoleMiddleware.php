<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
  /**
   * Handle an incoming request.
   *
   * Penggunaan di route: ->middleware('role:hrd') atau ->middleware('role:hrd,admin')
   */
  public function handle(Request $request, Closure $next, string ...$roles): Response
  {
    $user = $request->user();

    if (! $user) {
      abort(401, 'Anda harus login terlebih dahulu.');
    }

    if (! in_array($user->role, $roles, true)) {
      abort(403, 'Anda tidak memiliki akses ke halaman ini.');
    }

    return $next($request);
  }
}
