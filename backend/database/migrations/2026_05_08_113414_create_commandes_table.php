<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('total_centimes');
            $table->string('statut')->default('en_attente');
            $table->text('adresse_livraison');
            $table->string('telephone')->nullable();
            $table->foreignId('variante_id')->nullable()->constrained('variantes_produits');
            $table->integer('quantite')->nullable();
            $table->integer('prix_unitaire_moment_achat')->nullable();
            $table->json('items')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};