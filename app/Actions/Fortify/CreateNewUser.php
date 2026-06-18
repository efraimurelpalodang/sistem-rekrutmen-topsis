<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\Pengguna;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): Pengguna
    {
        Validator::make($input, [
            'nama'          => ['required', 'string', 'max:255'],
            'email'         => ['required', 'string', 'email', 'max:255', 'unique:penggunas,email'],
            'nik'           => ['required', 'string', 'size:16', 'unique:penggunas,nik'],
            'tgl_lahir'     => ['required', 'date'],
            'jenis_kelamin' => ['required', 'in:L,P'],
            'alamat'        => ['required', 'string'],
            'no_hp'         => ['nullable', 'string', 'max:20'],
            'password'      => $this->passwordRules(),
        ])->validate();

        return Pengguna::create([
            'nik'           => $input['nik'],
            'nama'          => $input['nama'],
            'email'         => $input['email'],
            'password'      => $input['password'],
            'role'          => 'pelamar',
            'tgl_lahir'     => $input['tgl_lahir'],
            'jenis_kelamin' => $input['jenis_kelamin'],
            'alamat'        => $input['alamat'],
            'no_hp'         => $input['no_hp'] ?? null,
        ]);
    }
}
