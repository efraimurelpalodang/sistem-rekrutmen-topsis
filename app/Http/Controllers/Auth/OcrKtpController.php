<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Pengguna;
use App\Services\OcrKtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OcrKtpController extends Controller
{
  public function __construct(
    private readonly OcrKtpService $ocrKtpService,
  ) {}

  /**
   * Proses foto KTP yang diupload, kembalikan data hasil OCR ke frontend
   * untuk mengisi form register secara otomatis. Pelamar tetap dapat
   * mengoreksi data sebelum submit final.
   */
  public function proses(Request $request): JsonResponse
  {
    $request->validate([
      'foto' => ['required', 'string'],
    ]);

    $hasil = $this->ocrKtpService->proses($request->input('foto'));

    if (! $hasil['success']) {
      return response()->json([
        'success' => false,
        'message' => $hasil['message'],
        'data' => $hasil['data'],
      ], 422);
    }

    // Cek apakah NIK sudah terdaftar sebelumnya
    $nikSudahAda = Pengguna::where('nik', $hasil['data']['nik'])->exists();

    if ($nikSudahAda) {
      return response()->json([
        'success' => false,
        'message' => 'NIK ini sudah terdaftar. Jika ini adalah akun Anda, silakan login.',
        'data' => $hasil['data'],
      ], 422);
    }

    return response()->json([
      'success' => true,
      'message' => null,
      'data' => $hasil['data'],
    ]);
  }
}
