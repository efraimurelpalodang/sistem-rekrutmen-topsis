<?php

namespace App\Models;

use App\Models\DetailTopsis;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kriteria extends Model
{
    use HasFactory;

    protected $table = 'kriterias';

    protected $fillable = [
        'nama',
        'bobot',
        'tipe',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'bobot'  => 'decimal:2',
            'urutan' => 'integer',
        ];
    }

    // ─── Accessors ────────────────────────────────────────────────

    public function getIsBenefitAttribute(): bool
    {
        return $this->tipe === 'benefit';
    }

    public function getIsCostAttribute(): bool
    {
        return $this->tipe === 'cost';
    }

    // ─── Relationships ────────────────────────────────────────────

    public function detailTopsis(): HasMany
    {
        return $this->hasMany(DetailTopsis::class, 'kriteria_id');
    }
}
