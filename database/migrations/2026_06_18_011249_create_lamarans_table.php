<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lamarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengguna_id')->constrained('penggunas')->cascadeOnDelete()->comment('Pelamar');
            $table->foreignId('lowongan_id')->constrained('lowongans')->cascadeOnDelete();
            $table->enum('status', [
                'menunggu',
                'lolos_admin',
                'gagal_admin',
                'menunggu_tes',
                'selesai_tes',
                'diterima',
                'ditolak',
            ])->default('menunggu');
            $table->timestamps();
            $table->unique(['pengguna_id', 'lowongan_id']); // 1 pelamar hanya bisa melamar 1x per lowongan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lamarans');
    }
};
