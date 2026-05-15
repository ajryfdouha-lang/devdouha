<?php
namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseReset;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends BaseReset
{
    public function toMail($notifiable)
    {
        $url = 'http://localhost:3000/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe')
            ->greeting('Bonjour !')
            ->line('Vous recevez cet email car vous avez demandé une réinitialisation de mot de passe.')
            ->action('Réinitialiser mon mot de passe', $url)
            ->line('Ce lien expire dans 60 minutes.')
            ->salutation('Perle D&K Parfums');
    }
}