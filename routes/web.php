<?php

use App\Http\Controllers\Auth\CekNikController;
use App\Http\Controllers\Guest\LowonganController as GuestLowonganController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Halaman publik karir
Route::get('/karir', [GuestLowonganController::class, 'index'])->name('karir.index');
Route::get('/karir/{lowongan}', [GuestLowonganController::class, 'show'])->name('karir.show');

// Cek NIK duplikat saat register (OCR KTP berjalan di browser via Tesseract.js)
Route::post('/cek-nik', [CekNikController::class, 'cek'])->name('cek-nik');

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
