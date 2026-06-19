<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {

  Route::inertia('/admin/dashboard', 'admin/dashboard')->name('admin.dashboard');

  // Kriteria
  // Route::get('/kriteria', [KriteriaController::class, 'index'])->name('admin.kriteria.index');
  // Route::put('/kriteria/{id}', [KriteriaController::class, 'update'])->name('admin.kriteria.update');
});
