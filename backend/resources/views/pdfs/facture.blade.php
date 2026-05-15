
@extends('layouts.pdf')
@section('title', 'Facture #' . $commande->id)
@section('content')
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: DejaVu Sans, sans-serif; color: #2a1e14; margin: 0; }
  .header { background: #6B1515; color: #F5E6C8; padding: 20px; text-align: center; }
  .logo { font-size: 22px; margin: 0; letter-spacing: 3px; }
  .slogan { color: #C4922A; font-size: 12px; margin: 4px 0 0; }
  .body { padding: 24px; }
  .info-grid { display: flex; justify-content: space-between; margin-bottom: 24px; }
  .info-box { font-size: 13px; line-height: 1.8; }
  .info-box strong { color: #6B1515; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #6B1515; color: #F5E6C8; padding: 10px 12px; text-align: left; font-size: 12px; }
  td { padding: 9px 12px; border-bottom: 1px solid #e0c8a0; font-size: 12px; }
  tr:nth-child(even) td { background: #fdf8f0; }
  .total-row td { font-weight: bold; color: #6B1515; font-size: 14px; border-top: 2px solid #6B1515; }
  .footer { text-align: center; font-size: 11px; color: #888; margin-top: 30px; padding: 16px; border-top: 1px solid #e0c8a0; }
</style>
</head>
<body>
  <div class="header">
    <p class="logo">PERLE D&K PARFUMS</p>
    <p class="slogan">"Beauty unseen, scent felt."</p>
  </div>
  <div class="body">
    <div class="info-grid">
      <div class="info-box">
        <strong>Facture #{{ $commande->id }}</strong><br>
        Date : {{ $commande->created_at->format('d/m/Y') }}<br>
        Statut : {{ $commande->statut }}
      </div>
      <div class="info-box">
        <strong>Client</strong><br>
        {{ $commande->user?->nom }}<br>
        {{ $commande->user?->email }}<br>
        {{ $commande->adresse_livraison }}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Contenance</th>
          <th>Qté</th>
          <th>Prix unitaire</th>
          <th>Sous-total</th>
        </tr>
      </thead>
      <tbody>
        @foreach($commande->contenu as $ligne)
        <tr>
          <td>{{ $ligne->variante?->produit?->nom ?? 'Produit' }}</td>
          <td>{{ $ligne->variante?->contenance ?? '' }}</td>
          <td>{{ $ligne->quantite }}</td>
          <td>{{ number_format($ligne->prix_unitaire_moment_achat / 100, 2) }} MAD</td>
          <td>{{ number_format($ligne->prix_unitaire_moment_achat * $ligne->quantite / 100, 2) }} MAD</td>
        </tr>
        @endforeach
        <tr class="total-row">
          <td colspan="4">Total</td>
          <td>{{ number_format($commande->total_centimes / 100, 2) }} MAD</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="footer">© 2025 Perle D&K Parfums — Tous droits réservés</div>
</body>
</html>
@endsection