<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleManagementTest extends TestCase
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

    public function test_guest_cannot_access_roles_index(): void
    {
        $this->get(route('admin.roles.index'))->assertRedirect(route('login'));
    }

    public function test_user_without_admin_role_cannot_access_roles_index(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('admin.roles.index'))->assertForbidden();
    }

    public function test_admin_can_access_roles_index(): void
    {
        $this->actingAs($this->admin)->get(route('admin.roles.index'))->assertOk();
    }

    public function test_admin_can_create_role(): void
    {
        $permission = Permission::first();

        $this->actingAs($this->admin)
            ->post(route('admin.roles.store'), [
                'name' => 'editor',
                'guard_name' => 'web',
                'permissions' => [$permission->name],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $this->assertDatabaseHas('roles', ['name' => 'editor']);
        $role = Role::where('name', 'editor')->first();
        $this->assertTrue($role->hasPermissionTo($permission->name));
    }

    public function test_admin_can_update_role(): void
    {
        $role = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $permission = Permission::first();

        $this->actingAs($this->admin)
            ->put(route('admin.roles.update', $role), [
                'name' => 'editor',
                'guard_name' => 'web',
                'permissions' => [$permission->name],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $role->refresh();
        $this->assertTrue($role->hasPermissionTo($permission->name));
    }

    public function test_admin_can_delete_role(): void
    {
        $role = Role::firstOrCreate(['name' => 'deletable-role', 'guard_name' => 'web']);

        $this->actingAs($this->admin)
            ->delete(route('admin.roles.destroy', $role))
            ->assertRedirect(route('admin.roles.index'));

        $this->assertDatabaseMissing('roles', ['name' => 'deletable-role']);
    }

    public function test_super_admin_role_permissions_cannot_be_changed(): void
    {
        $superAdminRole = Role::where('name', 'super-admin')->first();
        $this->assertNotNull($superAdminRole);
        $originalPermissionCount = $superAdminRole->permissions()->count();
        $onePermission = Permission::first()->name;

        $this->actingAs($this->admin)
            ->put(route('admin.roles.update', $superAdminRole), [
                'name' => 'super-admin',
                'guard_name' => 'web',
                'permissions' => [$onePermission],
            ])
            ->assertRedirect(route('admin.roles.index'));

        $superAdminRole->refresh();
        $this->assertCount($originalPermissionCount, $superAdminRole->permissions, 'Super-admin permissions must not be changed');
    }

    public function test_super_admin_role_cannot_be_deleted(): void
    {
        $superAdminRole = Role::where('name', 'super-admin')->first();
        $this->assertNotNull($superAdminRole);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.roles.destroy', $superAdminRole));

        $response->assertRedirect(route('admin.roles.index'));
        $response->assertSessionHas('error', 'The super-admin role cannot be deleted.');
        $this->assertDatabaseHas('roles', ['name' => 'super-admin']);
    }

    public function test_super_admin_role_name_and_guard_cannot_be_changed(): void
    {
        $superAdminRole = Role::where('name', 'super-admin')->first();
        $this->assertNotNull($superAdminRole);
        $originalGuard = $superAdminRole->guard_name;

        $this->actingAs($this->admin)
            ->put(route('admin.roles.update', $superAdminRole), [
                'name' => 'renamed-super-admin',
                'guard_name' => 'api',
            ])
            ->assertRedirect(route('admin.roles.index'));

        $superAdminRole->refresh();
        $this->assertSame('super-admin', $superAdminRole->name);
        $this->assertSame($originalGuard, $superAdminRole->guard_name);
    }
}
