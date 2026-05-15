<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ProduitController as AdminProduitController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\VarianteController;
use App\Http\Controllers\Admin\CommandeController;

// Ajouter en haut
use App\Http\Controllers\Admin\XmlController;
use App\Http\Controllers\Admin\RapportController;
use App\Http\Controllers\Admin\PdfController;

// Ajouter dans le groupe admin
Route::get('/rapports/stats',          [RapportController::class, 'stats']);
Route::get('/rapports/top-produits',   [RapportController::class, 'topProduits']);
Route::get('/rapports/alertes-stock',  [RapportController::class, 'alertesStock']);

Route::get('/export/xml',              [XmlController::class, 'export']);
Route::get('/export/xml/brands',       [XmlController::class, 'exportBrands']);
Route::post('/import/xml',             [XmlController::class, 'import']);
Route::post('/import/xml/brands',      [XmlController::class, 'importBrands']);

Route::get('/pdf/facture/{id}',        [PdfController::class, 'facture']);
Route::get('/pdf/catalogue',           [PdfController::class, 'catalogue']);
// Route publique commandes
Route::middleware('auth:sanctum')->post('/commandes', [CommandeController::class, 'store']);
Route::post('/register', [AuthController::class, 'register']);

// Routes publiques produits
Route::get('/produits',      [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/brands',        [BrandController::class, 'index']);

// Auth
Route::middleware('auth:sanctum')->post('/change-password', [AuthController::class, 'changePassword']); 
Route::middleware('auth:sanctum')->get('/mes-commandes', [CommandeController::class, 'mesCommandes']);
Route::post('/login',  [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me',      [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password',  [AuthController::class, 'resetPassword']);





// Admin
Route::middleware(['auth:sanctum', 'isAdmin'])->prefix('admin')->group(function () {
    
   
    Route::get('/produits',              [AdminProduitController::class, 'index']);
    Route::post('/produits',             [AdminProduitController::class, 'store']);
    Route::post('/produits/{id}',        [AdminProduitController::class, 'update']);
    Route::delete('/produits/{id}',      [AdminProduitController::class, 'destroy']);
    Route::patch('/produits/{id}/stock', [AdminProduitController::class, 'updateStock']);
    Route::patch('/produits/{id}/brand', [AdminProduitController::class, 'changerBrand']);

    Route::get('/brands',                [BrandController::class, 'index']);
    Route::post('/brands',               [BrandController::class, 'store']);
    Route::post('/brands/{id}',          [BrandController::class, 'update']);
    Route::delete('/brands/{id}',        [BrandController::class, 'destroy']);

    Route::get('/variantes',             [VarianteController::class, 'index']);
    Route::post('/variantes',            [VarianteController::class, 'store']);
    Route::put('/variantes/{id}',        [VarianteController::class, 'update']);
    Route::delete('/variantes/{id}',     [VarianteController::class, 'destroy']);

    Route::get('/commandes',             [CommandeController::class, 'index']);
    Route::patch('/commandes/{id}/statut',[CommandeController::class, 'changerStatut']);
    Route::delete('/commandes/{id}',     [CommandeController::class, 'destroy']);

    Route::get('/export/xml',            [XmlController::class, 'export']);
    Route::post('/import/xml',           [XmlController::class, 'import']);
});