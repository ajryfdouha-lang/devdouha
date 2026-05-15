<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'nom',        // ← nom pas name
        'email',
        'password',
        'telephone',
        'adresse',
        'ville',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function sendPasswordResetNotification($token)
{
    $this->notify(new ResetPasswordNotification($token));
}
}