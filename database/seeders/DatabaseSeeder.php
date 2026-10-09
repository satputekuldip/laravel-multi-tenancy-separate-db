<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            LanguageSeeder::class,
        ]);

        // User::factory(10)->create();

        $user = User::firstOrCreate(
            ['email' => 'admin@magicstack.dev'],
            [
                'name' => 'Super Admin',
                'password' => 'secret@123',
                'email_verified_at' => now(),
            ]
        );

        // Assign super-admin role to test user if not already assigned
        if (! $user->hasRole('super-admin')) {
            $user->assignRole('super-admin');
        }
    }
}
