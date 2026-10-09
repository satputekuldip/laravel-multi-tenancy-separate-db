<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLanguageRequest;
use App\Http\Requests\Admin\UpdateLanguageRequest;
use App\Http\Requests\Admin\UpdateTranslationsRequest;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    /**
     * List all languages.
     */
    public function index(): Response
    {
        $languages = Language::query()->orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('admin/languages/Index', [
            'languages' => $languages,
        ]);
    }

    /**
     * Show create language form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/languages/Create');
    }

    /**
     * Store a new language.
     */
    public function store(StoreLanguageRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_default'] = $request->boolean('is_default');
        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        Language::query()->create($data);

        return redirect()->route('admin.languages.index')->with('success', 'Language created.');
    }

    /**
     * Show edit language form.
     */
    public function edit(Language $language): Response
    {
        return Inertia::render('admin/languages/Edit', [
            'language' => $language,
        ]);
    }

    /**
     * Update a language.
     */
    public function update(UpdateLanguageRequest $request, Language $language): RedirectResponse
    {
        $data = $request->validated();
        $data['is_default'] = $request->boolean('is_default');
        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);

        if ($data['is_default'] ?? false) {
            Language::query()->where('id', '!=', $language->id)->update(['is_default' => false]);
        }

        $language->update($data);

        return redirect()->route('admin.languages.index')->with('success', 'Language updated.');
    }

    /**
     * Show translations for a language (edit form).
     */
    public function translations(Language $language): Response
    {
        $translations = $language->translations()->orderBy('group')->orderBy('key')->get();

        return Inertia::render('admin/languages/Translations', [
            'language' => $language,
            'translations' => $translations,
        ]);
    }

    /**
     * Update translations for a language.
     */
    public function updateTranslations(UpdateTranslationsRequest $request, Language $language): RedirectResponse
    {
        foreach ($request->validated('translations', []) as $item) {
            Translation::query()->updateOrCreate(
                [
                    'language_id' => $language->id,
                    'group' => $item['group'],
                    'key' => $item['key'],
                ],
                ['value' => $item['value'] ?? '']
            );
        }

        return redirect()
            ->route('admin.languages.translations', $language)
            ->with('success', 'Translations updated.');
    }
}
