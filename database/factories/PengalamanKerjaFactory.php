<?php

namespace Database\Factories;

use App\Models\PengalamanKerja;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PengalamanKerja>
 */
class PengalamanKerjaFactory extends Factory
{
  protected $model = PengalamanKerja::class;

  private const PERUSAHAAN = [
    'PT Bukit Asam Tbk',
    'PT Adaro Energy Indonesia Tbk',
    'PT Bumi Resources Tbk',
    'PT Vale Indonesia Tbk',
    'PT Freeport Indonesia',
    'PT Indika Energy Tbk',
    'PT Medco Energi Internasional Tbk',
    'PT Timah Tbk',
    'PT Antam Tbk',
    'PT Pertamina (Persero)',
    'PT Berau Coal',
    'PT Kideco Jaya Agung',
  ];

  private const POSISI = [
    'Mining Engineer',
    'Geologist',
    'Surveyor Tambang',
    'Operator Alat Berat',
    'Staff HSE (Health Safety Environment)',
    'Supervisor Produksi',
    'Teknisi Mekanik',
    'Staff Administrasi Tambang',
    'Quality Control',
    'Foreman Tambang',
  ];

  public function definition(): array
  {
    $faker = \Faker\Factory::create('id_ID');

    $mulai = $faker->dateTimeBetween('-8 years', '-1 year');
    $masihBekerja = $faker->boolean(20);

    return [
      'nama_perusahaan' => $faker->randomElement(self::PERUSAHAAN),
      'posisi' => $faker->randomElement(self::POSISI),
      'bulan_mulai' => $mulai->format('Y-m-d'),
      'bulan_selesai' => $masihBekerja
        ? null
        : $faker->dateTimeBetween($mulai, 'now')->format('Y-m-d'),
      'foto_surat_path' => 'dummy/surat-kerja/surat-placeholder.jpg',
    ];
  }
}
