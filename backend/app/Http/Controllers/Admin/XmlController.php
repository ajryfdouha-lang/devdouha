<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use SimpleXMLElement;

class XmlController extends Controller
{
    // ── Export XML ────────────────────────────────────────────────────────
    public function export()
    {
        $produits = Produit::with('brand')->get();

        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><catalogue/>');
        $xml->addAttribute('date', now()->toDateString());
        $xml->addAttribute('total', $produits->count());

        foreach ($produits as $p) {
            $produit = $xml->addChild('produit');
            $produit->addAttribute('id', $p->id);
            $produit->addChild('nom',               htmlspecialchars($p->nom));
            $produit->addChild('slug',              $p->slug);
            $produit->addChild('genre',             $p->genre);
            $produit->addChild('famille_olfactive', $p->famille_olfactive);
            $produit->addChild('description',       htmlspecialchars($p->description));
            $produit->addChild('prix_30ml',         $p->prix_30ml);
            $produit->addChild('prix_50ml',         $p->prix_50ml  ?? '');
            $produit->addChild('prix_100ml',        $p->prix_100ml ?? '');
            $produit->addChild('stock',             $p->stock);
            $produit->addChild('image',             $p->image_principale);
            $produit->addChild('brand',             htmlspecialchars($p->brand?->nom ?? ''));
        }

        return response($xml->asXML(), 200, [
            'Content-Type'        => 'application/xml',
            'Content-Disposition' => 'attachment; filename="catalogue-perledk-' . now()->format('Y-m-d') . '.xml"',
        ]);
    }

    // ── Import XML ────────────────────────────────────────────────────────
    public function import(Request $request)
    {
        $request->validate([
            'xml_file' => 'required|file|mimes:xml,txt|max:5120',
        ]);

        try {
            $xml = simplexml_load_file($request->file('xml_file')->getPathname());
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Fichier XML invalide : ' . $e->getMessage()
            ], 422);
        }

        $importes  = 0;
        $modifies  = 0;
        $erreurs   = [];

        \DB::beginTransaction();

        try {
            foreach ($xml->produit as $p) {
                $nom = (string) $p->nom;
                if (!$nom) continue;

                $data = [
                    'nom'               => $nom,
                    'slug'              => Str::slug($nom) . '-' . time() . '-' . $importes,
                    'genre'             => in_array((string)$p->genre, ['femme','homme','mixte','pack'])
                                          ? (string)$p->genre : 'mixte',
                    'famille_olfactive' => (string)$p->famille_olfactive ?: 'floral',
                    'description'       => (string)$p->description       ?: $nom,
                    'prix_30ml'         => (float)$p->prix_30ml  ?: 0,
                    'prix_50ml'         => (float)$p->prix_50ml  ?: null,
                    'prix_100ml'        => (float)$p->prix_100ml ?: null,
                    'stock'             => (int)$p->stock         ?: 0,
                    'image_principale'  => (string)$p->image      ?: 'produits/default.jpg',
                    'brand_id'          => 1,
                ];

                $existant = Produit::where('nom', $nom)->first();
                if ($existant) {
                    $existant->update($data);
                    $modifies++;
                } else {
                    Produit::create($data);
                    $importes++;
                }
            }

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Erreur import : ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message'  => "Import terminé",
            'importes' => $importes,
            'modifies' => $modifies,
            'erreurs'  => $erreurs,
        ]);
    }
}