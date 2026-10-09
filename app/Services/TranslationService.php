<?php

namespace App\Services;

use App\Models\Language;
use App\Models\Translation;

class TranslationService
{
    /**
     * Get translation for key (and optional group) for locale, with fallback to default language then key.
     */
    public function get(string $key, ?string $group = null, ?string $locale = null): string
    {
        $locale = $locale ?? app()->getLocale();

        $language = Language::where('code', $locale)->where('is_active', true)->first();
        if ($language) {
            $value = $this->findTranslation($language->id, $key, $group);
            if ($value !== null) {
                return $value;
            }
        }

        $defaultLanguage = Language::where('is_default', true)->where('is_active', true)->first();
        if ($defaultLanguage && $defaultLanguage->code !== $locale) {
            $value = $this->findTranslation($defaultLanguage->id, $key, $group);
            if ($value !== null) {
                return $value;
            }
        }

        return $key;
    }

    /**
     * Get all translations for a locale, optionally by group.
     *
     * @return array<string, string> key => value
     */
    public function getGroup(?string $group = null, ?string $locale = null): array
    {
        $locale = $locale ?? app()->getLocale();
        $language = Language::where('code', $locale)->where('is_active', true)->first();
        if (! $language) {
            return [];
        }

        $query = Translation::where('language_id', $language->id);
        if ($group !== null) {
            $query->where('group', $group);
        }

        return $query->get()->pluck('value', 'key')->all();
    }

    private function findTranslation(int $languageId, string $key, ?string $group): ?string
    {
        $query = Translation::where('language_id', $languageId)->where('key', $key);
        if ($group !== null) {
            $query->where('group', $group);
        }
        $translation = $query->first();

        return $translation?->value;
    }
}
