<?php

use App\Http\Controllers\HRD\DashboardController;
use App\Http\Controllers\HRD\LowonganController;
use App\Http\Controllers\HRD\SeleksiController;
use App\Http\Controllers\HRD\TesController;
use App\Http\Controllers\HRD\TopsisController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:hrd'])->group(function () {

  Route::get('/hrd/dashboard', [DashboardController::class, 'index'])
    ->name('hrd.dashboard');

  // Lowongan
  Route::get('/lowongan', [LowonganController::class, 'index'])->name('hrd.lowongan.index');
  Route::get('/lowongan/create', [LowonganController::class, 'create'])->name('hrd.lowongan.create');
  Route::post('/lowongan', [LowonganController::class, 'store'])->name('hrd.lowongan.store');
  Route::get('/lowongan/{lowongan}', [LowonganController::class, 'show'])->name('hrd.lowongan.show');
  Route::get('/lowongan/{lowongan}/edit', [LowonganController::class, 'edit'])->name('hrd.lowongan.edit');
  Route::put('/lowongan/{lowongan}', [LowonganController::class, 'update'])->name('hrd.lowongan.update');
  Route::patch('/lowongan/{lowongan}/toggle', [LowonganController::class, 'toggle'])->name('hrd.lowongan.toggle');
  Route::delete('/lowongan/{lowongan}', [LowonganController::class, 'destroy'])->name('hrd.lowongan.destroy');

  // Tes Teknis & Bank Soal
  Route::get('/lowongan/{lowongan}/tes/create', [TesController::class, 'create'])->name('hrd.tes.create');
  Route::post('/lowongan/{lowongan}/tes', [TesController::class, 'store'])->name('hrd.tes.store');
  Route::get('/lowongan/{lowongan}/tes/soal', [TesController::class, 'soal'])->name('hrd.tes.soal');
  Route::post('/lowongan/{lowongan}/tes/soal', [TesController::class, 'storeSoal'])->name('hrd.tes.soal.store');
  Route::delete('/lowongan/{lowongan}/tes/soal/{soal}', [TesController::class, 'destroySoal'])->name('hrd.tes.soal.destroy');
  Route::post('/lowongan/{lowongan}/tes/buka', [TesController::class, 'bukaTes'])->name('hrd.tes.buka');

  // Seleksi Administrasi
  Route::get('/seleksi/{lowongan}', [SeleksiController::class, 'index'])->name('hrd.seleksi.index');
  Route::get('/seleksi/{lowongan}/{lamaran}', [SeleksiController::class, 'show'])->name('hrd.seleksi.show');
  Route::patch('/seleksi/{lamaran}/lolos', [SeleksiController::class, 'lolos'])->name('hrd.seleksi.lolos');
  Route::patch('/seleksi/{lamaran}/tolak', [SeleksiController::class, 'tolak'])->name('hrd.seleksi.tolak');

  // TOPSIS
  Route::get('/topsis/{lowongan}/hasil', [TopsisController::class, 'hasil'])->name('hrd.topsis.hasil');
  Route::patch('/topsis/{hasilTopsis}/terima', [TopsisController::class, 'terima'])->name('hrd.topsis.terima');
  Route::patch('/topsis/{hasilTopsis}/tolak', [TopsisController::class, 'tolak'])->name('hrd.topsis.tolak');
  Route::get('/topsis/{lowongan}/keputusan', [TopsisController::class, 'keputusan'])->name('hrd.topsis.keputusan');
  Route::get('/topsis/{lowongan}/export-hasil-pdf', [TopsisController::class, 'exportHasilPdf'])->name('hrd.topsis.export-hasil-pdf');
  Route::get('/topsis/{lowongan}/export-keputusan-pdf', [TopsisController::class, 'exportKeputusanPdf'])->name('hrd.topsis.export-keputusan-pdf');
});
