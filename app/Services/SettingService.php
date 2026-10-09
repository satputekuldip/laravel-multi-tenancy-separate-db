<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\User;

class SettingService
{
    /**
     * Get a setting value with precedence: user > group > site.
     *
     * @param  array<int>  $groupIds  Optional group (e.g. role) IDs for the user.
     */
    public function get(string $key, mixed $default = null, ?User $user = null, array $groupIds = []): mixed
    {
        if ($user) {
            $userSetting = Setting::query()
                ->forUser($user->id)
                ->where('key', $key)
                ->first();
            if ($userSetting !== null) {
                return $userSetting->value;
            }
        }

        foreach ($groupIds as $groupId) {
            $groupSetting = Setting::query()
                ->forGroup($groupId)
                ->where('key', $key)
                ->first();
            if ($groupSetting !== null) {
                return $groupSetting->value;
            }
        }

        $siteSetting = Setting::query()->site()->where('key', $key)->first();

        return $siteSetting?->value ?? $default;
    }

    /**
     * Set a setting value for the given scope.
     */
    public function set(string $key, mixed $value, string $scope = 'site', ?int $scopeId = null): Setting
    {
        $scopeId = $scope === 'site' ? null : $scopeId;

        return Setting::query()->updateOrCreate(
            [
                'scope' => $scope,
                'scope_id' => $scopeId,
                'key' => $key,
            ],
            ['value' => is_string($value) ? $value : json_encode($value)]
        );
    }

    /**
     * Get all site-scoped settings as key-value array.
     *
     * @return array<string, string>
     */
    public function getSiteSettings(): array
    {
        return Setting::query()
            ->site()
            ->get()
            ->pluck('value', 'key')
            ->all();
    }

    /**
     * Set multiple site-scoped settings from key-value array.
     *
     * @param  array<string, mixed>  $settings
     */
    public function setSiteSettings(array $settings): void
    {
        foreach ($settings as $key => $value) {
            $this->set($key, $value, 'site', null);
        }
    }
}
