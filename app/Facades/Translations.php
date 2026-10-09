<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static string get(string $key, string|null $group = null, string|null $locale = null)
 * @method static array<string, string> getGroup(string|null $group = null, string|null $locale = null)
 *
 * @see \App\Services\TranslationService
 */
class Translations extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\TranslationService::class;
    }
}
