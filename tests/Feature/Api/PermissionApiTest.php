<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PermissionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\PermissionSeeder::class);
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    public function test_guest_cannot_access_permissions_index(): void
    {
        $this->getJson(route('api.permissions.index'))->assertUnauthorized();
    }

    public function test_authenticated_user_can_get_permissions_index(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->getJson(route('api.permissions.index'));

        $response->assertOk()
            ->assertJsonStructure(['permissions' => [['id', 'name', 'guard_name', 'created_at', 'updated_at']]]);
    }

    public function test_authenticated_user_can_get_roles(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->getJson(route('api.permissions.roles'));

        $response->assertOk()
            ->assertJsonStructure(['roles' => [['id', 'name', 'guard_name', 'permissions', 'created_at', 'updated_at']]]);
    }

    public function test_authenticated_user_can_get_own_permissions(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->getJson(route('api.permissions.user'));

        $response->assertOk()
            ->assertJsonStructure(['permissions', 'roles', 'direct_permissions']);
    }

    public function test_guest_cannot_access_permission_check(): void
    {
        $this->getJson(route('api.permissions.check', ['permission' => 'users.view']))
            ->assertUnauthorized();
    }

    public function test_permission_check_requires_permission_param(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->getJson(route('api.permissions.check'))
            ->assertUnprocessable();
    }

    public function test_permission_check_returns_allowed_when_user_has_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $response = $this->actingAs($user)->getJson(route('api.permissions.check', ['permission' => 'users.view']));

        $response->assertOk()->assertJson(['allowed' => true]);
    }

    public function test_permission_check_returns_denied_when_user_lacks_permission(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->getJson(route('api.permissions.check', ['permission' => 'users.delete']));

        $response->assertOk()->assertJson(['allowed' => false]);
    }
}
