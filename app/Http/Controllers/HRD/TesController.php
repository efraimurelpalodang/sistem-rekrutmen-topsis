<?php

namespace App\Http\Controllers\HRD;

use App\Http\Controllers\Controller;
use App\Http\Requests\HRD\SoalRequest;
use App\Http\Requests\HRD\TesTeknisRequest;
use App\Models\Lowongan;
use App\Models\Soal;
use App\Models\TesTeknis;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TesController extends Controller
{
  /**
   * Tampilkan form buat tes teknis baru untuk satu lowongan.
   */
  public function create(Lowongan $lowongan): Response
  {
    $this->authorizeOwnership($lowongan);

    // Kalau sudah ada tes, arahkan langsung ke kelola soal
    if ($lowongan->tesTeknis) {
      return Inertia::render('hrd/tes/soal-manager', [
        'lowongan' => $lowongan,
        'tesTeknis' => $lowongan->tesTeknis,
        'soals' => $lowongan->tesTeknis->soals,
      ]);
    }

    return Inertia::render('hrd/tes/create', [
      'lowongan' => $lowongan,
    ]);
  }

  /**
   * Simpan tes teknis baru (durasi & jumlah soal).
   */
  public function store(TesTeknisRequest $request, Lowongan $lowongan): RedirectResponse
  {
    $this->authorizeOwnership($lowongan);

    if ($lowongan->tesTeknis) {
      abort(422, 'Lowongan ini sudah memiliki tes teknis.');
    }

    TesTeknis::create([
      ...$request->validated(),
      'lowongan_id' => $lowongan->id,
    ]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Tes teknis berhasil dibuat. Silakan tambahkan soal ke bank soal.',
    ]);

    return to_route('hrd.tes.soal', $lowongan->id);
  }

  /**
   * Tampilkan halaman kelola bank soal.
   */
  public function soal(Lowongan $lowongan): Response
  {
    $this->authorizeOwnership($lowongan);

    if (! $lowongan->tesTeknis) {
      return to_route('hrd.tes.create', $lowongan->id);
    }

    $lowongan->tesTeknis->load('soals');

    return Inertia::render('hrd/tes/soal-manager', [
      'lowongan' => $lowongan,
      'tesTeknis' => $lowongan->tesTeknis,
      'soals' => $lowongan->tesTeknis->soals,
    ]);
  }

  /**
   * Tambah soal baru ke bank soal.
   */
  public function storeSoal(SoalRequest $request, Lowongan $lowongan): RedirectResponse
  {
    $this->authorizeOwnership($lowongan);

    if (! $lowongan->tesTeknis) {
      abort(422, 'Lowongan ini belum memiliki tes teknis.');
    }

    Soal::create([
      ...$request->validated(),
      'tes_id' => $lowongan->tesTeknis->id,
    ]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Soal berhasil ditambahkan.',
    ]);

    return back();
  }

  /**
   * Hapus soal dari bank soal.
   */
  public function destroySoal(Lowongan $lowongan, Soal $soal): RedirectResponse
  {
    $this->authorizeOwnership($lowongan);

    if ($soal->tes_id !== $lowongan->tesTeknis?->id) {
      abort(404);
    }

    $soal->delete();

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Soal berhasil dihapus.',
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
