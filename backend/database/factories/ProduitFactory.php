<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition(): array
    {
        $genres   = ['femme', 'homme', 'mixte', 'pack'];
        $familles = ['floral', 'boisé', 'oriental', 'frais', 'épicé', 'musqué'];

        $nomsParfums = [
            'Rose Royale', 'Oud Mystère', 'Jasmin Doré', 'Bois Précieux',
            'Musc Blanc', 'Ambre Oriental', 'Fleur de Nuit', 'Cèdre Noble',
            'Iris Sauvage', 'Santal Doux', 'Patchouli Intense', 'Bergamote Fraîche',
            'Vanille Noire', 'Vétiver Fumé', 'Ylang Tropical', 'Neroli Pur',
        ];

        $nom = $this->faker->unique()->randomElement($nomsParfums);

        return [
            'nom'               => $nom,
            'slug'              => Str::slug($nom) . '-' . $this->faker->unique()->numberBetween(1, 999),
            'description'       => $this->faker->sentences(2, true),
            'famille_olfactive' => $this->faker->randomElement($familles),
            'genre'             => $this->faker->randomElement($genres),
            'image_principale'  => 'produits/default.jpg',
            'prix_30ml'         => $this->faker->randomFloat(2, 50, 200),
            'prix_50ml'         => $this->faker->randomFloat(2, 100, 350),
            'prix_100ml'        => $this->faker->randomFloat(2, 200, 600),
            'stock'             => $this->faker->numberBetween(5, 50),
            'brand_id'          => Brand::inRandomOrder()->first()->id,
        ];
    }

    // État spécial : produit femme
    public function femme(): static
    {
        return $this->state(['genre' => 'femme']);
    }

    // État spécial : produit homme
    public function homme(): static
    {
        return $this->state(['genre' => 'homme']);
    }

    // État spécial : stock faible
    public function stockFaible(): static
    {
        return $this->state(['stock' => $this->faker->numberBetween(0, 4)]);
    }
}