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
        Schema::create('pelamar_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengguna_id')->constrained('penggunas')->cascadeOnDelete();
            $table->enum('pendidikan', ['SMA', 'SMK', 'D3', 'S1', 'S2', 'S3']);
            $table->string('jurusan')->nullable();
            $table->string('institusi')->nullable()->comment('Nama sekolah/universitas');
            $table->decimal('nilai_akademik', 5, 2)->nullable()->comment('Skala 0-100, IPK atau rapor yang sudah dikonversi');
            $table->enum('tipe_nilai', ['ipk', 'rapor']);
            $table->year('tahun_lulus')->nullable();
            $table->string('cv_path')->nullable()->comment('Path file PDF');
            $table->string('foto_ktp_path')->nullable()->comment('Path foto KTP');
            $table->string('foto_ijazah_path')->nullable()->comment('Path foto ijazah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelamar_profiles');
    }
};
