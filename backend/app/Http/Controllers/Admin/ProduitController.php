<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::with('brand')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id'                => $p->id,
                    'nom'               => $p->nom,
                    'slug'              => $p->slug,
                    'description'       => $p->description,
                    'famille_olfactive' => $p->famille_olfactive,
                    'genre'             => $p->genre,
                    'stock'             => $p->stock,
                    'prix_30ml'         => (float) $p->prix_30ml,
                    'prix_50ml'         => $p->prix_50ml  ? (float) $p->prix_50ml  : null,
                    'prix_100ml'        => $p->prix_100ml ? (float) $p->prix_100ml : null,
                    'brand_id'          => $p->brand_id,
                    'image_principale'  => $p->image_principale,
                    'image_url'         => $p->image_principale
                                          ? url('storage/' . $p->image_principale)
                                          : null,
                ];
            });

        return response()->json(['data' => $produits]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'               => 'required|string|max:255',
            'description'       => 'required|string',
            'famille_olfactive' => 'required|string',
            'genre'             => 'required|in:femme,homme,mixte,pack',
            'prix_30ml'         => 'required|numeric|min:0',
            'prix_50ml'         => 'nullable|numeric|min:0',
            'prix_100ml'        => 'nullable|numeric|min:0',
            'stock'             => 'required|integer|min:0',
            'brand_id'          => 'required|exists:brands,id',
            'image'             => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $imagePath = 'produits/default.jpg';
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                                 ->store('produits', 'public');
        }

        $produit = Produit::create([
            'nom'               => $request->nom,
            'slug'              => Str::slug($request->nom . '-' . time()),
            'description'       => $request->description,
            'famille_olfactive' => $request->famille_olfactive,
            'genre'             => $request->genre,
            'prix_30ml'         => $request->prix_30ml,
            'prix_50ml'         => $request->prix_50ml,
            'prix_100ml'        => $request->prix_100ml,
            'stock'             => $request->stock,
            'brand_id'          => $request->brand_id,
            'image_principale'  => $imagePath,
        ]);

        return response()->json([
            'message' => 'Produit ajouté',
            'data'    => $produit
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);

        $request->validate([
            'nom'               => 'required|string|max:255',
            'description'       => 'required|string',
            'famille_olfactive' => 'required|string',
            'genre'             => 'required|in:femme,homme,mixte,pack',
            'prix_30ml'         => 'required|numeric|min:0',
            'prix_50ml'         => 'nullable|numeric|min:0',
            'prix_100ml'        => 'nullable|numeric|min:0',
            'stock'             => 'required|integer|min:0',
            'brand_id'          => 'required|exists:brands,id',
            'image'             => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $produit->image_principale = $request->file('image')
                                                  ->store('produits', 'public');
        }

        $produit->update([
            'nom'               => $request->nom,
            'slug'              => Str::slug($request->nom . '-' . time()),
            'description'       => $request->description,
            'famille_olfactive' => $request->famille_olfactive,
            'genre'             => $request->genre,
            'prix_30ml'         => $request->prix_30ml,
            'prix_50ml'         => $request->prix_50ml,
            'prix_100ml'        => $request->prix_100ml,
            'stock'             => $request->stock,
            'brand_id'          => $request->brand_id,
            'image_principale'  => $produit->image_principale,
        ]);

        return response()->json([
            'message' => 'Produit modifié',
            'data'    => $produit
        ]);
    }

    public function destroy($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'quantite' => 'required|integer',
        ]);

        $produit = Produit::findOrFail($id);

        if ($request->quantite > 0) {
            $produit->increment('stock', $request->quantite);
        } else {
            $produit->decrement('stock', abs($request->quantite));
        }

        return response()->json([
            'message' => 'Stock mis à jour',
            'stock'   => $produit->fresh()->stock
        ]);
    }
}