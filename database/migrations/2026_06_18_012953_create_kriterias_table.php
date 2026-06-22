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
        Schema::create('kriterias', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->comment('Nama kriteria');
            $table->decimal('bobot', 5, 2)->comment('Bobot kriteria, total semua harus = 1');
            $table->enum('tipe', ['benefit', 'cost']);
            $table->integer('urutan')->default(0)->comment('Urutan tampilan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kriterias');
    }
};
