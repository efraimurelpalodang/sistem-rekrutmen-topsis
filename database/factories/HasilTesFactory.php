<?php

namespace Database\Factories;

use App\Models\HasilTes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HasilTes>
 */
class HasilTesFactory extends Factory
{
  protected $model = HasilTes::class;

  public function definition(): array
  {
    $mulai = $this->faker->dateTimeBetween('-2 months', '-1 week');
    $selesai = (clone $mulai)->modify('+' . $this->faker->numberBetween(20, 58) . ' minutes');

    return [
      'nilai' => $this->faker->randomFloat(2, 40, 100),
      'tgl_mulai' => $mulai->format('Y-m-d H:i:s'),
      'tgl_selesai' => $selesai->format('Y-m-d H:i:s'),
    ];
  }
}
