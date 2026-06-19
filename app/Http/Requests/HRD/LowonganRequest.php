<?php

namespace App\Http\Requests\HRD;

use Illuminate\Foundation\Http\FormRequest;

class LowonganRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'judul' => ['required', 'string', 'max:255'],
      'deskripsi' => ['nullable', 'string'],
      'kualifikasi' => ['nullable', 'string'],
      'kuota' => ['required', 'integer', 'min:1'],
      'tgl_buka' => ['required', 'date'],
      'tgl_tutup' => ['required', 'date', 'after_or_equal:tgl_buka'],
    ];
  }
}
