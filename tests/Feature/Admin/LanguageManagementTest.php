<?php

namespace Tests\Feature\Admin;

use App\Models\Language;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LanguageManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\PermissionSeeder::class);
        $this->seed(\Database\Seeders\RoleSeeder::class);
        $this->admin = User::factory()->create();
        $this->admin->assignRole('super-admin');
    }

    public function test_guest_cannot_access_languages_index(): void
    {
        $this->get(route('admin.languages.index'))->assertRedirect(route('login'));
    }

    public function test_user_without_admin_role_cannot_access_languages_index(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('admin.languages.index'))->assertForbidden();
    }

    public function test_admin_can_access_languages_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.languages.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('admin/languages/Index')->has('languages'));
    }

    public function test_admin_can_create_language(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.languages.store'), [
            'code' => 'de',
            'name' => 'German',
            'native_name' => 'Deutsch',
            'is_default' => false,
            'is_active' => true,
            'sort_order' => 0,
        ]);

        $response->assertRedirect(route('admin.languages.index'));
        $this->assertDatabaseHas('languages', ['code' => 'de', 'name' => 'German']);
    }

    public function test_admin_can_update_language(): void
    {
        $language = Language::factory()->create(['code' => 'fr', 'name' => 'French']);

        $response = $this->actingAs($this->admin)->put(route('admin.languages.update', $language), [
            'code' => 'fr',
            'name' => 'French (updated)',
            'native_name' => 'Français',
            'is_default' => false,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response->assertRedirect(route('admin.languages.index'));
        $language->refresh();
        $this->assertSame('French (updated)', $language->name);
    }

    public function test_admin_can_view_translations_page(): void
    {
        $language = Language::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.languages.translations', $language));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('admin/languages/Translations')
            ->has('language')
            ->has('translations'));
    }

    public function test_admin_can_update_translations(): void
    {
        $language = Language::factory()->create();

        $response = $this->actingAs($this->admin)->put(route('admin.languages.translations.update', $language), [
            'translations' => [
                ['group' => 'messages', 'key' => 'welcome', 'value' => 'Welcome'],
                ['group' => 'messages', 'key' => 'hello', 'value' => 'Hello'],
            ],
        ]);

        $response->assertRedirect(route('admin.languages.translations', $language));
        $this->assertDatabaseHas('translations', [
            'language_id' => $language->id,
            'group' => 'messages',
            'key' => 'welcome',
            'value' => 'Welcome',
        ]);
    }
}
