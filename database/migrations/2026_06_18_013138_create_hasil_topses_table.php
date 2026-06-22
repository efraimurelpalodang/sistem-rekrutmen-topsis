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
        Schema::create('hasil_topses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lowongan_id')->constrained('lowongans')->cascadeOnDelete();
            $table->foreignId('lamaran_id')->constrained('lamarans')->cascadeOnDelete();
            $table->decimal('skor', 10, 8)->comment('Nilai preferensi akhir TOPSIS (C_i), range 0-1');
            $table->integer('ranking')->comment('Ranking pelamar dalam lowongan ini');
            $table->timestamps();
            $table->unique(['lowongan_id', 'lamaran_id']); // 1 hasil per lamaran per lowongan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_topses');
    }
};
