<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'nom', 'slug', 'description',
        'is_featured', 'image'
    ];

    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
}