<?php

namespace App\Models;

use App\Models\PelamarProfile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

class Pengguna extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'penggunas';

    protected $fillable = [
        'nik',
        'nama',
        'email',
        'password',
        'role',
        'tgl_lahir',
        'jenis_kelamin',
        'alamat',
        'no_hp',
        'foto_profil',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'tgl_lahir'         => 'date',
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ─── Accessors ────────────────────────────────────────────────

    /**
     * Hitung usia dari tgl_lahir (dipakai di kalkulasi TOPSIS kriteria Usia).
     */
    public function getUsiaAttribute(): ?int
    {
        return $this->tgl_lahir
            ? Carbon::parse($this->tgl_lahir)->age
            : null;
    }

    // ─── Role Helpers ─────────────────────────────────────────────

    public function isPelamar(): bool
    {
        return $this->role === 'pelamar';
    }

    public function isHrd(): bool
    {
        return $this->role === 'hrd';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // ─── Relationships ────────────────────────────────────────────

    public function pelamarProfile(): HasOne
    {
        return $this->hasOne(PelamarProfile::class, 'pengguna_id');
    }

    public function pengalamanKerjas(): HasMany
    {
        return $this->hasMany(PengalamanKerja::class, 'pengguna_id');
    }

    public function lamarans(): HasMany
    {
        return $this->hasMany(Lamaran::class, 'pengguna_id');
    }

    public function lowongans(): HasMany
    {
        return $this->hasMany(Lowongan::class, 'pengguna_id');
    }
}
