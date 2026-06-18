<?php

namespace App\Models;

use App\Models\TesTeknis;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lowongan extends Model
{
    use HasFactory;

    protected $table = 'lowongans';

    protected $fillable = [
        'pengguna_id',
        'judul',
        'deskripsi',
        'kualifikasi',
        'kuota',
        'status',
        'tgl_buka',
        'tgl_tutup',
    ];

    protected function casts(): array
    {
        return [
            'tgl_buka' => 'date',
            'tgl_tutup' => 'date',
            'kuota' => 'integer',
        ];
    }

    // ─── Accessors ────────────────────────────────────────────────

    public function getIsAktifAttribute(): bool
    {
        return $this->status === 'aktif';
    }

    // ─── Relationships ────────────────────────────────────────────

    public function hrd(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id');
    }

    public function lamarans(): HasMany
    {
        return $this->hasMany(Lamaran::class, 'lowongan_id');
    }

    public function tesTeknis(): HasOne
    {
        return $this->hasOne(TesTeknis::class, 'lowongan_id');
    }

    public function hasilTopsis(): HasMany
    {
        return $this->hasMany(HasilTopsis::class, 'lowongan_id');
    }
}
