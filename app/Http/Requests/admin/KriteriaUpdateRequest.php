<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class KriteriaUpdateRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, mixed>
   */
  public function rules(): array
  {
    return [
      'bobot' => ['required', 'numeric', 'min:0', 'max:1'],
      'tipe' => ['required', 'in:benefit,cost'],
    ];
  }
}
