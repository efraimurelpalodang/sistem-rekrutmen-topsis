<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kriteria;

class KriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kriterias = [
            [
                'nama'   => 'Pendidikan Terakhir',
                'bobot'  => 0.25,
                'tipe'   => 'benefit',
                'urutan' => 1,
            ],
            [
                'nama'   => 'Nilai Akademik',
                'bobot'  => 0.25,
                'tipe'   => 'benefit',
                'urutan' => 2,
            ],
            [
                'nama'   => 'Usia',
                'bobot'  => 0.15,
                'tipe'   => 'cost',
                'urutan' => 3,
            ],
            [
                'nama'   => 'Pengalaman Kerja',
                'bobot'  => 0.20,
                'tipe'   => 'benefit',
                'urutan' => 4,
            ],
            [
                'nama'   => 'Tes Teknis',
                'bobot'  => 0.15,
                'tipe'   => 'benefit',
                'urutan' => 5,
            ],
        ];

        foreach ($kriterias as $kriteria) {
            Kriteria::create($kriteria);
        }
    }
}
