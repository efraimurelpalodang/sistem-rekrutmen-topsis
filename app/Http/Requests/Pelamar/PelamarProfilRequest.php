<?php

namespace App\Http\Requests\Pelamar;

use Illuminate\Foundation\Http\FormRequest;

class PelamarProfilRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'nama' => ['required', 'string', 'max:255'],
      'alamat' => ['required', 'string'],
      'no_hp' => ['nullable', 'string', 'max:20'],
      'pendidikan' => ['required', 'in:SMA,SMK,D3,S1,S2,S3'],
      'jurusan' => ['nullable', 'string', 'max:255'],
      'institusi' => ['nullable', 'string', 'max:255'],
      'nilai_akademik' => ['required', 'numeric', 'min:0', 'max:100'],
      'tipe_nilai' => ['required', 'in:ipk,rapor'],
      'tahun_lulus' => ['nullable', 'integer', 'min:1980', 'max:' . (date('Y') + 1)],
    ];
  }
}
