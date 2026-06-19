<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:hrd'])->group(function () {

  Route::inertia('/hrd/dashboard', 'hrd/dashboard')->name('hrd.dashboard');

  // Lowongan
  // Route::get('/lowongan', [LowonganController::class, 'index'])->name('hrd.lowongan.index');
  // Route::get('/lowongan/create', [LowonganController::class, 'create'])->name('hrd.lowongan.create');
  // Route::post('/lowongan', [LowonganController::class, 'store'])->name('hrd.lowongan.store');
  // Route::get('/lowongan/{id}', [LowonganController::class, 'show'])->name('hrd.lowongan.show');
  // Route::get('/lowongan/{id}/edit', [LowonganController::class, 'edit'])->name('hrd.lowongan.edit');
  // Route::put('/lowongan/{id}', [LowonganController::class, 'update'])->name('hrd.lowongan.update');
  // Route::patch('/lowongan/{id}/toggle', [LowonganController::class, 'toggle'])->name('hrd.lowongan.toggle');

  // Tes Teknis
  // Route::get('/lowongan/{id}/tes/create', [TesController::class, 'create'])->name('hrd.tes.create');
  // Route::post('/lowongan/{id}/tes', [TesController::class, 'store'])->name('hrd.tes.store');
  // Route::get('/lowongan/{id}/tes/soal', [TesController::class, 'soal'])->name('hrd.tes.soal');
  // Route::post('/lowongan/{id}/tes/soal', [TesController::class, 'storeSoal'])->name('hrd.tes.soal.store');
  // Route::delete('/lowongan/{id}/tes/soal/{soalId}', [TesController::class, 'destroySoal'])->name('hrd.tes.soal.destroy');

  // Seleksi Administrasi
  // Route::get('/seleksi/{lowonganId}', [SeleksiController::class, 'index'])->name('hrd.seleksi.index');
  // Route::get('/seleksi/{lowonganId}/{lamaranId}', [SeleksiController::class, 'show'])->name('hrd.seleksi.show');
  // Route::patch('/seleksi/{lamaranId}/lolos', [SeleksiController::class, 'lolos'])->name('hrd.seleksi.lolos');
  // Route::patch('/seleksi/{lamaranId}/tolak', [SeleksiController::class, 'tolak'])->name('hrd.seleksi.tolak');

  // TOPSIS
  // Route::post('/topsis/{lowonganId}/hitung', [TopsisController::class, 'hitung'])->name('hrd.topsis.hitung');
  // Route::get('/topsis/{lowonganId}/hasil', [TopsisController::class, 'hasil'])->name('hrd.topsis.hasil');
  // Route::patch('/topsis/{hasilId}/terima', [TopsisController::class, 'terima'])->name('hrd.topsis.terima');
  // Route::patch('/topsis/{hasilId}/tolak', [TopsisController::class, 'tolak'])->name('hrd.topsis.tolak');
});
