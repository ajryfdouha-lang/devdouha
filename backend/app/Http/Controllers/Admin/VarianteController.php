<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VarianteProduit;
use App\Models\Produit;
use Illuminate\Http\Request;

class VarianteController extends Controller
{
    public function index()
    {
        $variantes = VarianteProduit::with('produit')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($v) {
                return [
                    'id'            => $v->id,
                    'produit_id'    => $v->produit_id,
                    'produit_nom'   => $v->produit?->nom,
                    'contenance'    => $v->contenance,
                    'prix_centimes' => $v->prix_centimes,
                    'prix_dh'       => number_format($v->prix_centimes / 100, 2),
                    'stock'         => $v->stock,
                    'created_at'    => $v->created_at?->format('Y-m-d'),
                ];
            });

        return response()->json(['data' => $variantes]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit_id'    => 'required|exists:produits,id',
            'contenance'    => 'required|string|max:50',
            'prix_centimes' => 'required|integer|min:0',
            'stock'         => 'required|integer|min:0',
        ]);

        // Vérifier qu'il n'y a pas déjà cette contenance pour ce produit
        $existe = VarianteProduit::where('produit_id', $request->produit_id)
                                  ->where('contenance', $request->contenance)
                                  ->exists();

        if ($existe) {
            return response()->json([
                'message' => 'Cette contenance existe déjà pour ce produit'
            ], 422);
        }

        $variante = VarianteProduit::create([
            'produit_id'    => $request->produit_id,
            'contenance'    => $request->contenance,
            'prix_centimes' => $request->prix_centimes,
            'stock'         => $request->stock,
        ]);

        return response()->json([
            'message' => 'Variante ajoutée',
            'data'    => $variante
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $variante = VarianteProduit::findOrFail($id);

        $request->validate([
            'produit_id'    => 'required|exists:produits,id',
            'contenance'    => 'required|string|max:50',
            'prix_centimes' => 'required|integer|min:0',
            'stock'         => 'required|integer|min:0',
        ]);

        $variante->update([
            'produit_id'    => $request->produit_id,
            'contenance'    => $request->contenance,
            'prix_centimes' => $request->prix_centimes,
            'stock'         => $request->stock,
        ]);

        return response()->json([
            'message' => 'Variante modifiée',
            'data'    => $variante
        ]);
    }

    public function destroy($id)
    {
        $variante = VarianteProduit::findOrFail($id);
        $variante->delete();
        return response()->json(['message' => 'Variante supprimée']);
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'quantite' => 'required|integer',
        ]);

        $variante = VarianteProduit::findOrFail($id);

        if ($request->quantite > 0) {
            $variante->increment('stock', $request->quantite);
        } else {
            $variante->decrement('stock', abs($request->quantite));
        }

        return response()->json([
            'message' => 'Stock variante mis à jour',
            'stock'   => $variante->fresh()->stock
        ]);
    }
}