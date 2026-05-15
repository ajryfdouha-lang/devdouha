<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VarianteProduit extends Model
{
    protected $table = 'variantes_produits';

    protected $fillable = [
        'produit_id', 'contenance',
        'prix_centimes', 'stock'
    ];

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}