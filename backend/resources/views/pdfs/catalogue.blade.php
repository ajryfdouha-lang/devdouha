<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: DejaVu Sans, sans-serif; color: #2a1e14; }
  .header { background: #6B1515; color: #F5E6C8; padding: 16px; text-align: center; }
  .logo { font-size: 20px; margin: 0; letter-spacing: 3px; }
  .slogan { color: #C4922A; font-size: 11px; margin: 4px 0 0; }
  .body { padding: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { background: #6B1515; color: #F5E6C8; padding: 8px 10px; font-size: 11px; text-align: left; }
  td { padding: 7px 10px; border-bottom: 1px solid #e0c8a0; font-size: 11px; }
  tr:nth-child(even) td { background: #fdf8f0; }
  .footer { text-align: center; font-size: 10px; color: #888; margin-top: 20px; }
</style>
</head>
<body>
  <div class="header">
    <p class="logo">PERLE D&K PARFUMS</p>
    <p class="slogan">"Beauty unseen, scent felt." — Catalogue au {{ now()->format('d/m/Y') }}</p>
  </div>
  <div class="body">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nom</th>
          <th>Brand</th>
          <th>Genre</th>
          <th>Famille</th>
          <th>30ml</th>
          <th>50ml</th>
          <th>100ml</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        @foreach($produits as $i => $p)
        <tr>
          <td>{{ $i + 1 }}</td>
          <td>{{ $p->nom }}</td>
          <td>{{ $p->brand?->nom ?? '—' }}</td>
          <td>{{ $p->genre }}</td>
          <td>{{ $p->famille_olfactive }}</td>
          <td>{{ $p->prix_30ml ? number_format($p->prix_30ml, 2) . ' MAD' : '—' }}</td>
          <td>{{ $p->prix_50ml ? number_format($p->prix_50ml, 2) . ' MAD' : '—' }}</td>
          <td>{{ $p->prix_100ml ? number_format($p->prix_100ml, 2) . ' MAD' : '—' }}</td>
          <td>{{ $p->stock }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
  <div class="footer">
    © 2025 Perle D&K Parfums — Total : {{ $produits->count() }} produits
  </div>
</body>
</html>