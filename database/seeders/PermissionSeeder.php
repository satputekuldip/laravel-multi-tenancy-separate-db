<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User Management
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.assign-roles',

            // Role Management
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',
            'roles.assign-permissions',

            // Permission Management
            'permissions.view',
            'permissions.create',
            'permissions.update',
            'permissions.delete',

            // Translation Management
            'translations.view',
            'translations.create',
            'translations.update',
            'translations.delete',

            // Language Management
            'languages.view',
            'languages.create',
            'languages.update',
            'languages.delete',

            // Backup Management
            'backups.view',
            'backups.create',
            'backups.delete',

            // Activity Log
            'activity-logs.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
