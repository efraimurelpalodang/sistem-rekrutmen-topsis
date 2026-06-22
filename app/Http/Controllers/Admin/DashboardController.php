<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kriteria;
use App\Models\Pengguna;
use App\Models\Lowongan;
use App\Models\HasilTopsis;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
  public function index(): Response
  {
    $kriterias = Kriteria::orderBy('urutan')->get(['id', 'nama', 'bobot', 'tipe', 'urutan']);

    $statistik = [
      'total_pelamar'  => Pengguna::where('role', 'pelamar')->count(),
      'total_hrd'      => Pengguna::where('role', 'hrd')->count(),
      'lowongan_aktif' => Lowongan::where('status', 'aktif')->count(),
      // Lowongan yang hasil TOPSIS-nya sudah dihitung (ada entri di hasil_topsis)
      'proses_topsis'  => HasilTopsis::distinct('lowongan_id')->count('lowongan_id'),
    ];

    return Inertia::render('admin/dashboard', [
      'statistik'   => $statistik,
      'kriterias'   => $kriterias,
      'total_bobot' => round($kriterias->sum('bobot'), 10),
    ]);
  }
}
