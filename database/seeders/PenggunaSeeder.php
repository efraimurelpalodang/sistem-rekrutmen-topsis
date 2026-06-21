<?php

namespace Database\Seeders;

use App\Models\Pengguna;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PenggunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pengguna::create([
            'nama'     => 'Administrator',
            'email'    => 'admin@spk.test',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Pengguna::create([
        //     'nama'     => 'HRD',
        //     'email'    => 'hrd@spk.test',
        //     'password' => Hash::make('password'),
        //     'role'     => 'hrd',
        // ]);
    }
}
