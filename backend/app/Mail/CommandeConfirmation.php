<?php

namespace App\Mail;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CommandeConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Commande $commande) {}

    public function build()
    {
        return $this
            ->subject('Confirmation commande #' . $this->commande->id . ' — Perle D&K')
            ->view('emails.commande_confirmation');
    }
}