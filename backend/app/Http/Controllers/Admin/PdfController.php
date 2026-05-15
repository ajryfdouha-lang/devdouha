<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    public function facture(Request $request, $id)
    {
        // Accepter token via URL param pour window.open
        if ($request->token) {
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($request->token);
            if ($tokenModel) {
                auth()->setUser($tokenModel->tokenable);
            }
        }

        $commande = Commande::with([
            'user',
            'contenu.variante.produit'
        ])->findOrFail($id);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.facture', compact('commande'));
        return $pdf->download('facture-' . $id . '.pdf');
    }

    public function catalogue()
    {
        $produits = Produit::with('brand')->get();
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdfs.catalogue', compact('produits'));
        return $pdf->download('catalogue-perledk.pdf');
    }
}