<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
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

    public function test_guest_cannot_access_activity_log(): void
    {
        $this->get(route('admin.activity-log.index'))->assertRedirect(route('login'));
    }

    public function test_user_without_permission_cannot_access_activity_log(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('admin.activity-log.index'))->assertForbidden();
    }

    public function test_admin_can_access_activity_log_index(): void
    {
        $this->actingAs($this->admin)->get(route('admin.activity-log.index'))->assertOk();
    }

    public function test_activity_log_index_supports_actor_filter(): void
    {
        activity()->causedBy($this->admin)->log('test action');

        $response = $this->actingAs($this->admin)
            ->get(route('admin.activity-log.index', ['actor_id' => $this->admin->id]));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('admin/activity-log/Index')
            ->has('activities')
            ->has('filters')
            ->where('filters.actor_id', (string) $this->admin->id));
    }

    public function test_activity_log_index_supports_date_filter(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.activity-log.index', ['from_date' => now()->subDay()->format('Y-m-d'), 'to_date' => now()->addDay()->format('Y-m-d')]));

        $response->assertOk();
    }
}
