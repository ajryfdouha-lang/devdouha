<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // 2026_05_08_113226_create_produits_table.php — remplacez tout
public function up(): void
{
    Schema::create('produits', function (Blueprint $table) {
        $table->id();
        $table->string('nom');
        $table->string('slug')->unique();
        $table->text('description');
        $table->string('image_principale')->default('produits/default.jpg');
        $table->string('famille_olfactive');
        $table->enum('genre', ['femme', 'homme', 'mixte', 'pack'])->default('mixte');
        $table->decimal('prix_30ml', 8, 2)->default(0);
        $table->decimal('prix_50ml', 8, 2)->nullable();
        $table->decimal('prix_100ml', 8, 2)->nullable();
        $table->integer('stock')->default(0);
        $table->foreignId('brand_id')->constrained('brands')->onDelete('cascade');
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
