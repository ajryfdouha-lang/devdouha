<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function index(): JsonResponse
    {
        $produits = Produit::with('brand')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($produit) {
                return [
                    'id'                => $produit->id,
                    'nom'               => $produit->nom,
                    'slug'              => $produit->slug,
                    'description'       => $produit->description,
                    'famille_olfactive' => $produit->famille_olfactive,
                    'genre'             => $produit->genre,
                    'stock'             => $produit->stock,
                    'prix_30ml'         => $produit->prix_30ml  ? (float) $produit->prix_30ml  : null,
                    'prix_50ml'         => $produit->prix_50ml  ? (float) $produit->prix_50ml  : null,
                    'prix_100ml'        => $produit->prix_100ml ? (float) $produit->prix_100ml : null,
                    'image_principale'  => $produit->image_principale,
                    'image_url'         => $produit->image_principale
                                          ? url('storage/' . $produit->image_principale)
                                          : null,
                    'brand' => $produit->brand ? [
                        'id'  => $produit->brand->id,
                        'nom' => $produit->brand->nom,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'count'   => $produits->count(),
            'data'    => $produits,
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $produit = Produit::with('brand', 'variantes')->find($id);

        if (!$produit) {
            return response()->json(['success' => false, 'message' => 'Produit introuvable'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'                => $produit->id,
                'nom'               => $produit->nom,
                'description'       => $produit->description,
                'famille_olfactive' => $produit->famille_olfactive,
                'genre'             => $produit->genre,
                'stock'             => $produit->stock,
                'prix_30ml'         => (float) $produit->prix_30ml,
                'prix_50ml'         => $produit->prix_50ml  ? (float) $produit->prix_50ml  : null,
                'prix_100ml'        => $produit->prix_100ml ? (float) $produit->prix_100ml : null,
                'image_url'         => $produit->image_principale
                                       ? url('storage/' . $produit->image_principale)
                                       : null,
                'brand'    => $produit->brand,
                'variantes'=> $produit->variantes,
            ]
        ], 200);
    }
}