<?php

namespace App\Models;

use App\Models\JawabanPelamar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Soal extends Model
{
    use HasFactory;

    protected $table = 'soals';

    protected $fillable = [
        'tes_id',
        'pertanyaan',
        'pilihan_a',
        'pilihan_b',
        'pilihan_c',
        'pilihan_d',
        'jawaban_benar',
    ];

    /**
     * Hidden agar jawaban benar tidak bocor ke frontend saat pelamar mengerjakan tes.
     */
    protected $hidden = [
        'jawaban_benar',
    ];

    // ─── Relationships ────────────────────────────────────────────

    public function tesTeknis(): BelongsTo
    {
        return $this->belongsTo(TesTeknis::class, 'tes_id');
    }

    public function jawabanPelamars(): HasMany
    {
        return $this->hasMany(JawabanPelamar::class, 'soal_id');
    }
}
