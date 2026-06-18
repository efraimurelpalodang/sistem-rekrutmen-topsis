<?php

namespace App\Models;

use App\Models\JawabanPelamar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HasilTes extends Model
{
    use HasFactory;

    protected $table = 'hasil_tes';

    protected $fillable = [
        'lamaran_id',
        'nilai',
        'tgl_mulai',
        'tgl_selesai',
    ];

    protected function casts(): array
    {
        return [
            'nilai'       => 'decimal:2',
            'tgl_mulai'   => 'datetime',
            'tgl_selesai' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────

    public function lamaran(): BelongsTo
    {
        return $this->belongsTo(Lamaran::class, 'lamaran_id');
    }

    public function jawabanPelamars(): HasMany
    {
        return $this->hasMany(JawabanPelamar::class, 'hasil_tes_id');
    }
}
