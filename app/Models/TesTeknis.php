<?php

namespace App\Models;

use App\Models\Soal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TesTeknis extends Model
{
    use HasFactory;

    protected $table = 'tes_teknis';

    protected $fillable = [
        'lowongan_id',
        'durasi_menit',
        'jumlah_soal',
    ];

    protected function casts(): array
    {
        return [
            'durasi_menit' => 'integer',
            'jumlah_soal'  => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────

    public function lowongan(): BelongsTo
    {
        return $this->belongsTo(Lowongan::class, 'lowongan_id');
    }

    public function soals(): HasMany
    {
        return $this->hasMany(Soal::class, 'tes_id');
    }
}
