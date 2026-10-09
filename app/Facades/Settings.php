<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed get(string $key, mixed $default = null, \App\Models\User|null $user = null, array $groupIds = [])
 * @method static \App\Models\Setting set(string $key, mixed $value, string $scope = 'site', int|null $scopeId = null)
 * @method static array<string, string> getSiteSettings()
 * @method static void setSiteSettings(array $settings)
 *
 * @see \App\Services\SettingService
 */
class Settings extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\SettingService::class;
    }
}
