<?php

namespace Database\Factories;

use App\Models\Pengguna;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<Pengguna>
 */
class PenggunaFactory extends Factory
{
  protected $model = Pengguna::class;

  public function definition(): array
  {
    $faker = \Faker\Factory::create('id_ID');

    $jenisKelamin = $faker->randomElement(['L', 'P']);
    $nama = $jenisKelamin === 'L'
      ? $faker->name('male')
      : $faker->name('female');

    return [
      'nik' => $faker->unique()->numerify(str_repeat('#', 16)),
      'nama' => $nama,
      'email' => $faker->unique()->safeEmail(),
      'password' => Hash::make('password'),
      'role' => 'pelamar',
      'tgl_lahir' => $faker->dateTimeBetween('-45 years', '-20 years')->format('Y-m-d'),
      'jenis_kelamin' => $jenisKelamin,
      'alamat' => $faker->address(),
      'no_hp' => '08' . $faker->numerify('##########'),
      'foto_profil' => null,
      'remember_token' => Str::random(10),
    ];
  }

  /**
   * State untuk akun HRD.
   */
  public function hrd(): static
  {
    return $this->state(fn() => [
      'role' => 'hrd',
      'nik' => null,
    ]);
  }

  /**
   * State untuk akun Admin.
   */
  public function admin(): static
  {
    return $this->state(fn() => [
      'role' => 'admin',
      'nik' => null,
    ]);
  }
}
