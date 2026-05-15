<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'message' => 'Email ou mot de passe incorrect'
        ], 401);
    }

    $user  = Auth::user();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'nom'   => $user->nom,
            'email' => $user->email,
            'role'  => $user->role,
        ]
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }

    public function me(Request $request)
{
    return response()->json([
        'id'    => $request->user()->id,
        'nom'   => $request->user()->nom,    // ← nom pas name
        'email' => $request->user()->email,
        'role'  => $request->user()->role,
    ]);
}
public function register(Request $request)
{
    $request->validate([
        'nom'       => 'required|string|max:255',
        'email'     => 'required|email|unique:users,email',
        'telephone' => 'required|string|max:20',
        'adresse'   => 'nullable|string',
        'ville'     => 'nullable|string',
        'password'  => 'required|string|min:6',
    ]);

    $user = User::create([
        'nom'       => $request->nom,
        'email'     => $request->email,
        'telephone' => $request->telephone,
        'adresse'   => $request->adresse,
        'ville'     => $request->ville,
        'password'  => bcrypt($request->password),
        'role'      => 'client',
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Compte créé avec succès',
        'token'   => $token,
        'user'    => [
            'id'    => $user->id,
            'nom'   => $user->nom,
            'email' => $user->email,
            'role'  => $user->role,
        ]
    ], 201);
}

// Envoyer email de réinitialisation
public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink($request->only('email'));

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => 'Lien envoyé par email']);
    }

    return response()->json(['message' => 'Email introuvable'], 404);
}

// Réinitialiser le mot de passe
public function resetPassword(Request $request)
{
    $request->validate([
        'token'    => 'required',
        'email'    => 'required|email',
        'password' => 'required|string|min:6|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => bcrypt($password)
            ])->setRememberToken(Str::random(60));
            $user->save();
            event(new PasswordReset($user));
        }
    );

    if ($status === Password::PASSWORD_RESET) {
        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }

    return response()->json(['message' => 'Token invalide ou expiré'], 400);
}

public function changePassword(Request $request)
{
    $request->validate([
        'ancien_password'   => 'required|string',
        'nouveau_password'  => 'required|string|min:6',
        'confirmer_password'=> 'required|same:nouveau_password',
    ]);

    $user = $request->user();

    if (!Hash::check($request->ancien_password, $user->password)) {
        return response()->json(['message' => 'Ancien mot de passe incorrect'], 400);
    }

    $user->update(['password' => bcrypt($request->nouveau_password)]);

    return response()->json(['message' => 'Mot de passe modifié avec succès']);
}

}