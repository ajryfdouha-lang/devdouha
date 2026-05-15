<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['nom' => 'Chanel',          'slug' => 'chanel',          'description' => 'Marque de luxe connue pour des parfums élégants.'],
            ['nom' => 'Dior',            'slug' => 'dior',            'description' => 'Parfums modernes et raffinés.'],
            ['nom' => 'Prada',           'slug' => 'prada',           'description' => 'Parfums modernes et sophistiqués.'],
            ['nom' => 'Giorgio Armani',  'slug' => 'giorgio-armani',  'description' => 'Parfums classiques et élégants.'],
            ['nom' => 'Versace',         'slug' => 'versace',         'description' => 'Parfums forts et glamour.'],
            ['nom' => 'Carolina Herrera','slug' => 'carolina-herrera','description' => 'Parfums chics et modernes.'],
            ['nom' => 'Yves Saint Laurent','slug' => 'ysl',           'description' => 'Parfums audacieux et sensuels.'],
            ['nom' => 'Gucci',           'slug' => 'gucci',           'description' => 'Parfums élégants et tendance.'],
            ['nom' => 'Tom Ford',        'slug' => 'tom-ford',        'description' => 'Parfums luxueux et sophistiqués.'],
            ['nom' => 'Perle D&K',       'slug' => 'perle-dk',        'description' => 'Notre marque exclusive.'],
        ];

        foreach ($brands as $brand) {
            DB::table('brands')->updateOrInsert(
                ['slug' => $brand['slug']],
                [
                    'nom'         => $brand['nom'],
                    'description' => $brand['description'],
                    'is_featured' => false,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }
    }
}