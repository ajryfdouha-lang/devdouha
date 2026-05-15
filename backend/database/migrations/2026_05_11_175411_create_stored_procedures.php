<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared('
            DROP PROCEDURE IF EXISTS GetTopProduits;
        ');

        DB::unprepared('
            CREATE PROCEDURE GetTopProduits(IN limite INT)
            BEGIN
                SELECT
                    p.id,
                    p.nom,
                    p.genre,
                    p.image_principale,
                    SUM(cc.quantite) AS total_vendus,
                    SUM(cc.quantite * cc.prix_unitaire_moment_achat) AS chiffre_affaires
                FROM produits p
                JOIN variantes_produits vp ON vp.produit_id = p.id
                JOIN contenu_commandes cc ON cc.variante_id = vp.id
                GROUP BY p.id, p.nom, p.genre, p.image_principale
                ORDER BY total_vendus DESC
                LIMIT limite;
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS GetTopProduits');
    }
};