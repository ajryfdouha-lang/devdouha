<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nom'     => 'Admin Perle DK',
            'email'    => 'ajryfdouha@gmail.com',
            'password' => Hash::make('Admin@2025'),
            'role'     => 'admin',
        ]);
    }
}