<?php

namespace App\Http\Controllers\HRD;

use App\Http\Controllers\Controller;
use App\Http\Requests\HRD\LowonganRequest;
use App\Models\Lowongan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LowonganController extends Controller
{
  /**
   * Tampilkan daftar lowongan milik HRD yang login.
   */
  public function index(Request $request): Response
  {
    $lowongans = Lowongan::where('pengguna_id', $request->user()->id)
      ->withCount('lamarans')
      ->latest()
      ->get();

    return Inertia::render('hrd/lowongan/index', [
      'lowongans' => $lowongans,
    ]);
  }

  /**
   * Tampilkan form buat lowongan baru.
   */
  public function create(): Response
  {
    return Inertia::render('hrd/lowongan/create');
  }

  /**
   * Simpan lowongan baru.
   */
  public function store(LowonganRequest $request): RedirectResponse
  {
    $lowongan = Lowongan::create([
      ...$request->validated(),
      'pengguna_id' => $request->user()->id,
      'status' => 'aktif',
    ]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Lowongan berhasil dibuat.',
    ]);

    return to_route('hrd.lowongan.show', $lowongan->id);
  }

  /**
   * Tampilkan detail lowongan beserta daftar pelamar.
   */
  public function show(Lowongan $lowongan): Response
  {
    $this->authorizeOwnership($lowongan);

    $lowongan->load([
      'lamarans.pengguna',
      'tesTeknis',
    ]);

    return Inertia::render('hrd/lowongan/show', [
      'lowongan' => $lowongan,
    ]);
  }

  /**
   * Tampilkan form edit lowongan.
   */
  public function edit(Lowongan $lowongan): Response
  {
    $this->authorizeOwnership($lowongan);
    $this->authorizeEditable($lowongan);

    return Inertia::render('hrd/lowongan/edit', [
      'lowongan' => $lowongan,
    ]);
  }

  /**
   * Update lowongan.
   */
  public function update(LowonganRequest $request, Lowongan $lowongan): RedirectResponse
  {
    $this->authorizeOwnership($lowongan);
    $this->authorizeEditable($lowongan);

    $lowongan->update($request->validated());

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Lowongan berhasil diperbarui.',
    ]);

    return to_route('hrd.lowongan.show', $lowongan->id);
  }

  /**
   * Buka/tutup status lowongan. Saat dibuka kembali, tgl_tutup otomatis
   * diperpanjang 30 hari dari sekarang -- mencegah lowongan yang sudah
   * lewat tanggal tutupnya tetap tersembunyi dari halaman karir publik
   * meskipun statusnya sudah diubah jadi aktif.
   */
  public function toggle(Lowongan $lowongan): RedirectResponse
  {
    $this->authorizeOwnership($lowongan);

    $statusBaru = $lowongan->status === 'aktif' ? 'ditutup' : 'aktif';

    $update = ['status' => $statusBaru];

    if ($statusBaru === 'aktif') {
      $update['tgl_tutup'] = now()->addDays(30)->toDateString();
    }

    $lowongan->update($update);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => $statusBaru === 'aktif'
        ? 'Lowongan dibuka kembali. Tanggal tutup diperpanjang hingga ' . now()->addDays(30)->translatedFormat('d F Y') . '.'
        : 'Lowongan ditutup.',
    ]);

    return back();
  }

  /**
   * Hapus lowongan. Hanya diizinkan jika belum ada pelamar sama sekali,
   * untuk mencegah hilangnya data lamaran/hasil tes/hasil TOPSIS secara permanen.
   */
  public function destroy(Lowongan $lowongan): RedirectResponse
  {
    $this->authorizeOwnership($lowongan);

    if ($lowongan->lamarans()->exists()) {
      Inertia::flash('toast', [
        'type' => 'error',
        'message' => 'Lowongan tidak dapat dihapus karena sudah memiliki pelamar. Gunakan opsi "Tutup Lowongan" sebagai gantinya.',
      ]);

      return back();
    }

    $lowongan->delete();

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Lowongan berhasil dihapus.',
    ]);

    return to_route('hrd.lowongan.index');
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
   * Pastikan lowongan masih berstatus aktif sebelum boleh diedit.
   * Lowongan yang sudah ditutup tidak dapat diubah lagi untuk
   * menjaga konsistensi data selama proses seleksi & TOPSIS berjalan.
   */
  private function authorizeEditable(Lowongan $lowongan): void
  {
    if ($lowongan->status !== 'aktif') {
      abort(403, 'Lowongan yang sudah ditutup tidak dapat diedit.');
    }
  }
}
