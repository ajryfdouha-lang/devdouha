<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;  // ← obligatoire pour la factory

    protected $table = 'produits';

    protected $fillable = [
        'nom', 'slug', 'description', 'famille_olfactive',
        'genre', 'image_principale', 'prix_30ml',
        'prix_50ml', 'prix_100ml', 'stock', 'brand_id'
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function variantes()
    {
        return $this->hasMany(VarianteProduit::class);
    }
}