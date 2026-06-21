<?php

use App\Http\Controllers\Pelamar\DashboardController;
use App\Http\Controllers\Pelamar\LamaranController;
use App\Http\Controllers\Pelamar\ProfilController;
use App\Http\Controllers\Pelamar\TesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:pelamar'])->group(function () {

  Route::get('/pelamar/dashboard', [DashboardController::class, 'index'])->name('pelamar.dashboard');

  // Profil
  Route::get('/profil', [ProfilController::class, 'edit'])->name('pelamar.profil.edit');
  Route::put('/profil', [ProfilController::class, 'update'])->name('pelamar.profil.update');
  Route::post('/profil/pengalaman', [ProfilController::class, 'storePengalaman'])->name('pelamar.profil.pengalaman.store');
  Route::delete('/profil/pengalaman/{pengalaman}', [ProfilController::class, 'destroyPengalaman'])->name('pelamar.profil.pengalaman.destroy');

  // Lamaran
  Route::get('/lamaran', [LamaranController::class, 'index'])->name('pelamar.lamaran.index');
  Route::get('/lamaran/{lamaran}', [LamaranController::class, 'show'])->name('pelamar.lamaran.show');
  Route::post('/lamaran/{lowongan}', [LamaranController::class, 'store'])
    ->middleware('cek.profil.lengkap')
    ->name('pelamar.lamaran.store');

  // Tes Teknis
  Route::middleware('cek.sudah.tes')->group(function () {
    Route::get('/tes/{lamaran}', [TesController::class, 'show'])->name('pelamar.tes.show');
    Route::post('/tes/{lamaran}/jawab', [TesController::class, 'jawab'])->name('pelamar.tes.jawab');
    Route::post('/tes/{lamaran}/submit', [TesController::class, 'submit'])->name('pelamar.tes.submit');
  });
});
