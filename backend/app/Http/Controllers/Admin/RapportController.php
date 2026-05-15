<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RapportController extends Controller
{
    // Top 5 produits via procédure stockée
    public function topProduits()
    {
        $top = DB::select('CALL GetTopProduits(?)', [5]);

        return response()->json([
            'data' => collect($top)->map(function ($p) {
                return [
                    'id'              => $p->id,
                    'nom'             => $p->nom,
                    'genre'           => $p->genre,
                    'image_url'       => $p->image_principale
                                        ? url('storage/' . $p->image_principale)
                                        : null,
                    'total_vendus'    => $p->total_vendus,
                    'chiffre_affaires'=> number_format($p->chiffre_affaires / 100, 2),
                ];
            })
        ]);
    }

    // Alertes stock (générées par trigger)
    public function alertesStock()
    {
        $alertes = DB::table('stock_alertes')
            ->join('produits', 'produits.id', '=', 'stock_alertes.produit_id')
            ->select(
                'stock_alertes.*',
                'produits.nom as produit_nom',
                'produits.stock as stock_actuel'
            )
            ->orderBy('stock_alertes.created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json(['data' => $alertes]);
    }

    // Stats générales
    public function stats()
    {
        return response()->json([
            'data' => [
                'total_produits'  => DB::table('produits')->count(),
                'total_commandes' => DB::table('commandes')->count(),
                'total_clients'   => DB::table('users')->where('role', 'client')->count(),
                'chiffre_affaires'=> number_format(
                    DB::table('commandes')
                      ->where('statut', 'livree')
                      ->sum('total_centimes') / 100, 2
                ),
                'stock_faible'    => DB::table('produits')->where('stock', '<', 5)->count(),
                'rupture_stock'   => DB::table('produits')->where('stock', 0)->count(),
            ]
        ]);
    }
}