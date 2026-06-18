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
        Schema::create('tes_teknis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lowongan_id')->constrained('lowongans')->cascadeOnDelete();
            $table->integer('durasi_menit')->comment('Durasi pengerjaan tes dalam menit');
            $table->integer('jumlah_soal')->comment('Berapa soal ditampilkan saat tes (acak dari bank soal)');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tes_teknis');
    }
};
