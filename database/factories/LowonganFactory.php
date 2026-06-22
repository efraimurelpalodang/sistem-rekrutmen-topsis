<?php

namespace Database\Factories;

use App\Models\Lowongan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lowongan>
 */
class LowonganFactory extends Factory
{
  protected $model = Lowongan::class;

  public function definition(): array
  {
    $faker = \Faker\Factory::create('id_ID');

    $tglBuka = $faker->dateTimeBetween('-3 months', '-1 month');
    $tglTutup = (clone $tglBuka)->modify('+45 days');

    return [
      'judul' => 'Staff', // dioverride seeder, lihat catatan
      'deskripsi' => 'Deskripsi pekerjaan akan ditentukan sesuai posisi.',
      'kualifikasi' => 'Kualifikasi akan ditentukan sesuai posisi.',
      'kuota' => $faker->numberBetween(2, 5),
      'status' => 'ditutup',
      'tgl_buka' => $tglBuka->format('Y-m-d'),
      'tgl_tutup' => $tglTutup->format('Y-m-d'),
    ];
  }
}
