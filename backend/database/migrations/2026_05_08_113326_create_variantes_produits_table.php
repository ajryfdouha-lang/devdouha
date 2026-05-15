<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 2026_05_08_113326 — remplacez
public function up(): void
{
    Schema::create('variantes_produits', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
        $table->string('contenance');
        $table->integer('prix_centimes')->default(0);  // ← prix_centimes pas prix_fixe_centimes
        $table->integer('stock')->default(0);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variantes_produits');
    }
};
