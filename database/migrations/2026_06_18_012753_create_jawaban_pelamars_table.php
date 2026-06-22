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
        Schema::create('jawaban_pelamars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hasil_tes_id')->constrained('hasil_tes')->cascadeOnDelete();
            $table->foreignId('soal_id')->constrained('soals')->cascadeOnDelete();
            $table->enum('jawaban', ['a', 'b', 'c', 'd']);
            $table->boolean('is_benar')->default(false)->comment('Dihitung otomatis saat submit');
            $table->timestamps();
            $table->unique(['hasil_tes_id', 'soal_id']); // 1 jawaban per soal per sesi tes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_pelamars');
    }
};
