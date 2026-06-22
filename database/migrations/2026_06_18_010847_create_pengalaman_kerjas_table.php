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
        Schema::create('pengalaman_kerjas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengguna_id')->constrained('penggunas')->cascadeOnDelete();
            $table->string('nama_perusahaan');
            $table->string('posisi');
            $table->date('bulan_mulai');
            $table->date('bulan_selesai')->nullable()->comment('Nullable jika masih bekerja');
            $table->string('foto_surat_path')->nullable()->comment('Path foto surat keterangan kerja');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengalaman_kerjas');
    }
};
