<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PelamarProfile extends Model
{
    use HasFactory;

    protected $table = 'pelamar_profiles';

    protected $fillable = [
        'pengguna_id',
        'pendidikan',
        'jurusan',
        'institusi',
        'nilai_akademik',
        'tipe_nilai',
        'tahun_lulus',
        'cv_path',
        'foto_ktp_path',
        'foto_ijazah_path',
    ];

    protected function casts(): array
    {
        return [
            'nilai_akademik' => 'decimal:2',
            'tahun_lulus'    => 'integer',
        ];
    }

    /**
     * Konversi pendidikan ke nilai angka untuk kalkulasi TOPSIS.
     * SMA=1, SMK=2, D3=3, S1=4, S2=5, S3=6
     */
    public function getNilaiPendidikanAttribute(): int
    {
        return match ($this->pendidikan) {
            'SMA'  => 1,
            'SMK'  => 2,
            'D3'   => 3,
            'S1'   => 4,
            'S2'   => 5,
            'S3'   => 6,
            default => 0,
        };
    }

    // ─── Relationships ────────────────────────────────────────────

    public function pengguna(): BelongsTo
    {
        return $this->belongsTo(Pengguna::class, 'pengguna_id');
    }
}
