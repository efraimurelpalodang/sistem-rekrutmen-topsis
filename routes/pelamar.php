<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:pelamar'])->group(function () {

  Route::inertia('/pelamar/dashboard', 'pelamar/dashboard')->name('pelamar.dashboard');

  // Profil
  // Route::get('/profil', [ProfilController::class, 'edit'])->name('pelamar.profil.edit');
  // Route::put('/profil', [ProfilController::class, 'update'])->name('pelamar.profil.update');

  // Lamaran
  // Route::get('/lamaran', [LamaranController::class, 'index'])->name('pelamar.lamaran.index');
  // Route::get('/lamaran/{id}', [LamaranController::class, 'show'])->name('pelamar.lamaran.show');
  // Route::post('/lamaran/{lowonganId}', [LamaranController::class, 'store'])->name('pelamar.lamaran.store');

  // Tes Teknis — pakai middleware tambahan cek.sudah.tes
  // Route::middleware('cek.sudah.tes')->group(function () {
  //     Route::get('/tes/{lamaranId}', [TesController::class, 'show'])->name('pelamar.tes.show');
  //     Route::post('/tes/{lamaranId}/submit', [TesController::class, 'submit'])->name('pelamar.tes.submit');
  // });
});
