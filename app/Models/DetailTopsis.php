<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailTopsis extends Model
{
    use HasFactory;

    protected $table = 'detail_topses';

    protected $fillable = [
        'hasil_topsis_id',
        'kriteria_id',
        'nilai_asli',
        'nilai_normalisasi',
        'nilai_terbobot',
    ];

    protected function casts(): array
    {
        return [
            'nilai_asli'         => 'decimal:4',
            'nilai_normalisasi'  => 'decimal:8',
            'nilai_terbobot'     => 'decimal:8',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────

    public function hasilTopsis(): BelongsTo
    {
        return $this->belongsTo(HasilTopsis::class, 'hasil_topsis_id');
    }

    public function kriteria(): BelongsTo
    {
        return $this->belongsTo(Kriteria::class, 'kriteria_id');
    }
}
