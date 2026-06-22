<?php

namespace App\Http\Controllers\Pelamar;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pelamar\PelamarProfilRequest;
use App\Models\PelamarProfile;
use App\Models\PengalamanKerja;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfilController extends Controller
{
  /**
   * Tampilkan form edit profil pelamar.
   */
  public function edit(Request $request): Response
  {
    $pengguna = $request->user();
    $pengguna->load(['pelamarProfile', 'pengalamanKerjas']);

    return Inertia::render('pelamar/profil', [
      'pengguna' => $pengguna,
    ]);
  }

  /**
   * Update profil pelamar (data diri + pendidikan).
   * Pengalaman kerja dikelola terpisah lewat endpoint sendiri.
   */
  public function update(PelamarProfilRequest $request): RedirectResponse
  {
    $pengguna = $request->user();
    $validated = $request->validated();

    // Update data diri di tabel penggunas
    $pengguna->update([
      'nama' => $validated['nama'],
      'alamat' => $validated['alamat'],
      'no_hp' => $validated['no_hp'] ?? null,
    ]);

    // Update atau buat profil pendidikan di pelamar_profiles
    PelamarProfile::updateOrCreate(
      ['pengguna_id' => $pengguna->id],
      [
        'pendidikan' => $validated['pendidikan'],
        'jurusan' => $validated['jurusan'] ?? null,
        'institusi' => $validated['institusi'] ?? null,
        'nilai_akademik' => $validated['nilai_akademik'],
        'tipe_nilai' => $validated['tipe_nilai'],
        'tahun_lulus' => $validated['tahun_lulus'] ?? null,
      ],
    );

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Profil berhasil diperbarui.',
    ]);

    return to_route('pelamar.profil.edit');
  }

  /**
   * Tambah satu entri pengalaman kerja.
   */
  public function storePengalaman(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'nama_perusahaan' => ['required', 'string', 'max:255'],
      'posisi' => ['required', 'string', 'max:255'],
      'bulan_mulai' => ['required', 'date'],
      'bulan_selesai' => ['nullable', 'date', 'after_or_equal:bulan_mulai'],
    ]);

    PengalamanKerja::create([
      ...$validated,
      'pengguna_id' => $request->user()->id,
    ]);

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Pengalaman kerja berhasil ditambahkan.',
    ]);

    return back();
  }

  /**
   * Hapus satu entri pengalaman kerja.
   */
  public function destroyPengalaman(Request $request, PengalamanKerja $pengalaman): RedirectResponse
  {
    if ($pengalaman->pengguna_id !== $request->user()->id) {
      abort(403);
    }

    $pengalaman->delete();

    Inertia::flash('toast', [
      'type' => 'success',
      'message' => 'Pengalaman kerja berhasil dihapus.',
    ]);

    return back();
  }
}
