<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteSettingsTest extends TestCase
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

    public function test_guest_cannot_access_site_settings(): void
    {
        $this->get(route('admin.site-settings.index'))->assertRedirect(route('login'));
    }

    public function test_user_without_admin_role_cannot_access_site_settings(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('admin.site-settings.index'))->assertForbidden();
    }

    public function test_admin_can_access_site_settings_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.site-settings.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('admin/site-settings/Index')->has('settings'));
    }

    public function test_admin_can_update_site_settings(): void
    {
        $response = $this->actingAs($this->admin)->put(route('admin.site-settings.update'), [
            'settings' => [
                'site_name' => 'My App',
                'site_tagline' => 'Welcome',
            ],
        ]);

        $response->assertRedirect(route('admin.site-settings.index'));
        $this->assertSame('My App', app(\App\Services\SettingService::class)->get('site_name'));
        $this->assertSame('Welcome', app(\App\Services\SettingService::class)->get('site_tagline'));
    }

    public function test_admin_can_access_site_settings_via_settings_module(): void
    {
        $response = $this->actingAs($this->admin)->get(route('settings.site-settings.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('settings/site-settings/Index')->has('settings'));
    }

    public function test_admin_can_update_site_settings_via_settings_module(): void
    {
        $response = $this->actingAs($this->admin)->put(route('settings.site-settings.update'), [
            'settings' => [
                'site_name' => 'From Settings',
            ],
        ]);

        $response->assertRedirect(route('settings.site-settings.index'));
        $this->assertSame('From Settings', app(\App\Services\SettingService::class)->get('site_name'));
    }
}
