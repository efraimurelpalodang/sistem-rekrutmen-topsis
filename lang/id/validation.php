<?php

return [

  /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    */

  'accepted' => ':attribute harus disetujui.',
  'accepted_if' => ':attribute harus disetujui ketika :other adalah :value.',
  'active_url' => ':attribute bukan URL yang valid.',
  'after' => ':attribute harus tanggal setelah :date.',
  'after_or_equal' => ':attribute harus tanggal setelah atau sama dengan :date.',
  'alpha' => ':attribute hanya boleh berisi huruf.',
  'alpha_dash' => ':attribute hanya boleh berisi huruf, angka, strip dan garis bawah.',
  'alpha_num' => ':attribute hanya boleh berisi huruf dan angka.',
  'array' => ':attribute harus berupa array.',
  'before' => ':attribute harus tanggal sebelum :date.',
  'before_or_equal' => ':attribute harus tanggal sebelum atau sama dengan :date.',
  'between' => [
    'array' => ':attribute harus memiliki :min sampai :max item.',
    'file' => ':attribute harus antara :min sampai :max kilobyte.',
    'numeric' => ':attribute harus antara :min sampai :max.',
    'string' => ':attribute harus antara :min sampai :max karakter.',
  ],
  'boolean' => ':attribute harus bernilai true atau false.',
  'confirmed' => 'Konfirmasi :attribute tidak cocok.',
  'current_password' => 'Kata sandi salah.',
  'date' => ':attribute bukan tanggal yang valid.',
  'date_equals' => ':attribute harus tanggal yang sama dengan :date.',
  'date_format' => ':attribute tidak sesuai dengan format :format.',
  'different' => ':attribute dan :other harus berbeda.',
  'digits' => ':attribute harus :digits digit.',
  'digits_between' => ':attribute harus antara :min sampai :max digit.',
  'distinct' => ':attribute memiliki nilai yang sama.',
  'email' => ':attribute harus berupa alamat email yang valid.',
  'ends_with' => ':attribute harus diakhiri dengan salah satu dari: :values.',
  'enum' => ':attribute yang dipilih tidak valid.',
  'exists' => ':attribute yang dipilih tidak valid.',
  'file' => ':attribute harus berupa file.',
  'filled' => ':attribute wajib diisi.',
  'gt' => [
    'array' => ':attribute harus memiliki lebih dari :value item.',
    'file' => ':attribute harus lebih besar dari :value kilobyte.',
    'numeric' => ':attribute harus lebih besar dari :value.',
    'string' => ':attribute harus lebih besar dari :value karakter.',
  ],
  'gte' => [
    'array' => ':attribute harus memiliki :value item atau lebih.',
    'file' => ':attribute harus lebih besar atau sama dengan :value kilobyte.',
    'numeric' => ':attribute harus lebih besar atau sama dengan :value.',
    'string' => ':attribute harus lebih besar atau sama dengan :value karakter.',
  ],
  'image' => ':attribute harus berupa gambar.',
  'in' => ':attribute yang dipilih tidak valid.',
  'in_array' => ':attribute tidak ada di dalam :other.',
  'integer' => ':attribute harus berupa bilangan bulat.',
  'ip' => ':attribute harus berupa alamat IP yang valid.',
  'ipv4' => ':attribute harus berupa alamat IPv4 yang valid.',
  'ipv6' => ':attribute harus berupa alamat IPv6 yang valid.',
  'json' => ':attribute harus berupa JSON string yang valid.',
  'lt' => [
    'array' => ':attribute harus memiliki kurang dari :value item.',
    'file' => ':attribute harus kurang dari :value kilobyte.',
    'numeric' => ':attribute harus kurang dari :value.',
    'string' => ':attribute harus kurang dari :value karakter.',
  ],
  'lte' => [
    'array' => ':attribute tidak boleh memiliki lebih dari :value item.',
    'file' => ':attribute harus kurang dari atau sama dengan :value kilobyte.',
    'numeric' => ':attribute harus kurang dari atau sama dengan :value.',
    'string' => ':attribute harus kurang dari atau sama dengan :value karakter.',
  ],
  'max' => [
    'array' => ':attribute tidak boleh memiliki lebih dari :max item.',
    'file' => ':attribute tidak boleh lebih besar dari :max kilobyte.',
    'numeric' => ':attribute tidak boleh lebih besar dari :max.',
    'string' => ':attribute tidak boleh lebih dari :max karakter.',
  ],
  'mimes' => ':attribute harus berupa file dengan tipe: :values.',
  'mimetypes' => ':attribute harus berupa file dengan tipe: :values.',
  'min' => [
    'array' => ':attribute harus memiliki paling sedikit :min item.',
    'file' => ':attribute harus paling sedikit :min kilobyte.',
    'numeric' => ':attribute harus paling sedikit :min.',
    'string' => ':attribute harus paling sedikit :min karakter.',
  ],
  'not_in' => ':attribute yang dipilih tidak valid.',
  'not_regex' => 'Format :attribute tidak valid.',
  'numeric' => ':attribute harus berupa angka.',
  'password' => [
    'letters' => ':attribute harus mengandung minimal satu huruf.',
    'mixed' => ':attribute harus mengandung minimal satu huruf besar dan satu huruf kecil.',
    'numbers' => ':attribute harus mengandung minimal satu angka.',
    'symbols' => ':attribute harus mengandung minimal satu simbol.',
    'uncompromised' => ':attribute yang dimasukkan telah bocor dalam kebocoran data. Silakan pilih :attribute yang berbeda.',
  ],
  'present' => ':attribute wajib ada.',
  'regex' => 'Format :attribute tidak valid.',
  'required' => ':attribute wajib diisi.',
  'required_array_keys' => ':attribute harus memiliki entri untuk: :values.',
  'required_if' => ':attribute wajib diisi ketika :other adalah :value.',
  'required_unless' => ':attribute wajib diisi kecuali :other ada di :values.',
  'required_with' => ':attribute wajib diisi ketika :values ada.',
  'required_with_all' => ':attribute wajib diisi ketika :values ada.',
  'required_without' => ':attribute wajib diisi ketika :values tidak ada.',
  'required_without_all' => ':attribute wajib diisi ketika tidak ada satupun dari :values yang ada.',
  'same' => ':attribute dan :other harus sama.',
  'size' => [
    'array' => ':attribute harus memiliki :size item.',
    'file' => ':attribute harus berukuran :size kilobyte.',
    'numeric' => ':attribute harus berukuran :size.',
    'string' => ':attribute harus berukuran :size karakter.',
  ],
  'string' => ':attribute harus berupa teks.',
  'unique' => ':attribute sudah digunakan.',
  'uploaded' => ':attribute gagal diunggah.',
  'url' => 'Format :attribute tidak valid.',
  'uuid' => ':attribute harus berupa UUID yang valid.',

  /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    */

  'custom' => [
    // contoh:
    // 'nik' => [
    //     'required' => 'NIK wajib diisi.',
    //     'size' => 'NIK harus 16 digit.',
    // ],
  ],

  /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    | Mengganti nama field :attribute jadi bahasa Indonesia di pesan error.
    */

  'attributes' => [
    'nik' => 'NIK',
    'nama' => 'nama',
    'email' => 'email',
    'password' => 'kata sandi',
    'password_confirmation' => 'konfirmasi kata sandi',
    'tgl_lahir' => 'tanggal lahir',
    'jenis_kelamin' => 'jenis kelamin',
    'alamat' => 'alamat',
    'no_hp' => 'nomor HP',
    'pendidikan' => 'pendidikan',
    'jurusan' => 'jurusan',
    'institusi' => 'institusi',
    'nilai_akademik' => 'nilai akademik',
    'judul' => 'judul',
    'deskripsi' => 'deskripsi',
    'kualifikasi' => 'kualifikasi',
    'kuota' => 'kuota',
  ],

];
