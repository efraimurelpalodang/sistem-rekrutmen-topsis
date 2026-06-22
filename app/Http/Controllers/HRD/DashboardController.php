<?php

namespace App\Http\Controllers\HRD;

use App\Http\Controllers\Controller;
use App\Models\Lamaran;
use App\Models\Lowongan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function index()
  {
    $hrdId = Auth::id();

    // Lowongan aktif milik HRD ini
    $totalLowonganAktif = Lowongan::where('pengguna_id', $hrdId)
      ->where('status', 'aktif')
      ->count();

    // Total pelamar masuk di semua lowongan HRD ini
    $totalPelamarMasuk = Lamaran::whereHas('lowongan', fn($q) => $q->where('pengguna_id', $hrdId))
      ->count();

    // Pelamar menunggu seleksi admin (status: menunggu)
    $menantiSeleksi = Lamaran::whereHas('lowongan', fn($q) => $q->where('pengguna_id', $hrdId))
      ->where('status', 'menunggu')
      ->count();

    // 5 lowongan terbaru milik HRD ini beserta jumlah pelamar
    $lowonganTerbaru = Lowongan::where('pengguna_id', $hrdId)
      ->withCount('lamarans')
      ->latest()
      ->take(5)
      ->get(['id', 'judul', 'status', 'tgl_tutup', 'kuota']);

    // Pelamar terbaru yang masuk di lowongan milik HRD ini
    $pelamarTerbaru = Lamaran::with(['pengguna:id,nama', 'lowongan:id,judul'])
      ->whereHas('lowongan', fn($q) => $q->where('pengguna_id', $hrdId))
      ->latest()
      ->take(5)
      ->get(['id', 'pengguna_id', 'lowongan_id', 'status', 'created_at']);

    return Inertia::render('hrd/dashboard', [
      'stats' => [
        'total_lowongan_aktif' => $totalLowonganAktif,
        'total_pelamar_masuk'  => $totalPelamarMasuk,
        'menanti_seleksi'      => $menantiSeleksi,
      ],
      'lowongan_terbaru' => $lowonganTerbaru,
      'pelamar_terbaru'  => $pelamarTerbaru,
    ]);
  }
}
