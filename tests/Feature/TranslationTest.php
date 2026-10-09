<?php

namespace Tests\Feature;

use App\Models\Language;
use App\Models\Translation;
use App\Services\TranslationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TranslationTest extends TestCase
{
    use RefreshDatabase;

    protected TranslationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(TranslationService::class);
    }

    public function test_get_returns_key_when_no_translation_exists(): void
    {
        $this->assertSame('welcome', $this->service->get('welcome'));
    }

    public function test_get_returns_translation_for_locale(): void
    {
        $lang = Language::factory()->create(['code' => 'en', 'is_active' => true, 'is_default' => true]);
        Translation::query()->create([
            'language_id' => $lang->id,
            'group' => 'messages',
            'key' => 'welcome',
            'value' => 'Welcome',
        ]);

        app()->setLocale('en');
        $this->assertSame('Welcome', $this->service->get('welcome', 'messages'));
    }

    public function test_get_falls_back_to_default_language(): void
    {
        $defaultLang = Language::factory()->create(['code' => 'en', 'is_active' => true, 'is_default' => true]);
        Translation::query()->create([
            'language_id' => $defaultLang->id,
            'group' => 'messages',
            'key' => 'hello',
            'value' => 'Hello',
        ]);

        $fr = Language::factory()->create(['code' => 'fr', 'is_active' => true, 'is_default' => false]);
        app()->setLocale('fr');

        $this->assertSame('Hello', $this->service->get('hello', 'messages'));
    }

    public function test_get_group_returns_key_value_array(): void
    {
        $lang = Language::factory()->create(['code' => 'en', 'is_active' => true]);
        Translation::query()->create([
            'language_id' => $lang->id,
            'group' => 'messages',
            'key' => 'welcome',
            'value' => 'Welcome',
        ]);
        Translation::query()->create([
            'language_id' => $lang->id,
            'group' => 'messages',
            'key' => 'bye',
            'value' => 'Goodbye',
        ]);

        app()->setLocale('en');
        $group = $this->service->getGroup('messages');
        $this->assertCount(2, $group);
        $this->assertSame('Welcome', $group['welcome']);
        $this->assertSame('Goodbye', $group['bye']);
    }
}
