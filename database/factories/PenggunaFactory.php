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
    $jenisKelamin = $this->faker->randomElement(['L', 'P']);

    $nama = $jenisKelamin === 'L'
      ? $this->faker->name('male')
      : $this->faker->name('female');

    return [
      'nik' => $this->faker->unique()->numerify('################'),
      'nama' => $nama,
      'email' => $this->faker->unique()->safeEmail(),
      'password' => Hash::make('password'),
      'role' => 'pelamar',
      'tgl_lahir' => $this->faker
        ->dateTimeBetween('-45 years', '-20 years')
        ->format('Y-m-d'),
      'jenis_kelamin' => $jenisKelamin,
      'alamat' => $this->faker->address(),
      'no_hp' => '08' . $this->faker->numerify('##########'),
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
