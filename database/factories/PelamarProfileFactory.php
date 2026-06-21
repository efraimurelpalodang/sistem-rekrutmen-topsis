<?php

namespace Database\Factories;

use App\Models\PelamarProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PelamarProfile>
 */
class PelamarProfileFactory extends Factory
{
  protected $model = PelamarProfile::class;

  /**
   * Institusi pendidikan relevan untuk lulusan jurusan pertambangan/energi.
   */
  private const INSTITUSI = [
    'Institut Teknologi Bandung',
    'Universitas Gadjah Mada',
    'Institut Teknologi Sepuluh Nopember',
    'Universitas Sriwijaya',
    'Universitas Mulawarman',
    'Politeknik Negeri Bandung',
    'Universitas Trisakti',
    'Universitas Hasanuddin',
    'Sekolah Tinggi Teknologi Mineral Indonesia',
    'Universitas Padjadjaran',
  ];

  private const JURUSAN = [
    'Teknik Pertambangan',
    'Teknik Geologi',
    'Teknik Perminyakan',
    'Teknik Lingkungan',
    'Teknik Mesin',
    'Teknik Elektro',
    'Teknik Industri',
    'Geofisika',
    'Manajemen',
    'Akuntansi',
    'K3 (Kesehatan dan Keselamatan Kerja)',
  ];

  public function definition(): array
  {
    $faker = \Faker\Factory::create('id_ID');

    $pendidikan = $faker->randomElement(['SMA', 'SMK', 'D3', 'S1', 'S1', 'S1', 'S2']);
    $tipeNilai = in_array($pendidikan, ['SMA', 'SMK']) ? 'rapor' : 'ipk';

    // IPK skala 0-4 dikonversi ke 0-100, rapor langsung skala 0-100
    $nilaiAkademik = $tipeNilai === 'ipk'
      ? round($faker->randomFloat(2, 2.5, 4.0) / 4 * 100, 2)
      : round($faker->randomFloat(2, 65, 95), 2);

    return [
      'pendidikan' => $pendidikan,
      'jurusan' => $faker->randomElement(self::JURUSAN),
      'institusi' => in_array($pendidikan, ['SMA', 'SMK'])
        ? 'SMA Negeri ' . $faker->numberBetween(1, 20) . ' ' . $faker->city()
        : $faker->randomElement(self::INSTITUSI),
      'nilai_akademik' => $nilaiAkademik,
      'tipe_nilai' => $tipeNilai,
      'tahun_lulus' => $faker->numberBetween(2010, 2023),
      'cv_path' => 'dummy/cv/cv-placeholder.pdf',
      'foto_ktp_path' => 'dummy/ktp/ktp-placeholder.jpg',
      'foto_ijazah_path' => 'dummy/ijazah/ijazah-placeholder.jpg',
    ];
  }
}
