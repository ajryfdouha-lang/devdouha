<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\CommandeConfirmation;

class CommandeController extends Controller
{
    public function index()
    {
        $commandes = Commande::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($c) {
                return [
                    'id'                => $c->id,
                    'user_id'           => $c->user_id,
                    'user_nom'          => $c->user?->nom,
                    'user_email'        => $c->user?->email,
                    'total_centimes'    => $c->total_centimes,
                    'total_dh'          => number_format($c->total_centimes / 100, 2),
                    'statut'            => $c->statut,
                    'adresse_livraison' => $c->adresse_livraison,
                    'telephone'         => $c->telephone,
                    'items'             => $c->items,
                    'created_at'        => $c->created_at?->format('Y-m-d H:i'),
                ];
            });

        return response()->json(['data' => $commandes]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'adresse_livraison'  => 'required|string',
            'telephone'          => 'required|string',
            'total_centimes'     => 'required|integer|min:1',
            'items'              => 'required|array|min:1',
            'items.*.produit_id' => 'required|integer',
            'items.*.ml'         => 'required|string',
            'items.*.quantite'   => 'required|integer|min:1',
            'items.*.prix'       => 'required|numeric',
            'items.*.nom'        => 'required|string',
        ]);

        $commande = Commande::create([
            'user_id'           => auth()->id(),
            'total_centimes'    => $request->total_centimes,
            'statut'            => 'en_attente',
            'adresse_livraison' => $request->adresse_livraison,
            'telephone'         => $request->telephone,
            'items'             => $request->items,
        ]);

        try {
            $commande->load('user');
            if ($commande->user?->email) {
                Mail::to($commande->user->email)
                    ->send(new CommandeConfirmation($commande));
            }
        } catch (\Exception $e) {}

        return response()->json([
            'message' => 'Commande créée avec succès',
            'statut'  => 'en_attente',
        ], 201);
    }

    public function mesCommandes(Request $request)
    {
        $commandes = Commande::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($c) {
                return [
                    'id'                => $c->id,
                    'total_dh'          => number_format($c->total_centimes / 100, 2),
                    'statut'            => $c->statut,
                    'adresse_livraison' => $c->adresse_livraison,
                    'telephone'         => $c->telephone,
                    'items'             => $c->items,
                    'created_at'        => $c->created_at?->format('d/m/Y H:i'),
                ];
            });

        return response()->json(['data' => $commandes]);
    }

    public function changerStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,en_cours,livree,annulee',
        ]);

        $commande = Commande::findOrFail($id);
        $commande->update(['statut' => $request->statut]);

        return response()->json([
            'message' => 'Statut mis à jour',
            'statut'  => $commande->statut
        ]);
    }

    public function destroy($id)
    {
        Commande::findOrFail($id)->delete();
        return response()->json(['message' => 'Commande supprimée']);
    }
}