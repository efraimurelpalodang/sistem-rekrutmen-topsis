<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JawabanPelamar extends Model
{
    use HasFactory;

    protected $table = 'jawaban_pelamars';

    protected $fillable = [
        'hasil_tes_id',
        'soal_id',
        'jawaban',
        'is_benar',
    ];

    protected function casts(): array
    {
        return [
            'is_benar' => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────

    public function hasilTes(): BelongsTo
    {
        return $this->belongsTo(HasilTes::class, 'hasil_tes_id');
    }

    public function soal(): BelongsTo
    {
        return $this->belongsTo(Soal::class, 'soal_id');
    }
}
