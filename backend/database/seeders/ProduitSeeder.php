<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Produit;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    public function run(): void
    {
        $brand = Brand::first();

        if (!$brand) {
            $this->command->error('Aucune brand trouvée');
            return;
        }

        $produitsReels = [
            [
                'nom'               => '212 VIP',
                'slug'              => '212-vip',
                'description'       => 'Fragrance glamour et festive aux notes florales.',
                'famille_olfactive' => 'floral',
                'genre'             => 'homme',
                'image_principale'  => 'produits/212vip.jpeg',
                'prix_30ml'         => 50.00,
                'prix_50ml'         => 80.00,
                'prix_100ml'        => 140.00,
                'stock'             => 20,
                'brand_id'          => $brand->id,
            ],
            [
                'nom'               => 'Allure Sport',
                'slug'              => 'allure-sport',
                'description'       => 'Fraîcheur et élégance pour homme actif.',
                'famille_olfactive' => 'frais',
                'genre'             => 'homme',
                'image_principale'  => 'produits/alureH.jpeg',
                'prix_30ml'         => 50.00,
                'prix_50ml'         => 80.00,
                'prix_100ml'        => 140.00,
                'stock'             => 15,
                'brand_id'          => $brand->id,
            ],
            [
                'nom'               => 'Acqua di Gio',
                'slug'              => 'acqua-di-gio',
                'description'       => 'Notes marines et boisées irrésistibles.',
                'famille_olfactive' => 'frais',
                'genre'             => 'homme',
                'image_principale'  => 'produits/aquaGio.jpeg',
                'prix_30ml'         => 50.00,
                'prix_50ml'         => 80.00,
                'prix_100ml'        => 140.00,
                'stock'             => 18,
                'brand_id'          => $brand->id,
            ],
            [
                'nom'               => 'Pack Duo Femme',
                'slug'              => 'pack-duo-femme',
                'description'       => 'Pack de 2 parfums femme au choix.',
                'famille_olfactive' => 'floral',
                'genre'             => 'pack',
                'image_principale'  => 'produits/default.jpg',
                'prix_30ml'         => 90.00,
                'prix_50ml'         => null,
                'prix_100ml'        => null,
                'stock'             => 10,
                'brand_id'          => $brand->id,
            ],
        ];

        foreach ($produitsReels as $p) {
            Produit::updateOrCreate(
                ['slug' => $p['slug']],
                $p
            );
        }

        $this->command->info(count($produitsReels) . ' produits réels insérés');

        Produit::factory()->count(5)->femme()->create();
        Produit::factory()->count(5)->homme()->create();
        Produit::factory()->count(2)->stockFaible()->create();

        $this->command->info('12 produits générés par la factory');
    }
}