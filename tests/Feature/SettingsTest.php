<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\SettingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected SettingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(SettingService::class);
    }

    public function test_get_returns_default_when_no_setting_exists(): void
    {
        $this->assertSame('default', $this->service->get('missing_key', 'default'));
    }

    public function test_set_and_get_site_setting(): void
    {
        $this->service->set('site_name', 'My Site', 'site', null);

        $this->assertSame('My Site', $this->service->get('site_name'));
    }

    public function test_precedence_user_over_group_and_site(): void
    {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

        $this->service->set('theme', 'site-theme', 'site', null);
        $this->service->set('theme', 'group-theme', 'group', $role->id);
        $this->service->set('theme', 'user-theme', 'user', $user->id);

        $groupIds = [$role->id];
        $this->assertSame('user-theme', $this->service->get('theme', null, $user, $groupIds));
    }

    public function test_precedence_group_over_site_when_no_user_setting(): void
    {
        $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

        $this->service->set('limit', '10', 'site', null);
        $this->service->set('limit', '20', 'group', $role->id);

        $this->assertSame('20', $this->service->get('limit', null, null, [$role->id]));
    }

    public function test_get_site_settings_returns_key_value_array(): void
    {
        $this->service->set('site_name', 'App', 'site', null);
        $this->service->set('site_tagline', 'Welcome', 'site', null);

        $settings = $this->service->getSiteSettings();

        $this->assertSame(['site_name' => 'App', 'site_tagline' => 'Welcome'], $settings);
    }

    public function test_set_site_settings_updates_multiple(): void
    {
        $this->service->setSiteSettings([
            'site_name' => 'New Name',
            'support_email' => 'support@example.com',
        ]);

        $this->assertSame('New Name', $this->service->get('site_name'));
        $this->assertSame('support@example.com', $this->service->get('support_email'));
    }
}
