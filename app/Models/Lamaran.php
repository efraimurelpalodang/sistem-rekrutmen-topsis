<?php

namespace App\Models;

use App\Models\HasilTopsis;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lamaran extends Model
{
    use HasFactory;

    protected $table = 'lamarans';

    protected $fillable = [
        'pengguna_id',
        'lowongan_id',
        'status',
    ];

    // ─── Status Constants ─────────────────────────────────────────

    const STATUS_MENUNGGU      = 'menunggu';
    const STATUS_LOLOS_ADMIN   = 'lolos_admin';
    const STATUS_GAGAL_ADMIN   = 'gagal_admin';
    const STATUS_MENUNGGU_TES  = 'menunggu_tes';
    const STATUS_SELESAI_TES   = 'selesai_tes';
    const STATUS_DITERIMA      = 'diterima';
    const STATUS_DITOLAK       = 'ditolak';

    // ─── Accessors ────────────────────────────────────────────────

    /**
     * Label status yang ramah untuk ditampilkan di timeline.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_MENUNGGU     => 'Lamaran Diterima',
            self::STATUS_LOLOS_ADMIN  => 'Lolos Seleksi Administrasi',
            self::STATUS_GAGAL_ADMIN  => 'Gagal Seleksi Administrasi',
            self::STATUS_MENUNGGU_TES => 'Menunggu Tes Teknis',
            self::STATUS_SELESAI_TES  => 'Tes Teknis Selesai',
            self::STATUS_DITERIMA     => 'Diterima',
            self::STATUS_DITOLAK      => 'Ditolak',
            default                   => $this->status,
        };
    }

    public function getBolehTesTeknis(): bool
    {
        return $this->status === self::STATUS_MENUNGGU_TES;
    }

    // ─── Relationships ────────────────────────────────────────────

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id');
    }

    public function lowongan(): BelongsTo
    {
        return $this->belongsTo(Lowongan::class, 'lowongan_id');
    }

    public function hasilTes(): HasOne
    {
        return $this->hasOne(HasilTes::class, 'lamaran_id');
    }

    public function hasilTopsis(): HasOne
    {
        return $this->hasOne(HasilTopsis::class, 'lamaran_id');
    }
}
