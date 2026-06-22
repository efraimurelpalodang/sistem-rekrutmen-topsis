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
        Schema::create('lowongans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengguna_id')->constrained('penggunas')->cascadeOnDelete()->comment('HRD yang membuat');
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->text('kualifikasi')->nullable();
            $table->integer('kuota')->comment('Jumlah yang diterima');
            $table->enum('status', ['aktif', 'ditutup'])->default('aktif');
            $table->date('tgl_buka');
            $table->date('tgl_tutup');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lowongans');
    }
};
