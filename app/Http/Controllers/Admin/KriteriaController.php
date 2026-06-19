<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\KriteriaUpdateRequest;
use App\Models\Kriteria;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class KriteriaController extends Controller
{
  /**
   * Tampilkan daftar kriteria beserta bobotnya.
   */
  public function index(): Response
  {
    $kriterias = Kriteria::orderBy('urutan')->get();

    $totalBobot = $kriterias->sum('bobot');

    return Inertia::render('admin/kriteria/index', [
      'kriterias' => $kriterias,
      'totalBobot' => round($totalBobot, 2),
    ]);
  }

  /**
   * Update bobot dan tipe satu kriteria.
   */
  public function update(KriteriaUpdateRequest $request, Kriteria $kriteria): RedirectResponse
  {
    $kriteria->update($request->validated());

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Kriteria berhasil diperbarui.',
    ]);

    return to_route('admin.kriteria.index');
  }
}
