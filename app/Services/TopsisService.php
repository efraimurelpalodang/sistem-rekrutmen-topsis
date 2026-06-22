<?php

namespace App\Services;

use App\Models\DetailTopsis;
use App\Models\HasilTopsis;
use App\Models\Kriteria;
use App\Models\Lamaran;
use App\Models\Lowongan;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TopsisService
{
  /**
   * Jumlah minimal pelamar yang sudah selesai tes agar TOPSIS bisa dihitung.
   */
  private const MIN_PELAMAR = 2;

  /**
   * Konversi jenjang pendidikan ke nilai angka untuk matriks keputusan.
   */
  private const NILAI_PENDIDIKAN = [
    'SMA' => 1,
    'SMK' => 2,
    'D3' => 3,
    'S1' => 4,
    'S2' => 5,
    'S3' => 6,
  ];

  /**
   * Hitung TOPSIS untuk satu lowongan dan simpan hasilnya ke database.
   * Menghapus hasil perhitungan sebelumnya (jika ada) sebelum menghitung ulang.
   *
   * @return Collection<int, HasilTopsis>|null Null jika data tidak cukup untuk dihitung.
   */
  public function hitung(Lowongan $lowongan): ?Collection
  {
    $lamarans = $this->ambilLamaranSiapDinilai($lowongan);

    if ($lamarans->count() < self::MIN_PELAMAR) {
      return null;
    }

    $kriterias = Kriteria::orderBy('urutan')->get();

    if ($kriterias->isEmpty()) {
      return null;
    }

    return DB::transaction(function () use ($lowongan, $lamarans, $kriterias) {
      // Hapus hasil perhitungan sebelumnya untuk lowongan ini.
      // detail_topsis ikut terhapus otomatis lewat cascadeOnDelete.
      HasilTopsis::where('lowongan_id', $lowongan->id)->delete();

      // Step 1: Bangun matriks keputusan
      // matriks[lamaran_id][kriteria_id] = nilai mentah
      $matriks = $this->bangunMatriksKeputusan($lamarans, $kriterias);

      // Step 2: Normalisasi matriks (metode vektor)
      $normalisasi = $this->normalisasiVektor($matriks, $kriterias, $lamarans);

      // Step 3: Matriks ternormalisasi terbobot
      $terbobot = $this->bobotiMatriks($normalisasi, $kriterias, $lamarans);

      // Step 4: Solusi ideal positif (A+) dan negatif (A-)
      [$solusiPositif, $solusiNegatif] = $this->hitungSolusiIdeal($terbobot, $kriterias, $lamarans);

      // Step 5 & 6: Jarak ke solusi ideal + nilai preferensi (skor akhir)
      $skorPerLamaran = $this->hitungSkorPreferensi(
        $terbobot,
        $kriterias,
        $lamarans,
        $solusiPositif,
        $solusiNegatif,
      );

      // Step 7: Ranking berdasarkan skor tertinggi ke terendah
      $terurut = $skorPerLamaran->sortByDesc('skor')->values();

      $hasilTopsisList = collect();

      foreach ($terurut as $index => $item) {
        $hasilTopsis = HasilTopsis::create([
          'lowongan_id' => $lowongan->id,
          'lamaran_id' => $item['lamaran_id'],
          'skor' => $item['skor'],
          'ranking' => $index + 1,
        ]);

        // Simpan detail perhitungan per kriteria
        foreach ($kriterias as $kriteria) {
          DetailTopsis::create([
            'hasil_topsis_id' => $hasilTopsis->id,
            'kriteria_id' => $kriteria->id,
            'nilai_asli' => $matriks[$item['lamaran_id']][$kriteria->id],
            'nilai_normalisasi' => $normalisasi[$item['lamaran_id']][$kriteria->id],
            'nilai_terbobot' => $terbobot[$item['lamaran_id']][$kriteria->id],
          ]);
        }

        $hasilTopsisList->push($hasilTopsis);
      }

      return $hasilTopsisList;
    });
  }

  /**
   * Ambil semua lamaran pada lowongan ini yang sudah selesai tes teknis,
   * beserta data yang dibutuhkan untuk kalkulasi (pendidikan, nilai akademik,
   * usia, pengalaman kerja, nilai tes).
   */
  private function ambilLamaranSiapDinilai(Lowongan $lowongan): Collection
  {
    return Lamaran::where('lowongan_id', $lowongan->id)
      ->whereIn('status', [
        Lamaran::STATUS_SELESAI_TES,
        Lamaran::STATUS_DITERIMA,
        Lamaran::STATUS_DITOLAK,
      ])
      ->with([
        'pengguna.pelamarProfile',
        'pengguna.pengalamanKerjas',
        'hasilTes',
      ])
      ->get()
      ->filter(function (Lamaran $lamaran) {
        return $lamaran->pengguna->pelamarProfile !== null
          && $lamaran->pengguna->tgl_lahir !== null
          && $lamaran->hasilTes !== null;
      })
      ->values();
  }

  /**
   * Step 1: Bangun matriks keputusan mentah.
   * Baris = lamaran, kolom = kriteria.
   *
   * @return array<int, array<int, float>>
   */
  private function bangunMatriksKeputusan(Collection $lamarans, Collection $kriterias): array
  {
    $matriks = [];

    foreach ($lamarans as $lamaran) {
      $matriks[$lamaran->id] = [];

      foreach ($kriterias as $kriteria) {
        $matriks[$lamaran->id][$kriteria->id] = $this->nilaiUntukKriteria($lamaran, $kriteria);
      }
    }

    return $matriks;
  }

  /**
   * Ambil nilai mentah seorang pelamar untuk satu kriteria tertentu,
   * berdasarkan nama kriteria (dicocokkan dengan KriteriaSeeder default).
   */
  private function nilaiUntukKriteria(Lamaran $lamaran, Kriteria $kriteria): float
  {
    $profile = $lamaran->pengguna->pelamarProfile;

    return match ($kriteria->nama) {
      'Pendidikan Terakhir' => (float) (self::NILAI_PENDIDIKAN[$profile->pendidikan] ?? 0),
      'Nilai Akademik' => (float) $profile->nilai_akademik,
      'Usia' => (float) ($lamaran->pengguna->usia ?? 0),
      'Pengalaman Kerja' => $this->totalTahunPengalaman($lamaran),
      'Tes Teknis' => (float) $lamaran->hasilTes->nilai,
      default => 0.0,
    };
  }

  /**
   * Hitung total pengalaman kerja dalam tahun (dibulatkan 2 desimal),
   * dijumlahkan dari seluruh entri pengalaman_kerjas milik pelamar.
   */
  private function totalTahunPengalaman(Lamaran $lamaran): float
  {
    $totalBulan = $lamaran->pengguna->pengalamanKerjas->sum(
      fn($pengalaman) => $pengalaman->durasi_bulan
    );

    return round($totalBulan / 12, 2);
  }

  /**
   * Step 2: Normalisasi matriks dengan metode vektor.
   * r_ij = x_ij / sqrt(sum(x_ij^2)) untuk setiap kolom kriteria.
   *
   * @return array<int, array<int, float>>
   */
  private function normalisasiVektor(array $matriks, Collection $kriterias, Collection $lamarans): array
  {
    $normalisasi = [];

    // Hitung pembagi (akar jumlah kuadrat) per kolom kriteria
    $pembagi = [];
    foreach ($kriterias as $kriteria) {
      $jumlahKuadrat = 0.0;
      foreach ($lamarans as $lamaran) {
        $jumlahKuadrat += $matriks[$lamaran->id][$kriteria->id] ** 2;
      }
      $pembagi[$kriteria->id] = sqrt($jumlahKuadrat);
    }

    foreach ($lamarans as $lamaran) {
      $normalisasi[$lamaran->id] = [];
      foreach ($kriterias as $kriteria) {
        $penyebut = $pembagi[$kriteria->id];
        $normalisasi[$lamaran->id][$kriteria->id] = $penyebut > 0
          ? $matriks[$lamaran->id][$kriteria->id] / $penyebut
          : 0.0;
      }
    }

    return $normalisasi;
  }

  /**
   * Step 3: Matriks ternormalisasi terbobot.
   * v_ij = w_j * r_ij
   *
   * @return array<int, array<int, float>>
   */
  private function bobotiMatriks(array $normalisasi, Collection $kriterias, Collection $lamarans): array
  {
    $terbobot = [];

    foreach ($lamarans as $lamaran) {
      $terbobot[$lamaran->id] = [];
      foreach ($kriterias as $kriteria) {
        $terbobot[$lamaran->id][$kriteria->id] =
          (float) $kriteria->bobot * $normalisasi[$lamaran->id][$kriteria->id];
      }
    }

    return $terbobot;
  }

  /**
   * Step 4: Tentukan solusi ideal positif (A+) dan negatif (A-) per kriteria.
   * Benefit: A+ = MAX, A- = MIN.
   * Cost: A+ = MIN, A- = MAX (nilai lebih rendah lebih baik, mis. Usia).
   *
   * @return array{0: array<int, float>, 1: array<int, float>}
   */
  private function hitungSolusiIdeal(array $terbobot, Collection $kriterias, Collection $lamarans): array
  {
    $solusiPositif = [];
    $solusiNegatif = [];

    foreach ($kriterias as $kriteria) {
      $nilaiKolom = $lamarans->map(
        fn($lamaran) => $terbobot[$lamaran->id][$kriteria->id]
      );

      if ($kriteria->tipe === 'benefit') {
        $solusiPositif[$kriteria->id] = $nilaiKolom->max();
        $solusiNegatif[$kriteria->id] = $nilaiKolom->min();
      } else {
        // cost
        $solusiPositif[$kriteria->id] = $nilaiKolom->min();
        $solusiNegatif[$kriteria->id] = $nilaiKolom->max();
      }
    }

    return [$solusiPositif, $solusiNegatif];
  }

  /**
   * Step 5 & 6: Hitung jarak euclidean ke A+ dan A-, lalu nilai preferensi.
   * D+_i = sqrt(sum((v_ij - A+_j)^2))
   * D-_i = sqrt(sum((v_ij - A-_j)^2))
   * C_i  = D-_i / (D+_i + D-_i)
   *
   * @return Collection<int, array{lamaran_id: int, skor: float}>
   */
  private function hitungSkorPreferensi(
    array $terbobot,
    Collection $kriterias,
    Collection $lamarans,
    array $solusiPositif,
    array $solusiNegatif,
  ): Collection {
    return $lamarans->map(function ($lamaran) use ($terbobot, $kriterias, $solusiPositif, $solusiNegatif) {
      $jumlahKuadratPositif = 0.0;
      $jumlahKuadratNegatif = 0.0;

      foreach ($kriterias as $kriteria) {
        $v = $terbobot[$lamaran->id][$kriteria->id];
        $jumlahKuadratPositif += ($v - $solusiPositif[$kriteria->id]) ** 2;
        $jumlahKuadratNegatif += ($v - $solusiNegatif[$kriteria->id]) ** 2;
      }

      $dPositif = sqrt($jumlahKuadratPositif);
      $dNegatif = sqrt($jumlahKuadratNegatif);

      $totalJarak = $dPositif + $dNegatif;
      $skor = $totalJarak > 0 ? $dNegatif / $totalJarak : 0.0;

      return [
        'lamaran_id' => $lamaran->id,
        'skor' => round($skor, 8),
      ];
    });
  }
}
