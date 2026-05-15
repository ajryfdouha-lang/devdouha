<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::withCount('produits')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($b) {
                return [
                    'id'           => $b->id,
                    'nom'          => $b->nom,
                    'slug'         => $b->slug,
                    'description'  => $b->description,
                    'is_featured'  => $b->is_featured,
                    'nb_produits'  => $b->produits_count,
                    'image_url'    => $b->image
                                     ? url('storage/' . $b->image)
                                     : null,
                    'created_at'   => $b->created_at?->format('Y-m-d'),
                ];
            });

        return response()->json(['data' => $brands]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'         => 'required|string|max:255|unique:brands,nom',
            'description' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'image'       => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                                 ->store('brands', 'public');
        }

        $brand = Brand::create([
            'nom'         => $request->nom,
            'slug'        => Str::slug($request->nom . '-' . time()),
            'description' => $request->description,
            'is_featured' => $request->is_featured ?? 0,
            'image'       => $imagePath,
        ]);

        return response()->json([
            'message' => 'Brand ajoutée',
            'data'    => $brand
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $request->validate([
            'nom'         => 'required|string|max:255|unique:brands,nom,' . $id,
            'description' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'image'       => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $brand->image = $request->file('image')
                                    ->store('brands', 'public');
        }

        $brand->update([
            'nom'         => $request->nom,
            'slug'        => Str::slug($request->nom . '-' . time()),
            'description' => $request->description,
            'is_featured' => $request->is_featured ?? $brand->is_featured,
            'image'       => $brand->image,
        ]);

        return response()->json([
            'message' => 'Brand modifiée',
            'data'    => $brand
        ]);
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        if ($brand->produits()->count() > 0) {
            return response()->json([
                'message' => 'Impossible — cette brand a des produits liés'
            ], 422);
        }

        $brand->delete();
        return response()->json(['message' => 'Brand supprimée']);
    }
}