<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CekNikController extends Controller
{
  /**
   * Cek apakah NIK sudah terdaftar. Dipanggil dari frontend setelah
   * OCR KTP (berjalan di browser via Tesseract.js) berhasil membaca NIK,
   * sebelum form register ditampilkan ke pelamar.
   */
  public function cek(Request $request): JsonResponse
  {
    $request->validate([
      'nik' => ['required', 'string', 'size:16'],
    ]);

    $sudahAda = Pengguna::where('nik', $request->input('nik'))->exists();

    return response()->json(['sudahAda' => $sudahAda]);
  }
}
