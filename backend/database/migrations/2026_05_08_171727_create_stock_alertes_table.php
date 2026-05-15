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
    Schema::create('stock_alertes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
        $table->integer('ancien_stock');
        $table->integer('nouveau_stock');
        $table->string('type')->default('baisse'); // baisse ou rupture
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_alertes');
    }
};
