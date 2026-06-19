<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Halaman publik karir akan ditambahkan di sini saat BerandaController & LowonganController dibuat
// Route::get('/karir', [LowonganController::class, 'index'])->name('karir.index');
// Route::get('/karir/{id}', [LowonganController::class, 'show'])->name('karir.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        return match ($request->user()->role) {
            'pelamar' => to_route('pelamar.dashboard'),
            'hrd' => to_route('hrd.dashboard'),
            'admin' => to_route('admin.dashboard'),
            default => abort(403),
        };
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/pelamar.php';
require __DIR__ . '/hrd.php';
require __DIR__ . '/admin.php';
