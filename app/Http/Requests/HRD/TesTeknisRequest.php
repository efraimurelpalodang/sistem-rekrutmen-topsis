<?php

namespace App\Http\Requests\HRD;

use Illuminate\Foundation\Http\FormRequest;

class TesTeknisRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'durasi_menit' => ['required', 'integer', 'min:1', 'max:300'],
      'jumlah_soal' => ['required', 'integer', 'min:1'],
    ];
  }
}
