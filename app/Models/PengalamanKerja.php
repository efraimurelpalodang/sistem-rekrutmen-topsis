<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class PengalamanKerja extends Model
{
    use HasFactory;

    protected $table = 'pengalaman_kerjas';

    protected $fillable = [
        'pengguna_id',
        'nama_perusahaan',
        'posisi',
        'bulan_mulai',
        'bulan_selesai',
        'foto_surat_path',
    ];

    protected function casts(): array
    {
        return [
            'bulan_mulai'   => 'date',
            'bulan_selesai' => 'date',
        ];
    }

    // ─── Accessors ────────────────────────────────────────────────

    /**
     * Cek apakah masih bekerja di sini.
     */
    public function getMasihBekerjaAttribute(): bool
    {
        return $this->bulan_selesai === null;
    }

    /**
     * Hitung durasi dalam bulan (dipakai untuk total pengalaman kerja di TOPSIS).
     */
    public function getDurasiБulanAttribute(): int
    {
        $selesai = $this->bulan_selesai ?? Carbon::now();

        return (int) Carbon::parse($this->bulan_mulai)->diffInMonths($selesai);
    }

    // ─── Relationships ────────────────────────────────────────────

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id');
    }
}
