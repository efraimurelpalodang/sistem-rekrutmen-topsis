<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OcrKtpService
{
  private string $apiKey;

  public function __construct()
  {
    $this->apiKey = config('services.google_vision.key', env('GOOGLE_VISION_API_KEY', ''));
  }

  /**
   * Proses foto KTP (base64) lewat Google Cloud Vision API, lalu parsing
   * teks mentah hasil OCR menjadi field-field data yang dibutuhkan form
   * register: NIK, nama, tempat/tanggal lahir, jenis kelamin, alamat.
   *
   * @return array{
   *     success: bool,
   *     message: string|null,
   *     data: array{
   *         nik: string|null,
   *         nama: string|null,
   *         tempat_lahir: string|null,
   *         tgl_lahir: string|null,
   *         jenis_kelamin: string|null,
   *         alamat: string|null,
   *     }|null,
   * }
   */
  public function proses(string $base64Image): array
  {
    if (empty($this->apiKey)) {
      Log::error('OcrKtpService: GOOGLE_VISION_API_KEY belum diset di .env');

      return [
        'success' => false,
        'message' => 'Layanan OCR sedang tidak tersedia. Silakan hubungi administrator.',
        'data' => null,
      ];
    }

    // Hapus prefix data URL jika ada (mis. "data:image/jpeg;base64,...")
    $base64Image = preg_replace('#^data:image/\w+;base64,#', '', $base64Image);

    try {
      $response = Http::timeout(30)->post(
        "https://vision.googleapis.com/v1/images:annotate?key={$this->apiKey}",
        [
          'requests' => [
            [
              'image' => ['content' => $base64Image],
              'features' => [
                ['type' => 'TEXT_DETECTION'],
              ],
              'imageContext' => [
                'languageHints' => ['id'],
              ],
            ],
          ],
        ],
      );
    } catch (\Throwable $e) {
      Log::error('OcrKtpService: gagal menghubungi Vision API', ['error' => $e->getMessage()]);

      return [
        'success' => false,
        'message' => 'Gagal menghubungi layanan OCR. Periksa koneksi internet Anda dan coba lagi.',
        'data' => null,
      ];
    }

    if ($response->failed()) {
      Log::error('OcrKtpService: Vision API merespons error', ['body' => $response->body()]);

      return [
        'success' => false,
        'message' => 'Layanan OCR gagal memproses gambar. Pastikan foto KTP jelas dan coba lagi.',
        'data' => null,
      ];
    }

    $teksMentah = $response->json('responses.0.fullTextAnnotation.text');

    if (empty($teksMentah)) {
      return [
        'success' => false,
        'message' => 'Tidak ada teks yang terbaca dari foto. Pastikan foto KTP tidak buram atau miring, lalu coba lagi.',
        'data' => null,
      ];
    }

    $data = $this->parsing($teksMentah);

    // NIK adalah data paling kritis (dipakai cek duplikat akun).
    // Jika gagal terbaca sama sekali, anggap OCR gagal.
    if (empty($data['nik'])) {
      return [
        'success' => false,
        'message' => 'NIK tidak dapat terbaca dengan jelas dari foto. Silakan foto ulang KTP dengan pencahayaan yang lebih baik.',
        'data' => $data, // tetap kirim data lain yang berhasil terbaca, untuk koreksi manual
      ];
    }

    return [
      'success' => true,
      'message' => null,
      'data' => $data,
    ];
  }

  /**
   * Parsing teks mentah hasil OCR Vision API menjadi field-field
   * terstruktur menggunakan regex, mengikuti pola umum tata letak KTP
   * Indonesia.
   *
   * @return array{
   *     nik: string|null,
   *     nama: string|null,
   *     tempat_lahir: string|null,
   *     tgl_lahir: string|null,
   *     jenis_kelamin: string|null,
   *     alamat: string|null,
   * }
   */
  private function parsing(string $teks): array
  {
    $teks = str_replace("\r", '', $teks);
    $baris = array_filter(array_map('trim', explode("\n", $teks)));
    $baris = array_values($baris);
    $teksGabung = implode(' ', $baris);

    return [
      'nik' => $this->cariNik($teksGabung),
      'nama' => $this->cariNama($baris),
      'tempat_lahir' => $this->cariTempatLahir($teksGabung),
      'tgl_lahir' => $this->cariTanggalLahir($teksGabung),
      'jenis_kelamin' => $this->cariJenisKelamin($teksGabung),
      'alamat' => $this->cariAlamat($baris),
    ];
  }

  private function cariNik(string $teks): ?string
  {
    // NIK selalu 16 digit angka berurutan
    if (preg_match('/\b(\d{16})\b/', preg_replace('/\s+/', '', $teks), $match)) {
      return $match[1];
    }

    return null;
  }

  private function cariNama(array $baris): ?string
  {
    foreach ($baris as $i => $line) {
      if (stripos($line, 'Nama') !== false) {
        // Nama biasanya setelah label "Nama", kadang di baris yang sama
        // setelah tanda titik dua, kadang di baris berikutnya.
        $setelahLabel = trim(preg_replace('/.*Nama\s*:?\s*/i', '', $line));

        if (! empty($setelahLabel) && strlen($setelahLabel) > 2) {
          return $setelahLabel;
        }

        if (isset($baris[$i + 1])) {
          return trim($baris[$i + 1]);
        }
      }
    }

    return null;
  }

  private function cariTempatLahir(string $teks): ?string
  {
    // Pola: "Tempat/Tgl Lahir: KOTA, DD-MM-YYYY"
    if (preg_match('/Tempat.{0,15}Lahir\s*:?\s*([A-Za-z\s]+),/i', $teks, $match)) {
      return trim($match[1]);
    }

    return null;
  }

  private function cariTanggalLahir(string $teks): ?string
  {
    // Format umum KTP: DD-MM-YYYY
    if (preg_match('/(\d{2})-(\d{2})-(\d{4})/', $teks, $match)) {
      return "{$match[3]}-{$match[2]}-{$match[1]}"; // konversi ke Y-m-d
    }

    return null;
  }

  private function cariJenisKelamin(string $teks): ?string
  {
    if (preg_match('/LAKI[\s-]?LAKI/i', $teks)) {
      return 'L';
    }

    if (preg_match('/PEREMPUAN/i', $teks)) {
      return 'P';
    }

    return null;
  }

  private function cariAlamat(array $baris): ?string
  {
    foreach ($baris as $i => $line) {
      if (stripos($line, 'Alamat') !== false) {
        $setelahLabel = trim(preg_replace('/.*Alamat\s*:?\s*/i', '', $line));

        if (! empty($setelahLabel) && strlen($setelahLabel) > 3) {
          return $setelahLabel;
        }

        if (isset($baris[$i + 1])) {
          return trim($baris[$i + 1]);
        }
      }
    }

    return null;
  }
}
