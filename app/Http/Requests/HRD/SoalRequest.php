<?php

namespace App\Http\Requests\HRD;

use Illuminate\Foundation\Http\FormRequest;

class SoalRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'pertanyaan' => ['required', 'string'],
      'pilihan_a' => ['required', 'string'],
      'pilihan_b' => ['required', 'string'],
      'pilihan_c' => ['required', 'string'],
      'pilihan_d' => ['required', 'string'],
      'jawaban_benar' => ['required', 'in:a,b,c,d'],
    ];
  }
}
