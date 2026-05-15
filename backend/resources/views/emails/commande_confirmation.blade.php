<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Georgia, serif; background: #FAF0DC; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">

    <div style="background: #6B1515; color: #F5E6C8; padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px; letter-spacing: 3px;">PERLE D&K PARFUMS</h1>
      <p style="color: #C4922A; margin: 6px 0 0; font-size: 12px;">"Beauty unseen, scent felt."</p>
    </div>

    <div style="padding: 28px;">
      <h2 style="color: #6B1515; font-weight: normal;">Merci pour votre commande !</h2>
      <p>Bonjour <strong>{{ $commande->user?->nom }}</strong>,</p>
      <p>Votre commande <strong>#{{ $commande->id }}</strong> a bien été reçue et est en cours de traitement.</p>

      <div style="background: #fdf8f0; border: 1px solid #e0c8a0; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Récapitulatif :</strong></p>
        <p style="margin: 4px 0; font-size: 13px;">Commande : #{{ $commande->id }}</p>
        <p style="margin: 4px 0; font-size: 13px;">Total : <strong>{{ number_format($commande->total_centimes / 100, 2) }} MAD</strong></p>
        <p style="margin: 4px 0; font-size: 13px;">Adresse : {{ $commande->adresse_livraison }}</p>
        <p style="margin: 4px 0; font-size: 13px;">Statut : <strong>{{ $commande->statut }}</strong></p>
      </div>
@if($commande->items)
    @foreach($commande->items as $item)
    <div style="font-size:12px; margin-bottom:4px;">
        {{ $item['nom'] }} · {{ $item['ml'] }} × {{ $item['quantite'] }}
        — {{ number_format($item['prix'] * $item['quantite'], 2) }} MAD
    </div>
    @endforeach
@endif
      <p style="font-size: 13px; color: #666;">
        Nous vous contacterons dès que votre commande sera expédiée.<br>
        Délai de livraison estimé : 2-4 jours ouvrables.
      </p>
    </div>

    <div style="text-align: center; padding: 16px; background: #3d0a0a; color: #a07060; font-size: 11px;">
      © 2025 Perle D&K Parfums — Tous droits réservés
    </div>
  </div>
</body>
</html>