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
        Schema::create('detail_topses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hasil_topsis_id')->constrained('hasil_topses')->cascadeOnDelete();
            $table->foreignId('kriteria_id')->constrained('kriterias')->cascadeOnDelete();
            $table->decimal('nilai_asli', 10, 4)->comment('Nilai mentah pelamar untuk kriteria ini');
            $table->decimal('nilai_normalisasi', 10, 8)->comment('Nilai setelah dinormalisasi (r_ij)');
            $table->decimal('nilai_terbobot', 10, 8)->comment('Nilai normalisasi x bobot kriteria (v_ij)');
            $table->timestamps();
            $table->unique(['hasil_topsis_id', 'kriteria_id']); // 1 detail per kriteria per hasil
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_topses');
    }
};
