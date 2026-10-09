<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Languages
 *
 * APIs for listing active languages and their translations.
 */
class LanguageController extends Controller
{
    /**
     * List all active languages
     *
     * Returns active languages with id, code, name, native_name, is_default, is_active, sort_order, and timestamps.
     *
     * @response 200 scenario="success" {"languages":[{"id":1,"code":"en","name":"English","native_name":"English","is_default":true,"is_active":true,"sort_order":0,"created_at":"2024-01-01T00:00:00.000000Z","updated_at":"2024-01-01T00:00:00.000000Z"}]}
     */
    public function index(Request $request): JsonResponse
    {
        $languages = Language::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return response()->json([
            'languages' => $languages,
        ]);
    }

    /**
     * Get translations for a language by code
     *
     * Returns the language and translations grouped by group (each group is key => value).
     *
     * @urlParam languageCode string required The language code (e.g. en). Example: en
     *
     * @response 200 scenario="success" {"language":{"id":1,"code":"en","name":"English","native_name":"English","is_default":true,"is_active":true,"sort_order":0,"created_at":"2024-01-01T00:00:00.000000Z","updated_at":"2024-01-01T00:00:00.000000Z"},"translations":{"messages":{"welcome":"Welcome","hello":"Hello"}}}
     * @response 404 scenario="language not found" {"message":"No query results for model [App\\Models\\Language]."}
     */
    public function translations(Request $request, string $languageCode): JsonResponse
    {
        $language = Language::where('code', $languageCode)
            ->where('is_active', true)
            ->firstOrFail();

        $translations = Translation::where('language_id', $language->id)
            ->get()
            ->groupBy('group')
            ->map(function ($group) {
                return $group->pluck('value', 'key');
            });

        return response()->json([
            'language' => $language,
            'translations' => $translations,
        ]);
    }

    /**
     * Get all active languages with their translations
     *
     * Returns each language with code, name, native_name, and translations (object keyed by group, then key => value).
     *
     * @response 200 scenario="success" {"languages":[{"code":"en","name":"English","native_name":"English","translations":{"messages":{"welcome":"Welcome","hello":"Hello"}}}]}
     */
    public function allTranslations(Request $request): JsonResponse
    {
        $languages = Language::where('is_active', true)
            ->with(['translations' => function ($query) {
                $query->orderBy('group')->orderBy('key');
            }])
            ->get();

        $result = $languages->map(function ($language) {
            $translations = $language->translations->groupBy('group')
                ->map(function ($group) {
                    return $group->pluck('value', 'key');
                });

            return [
                'code' => $language->code,
                'name' => $language->name,
                'native_name' => $language->native_name,
                'translations' => $translations,
            ];
        });

        return response()->json([
            'languages' => $result,
        ]);
    }
}
