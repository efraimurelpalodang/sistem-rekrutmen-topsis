<?php

namespace App\Models;

use App\Models\DetailTopsis;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HasilTopsis extends Model
{
    use HasFactory;

    protected $table = 'hasil_topses';

    protected $fillable = [
        'lowongan_id',
        'lamaran_id',
        'skor',
        'ranking',
    ];

    protected function casts(): array
    {
        return [
            'skor'    => 'decimal:8',
            'ranking' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────

    public function lowongan(): BelongsTo
    {
        return $this->belongsTo(Lowongan::class, 'lowongan_id');
    }

    public function lamaran(): BelongsTo
    {
        return $this->belongsTo(Lamaran::class, 'lamaran_id');
    }

    public function detailTopsis(): HasMany
    {
        return $this->hasMany(DetailTopsis::class, 'hasil_topsis_id');
    }
}
