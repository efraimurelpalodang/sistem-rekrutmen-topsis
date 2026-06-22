<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KriteriaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {

  Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

  Route::get('/kriteria', [KriteriaController::class, 'index'])->name('admin.kriteria.index');
  Route::put('/kriteria/{kriteria}', [KriteriaController::class, 'update'])->name('admin.kriteria.update');
});
