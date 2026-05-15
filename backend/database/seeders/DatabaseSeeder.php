<?php

namespace Database\Seeders;

use App\Models\Produit;
use App\Models\VarianteProduit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1 — Admin
        $this->call(AdminSeeder::class);

        // 2 — Brands réelles
        $this->call(BrandSeeder::class);

        // 3 — Produits réels + factory
        $this->call(ProduitSeeder::class);

        // 4 — Variantes pour tous les produits
        Produit::all()->each(function ($produit) {
            foreach (['30ml', '50ml', '100ml'] as $taille) {
                VarianteProduit::create([
                    'produit_id'    => $produit->id,
                    'contenance'    => $taille,
                    'prix_centimes' => rand(5000, 30000),
                    'stock'         => rand(0, 100),
                ]);
            }
        });
    }
}