<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserManagementTest extends TestCase
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

    public function test_guest_cannot_access_users_index(): void
    {
        $this->get(route('admin.users.index'))->assertRedirect(route('login'));
    }

    public function test_user_without_admin_role_cannot_access_users_index(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->get(route('admin.users.index'))->assertForbidden();
    }

    public function test_admin_can_access_users_index(): void
    {
        $this->actingAs($this->admin)->get(route('admin.users.index'))->assertOk();
    }

    public function test_admin_can_create_user_with_roles(): void
    {
        $role = Role::where('name', 'user')->first();

        $this->actingAs($this->admin)
            ->post(route('admin.users.store'), [
                'name' => 'New User',
                'email' => 'newuser@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
                'roles' => [$role->name],
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
        $user = User::where('email', 'newuser@example.com')->first();
        $this->assertTrue($user->hasRole('user'));
    }

    public function test_admin_can_update_user_and_roles(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');
        $adminRole = Role::where('name', 'admin')->first();

        $this->actingAs($this->admin)
            ->put(route('admin.users.update', $user), [
                'name' => 'Updated Name',
                'email' => $user->email,
                'roles' => [$adminRole->name],
            ])
            ->assertRedirect(route('admin.users.index'));

        $user->refresh();
        $this->assertSame('Updated Name', $user->name);
        $this->assertTrue($user->hasRole('admin'));
    }

    public function test_admin_can_delete_user(): void
    {
        $user = User::factory()->create();
        $userId = $user->id;

        $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $user))
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseMissing('users', ['id' => $userId]);
    }

    public function test_users_index_supports_search_filter(): void
    {
        User::factory()->create(['name' => 'Alice Smith', 'email' => 'alice@example.com']);
        User::factory()->create(['name' => 'Bob Jones', 'email' => 'bob@example.com']);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['search' => 'Alice']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('admin/users/index')
            ->has('users')
            ->where('users.data.0.name', 'Alice Smith'));
    }

    public function test_admin_user_does_not_see_super_admin_users_in_list(): void
    {
        $adminUser = User::factory()->create();
        $adminUser->assignRole('admin');
        $superAdminUser = User::factory()->create();
        $superAdminUser->assignRole('super-admin');

        $response = $this->actingAs($adminUser)->get(route('admin.users.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('admin/users/index')
            ->has('users.data')
            ->where('users.total', 1)
            ->where('users.data.0.id', $adminUser->id));
    }

    public function test_only_super_admin_can_change_other_user_role_and_email(): void
    {
        $adminUser = User::factory()->create();
        $adminUser->assignRole('admin');
        $targetUser = User::factory()->create(['email' => 'target@example.com']);
        $targetUser->assignRole('user');

        $this->actingAs($adminUser)
            ->put(route('admin.users.update', $targetUser), [
                'name' => 'Updated By Admin',
                'email' => 'changed@example.com',
                'roles' => ['admin'],
            ])
            ->assertRedirect(route('admin.users.index'));

        $targetUser->refresh();
        $this->assertSame('Updated By Admin', $targetUser->name);
        $this->assertSame('target@example.com', $targetUser->email, 'Admin cannot change email');
        $this->assertTrue($targetUser->hasRole('user'), 'Admin cannot change roles');
    }

    public function test_admin_can_import_users_from_csv(): void
    {
        $csv = "name,email,password\nJane Doe,jane@example.com,secret123\nJohn Smith,john@example.com,";
        $file = UploadedFile::fake()->createWithContent('users.csv', $csv);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.import'), ['file' => $file]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_import_rejects_non_csv_file(): void
    {
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.import'), ['file' => $file]);

        $response->assertSessionHasErrors('file');
    }

    public function test_admin_can_bulk_delete_users(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user1->assignRole('user');
        $user2->assignRole('user');

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.bulk-destroy'), ['ids' => [$user1->id, $user2->id]]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseMissing('users', ['id' => $user1->id]);
        $this->assertDatabaseMissing('users', ['id' => $user2->id]);
    }

    public function test_admin_can_bulk_assign_role(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user1->assignRole('user');
        $user2->assignRole('user');
        $adminRole = Role::where('name', 'admin')->first();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.bulk-assign-role'), [
                'ids' => [$user1->id, $user2->id],
                'role' => $adminRole->name,
            ]);

        $response->assertRedirect(route('admin.users.index'));
        $user1->refresh();
        $user2->refresh();
        $this->assertTrue($user1->hasRole('admin'));
        $this->assertTrue($user2->hasRole('admin'));
    }

    public function test_non_super_admin_cannot_bulk_delete_super_admin(): void
    {
        $adminUser = User::factory()->create();
        $adminUser->assignRole('admin');
        $superAdminUser = User::factory()->create();
        $superAdminUser->assignRole('super-admin');

        $this->actingAs($adminUser)
            ->post(route('admin.users.bulk-destroy'), ['ids' => [$superAdminUser->id]])
            ->assertRedirect(route('admin.users.index'));

        $this->assertDatabaseHas('users', ['id' => $superAdminUser->id]);
    }

    public function test_admin_cannot_delete_self(): void
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->admin));

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('error', 'You cannot delete your own account.');
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }

    public function test_bulk_destroy_excludes_current_user(): void
    {
        $other = User::factory()->create();
        $other->assignRole('user');

        $response = $this->actingAs($this->admin)
            ->post(route('admin.users.bulk-destroy'), [
                'ids' => [$this->admin->id, $other->id],
            ]);

        $response->assertRedirect(route('admin.users.index'));
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
        $this->assertDatabaseMissing('users', ['id' => $other->id]);
    }
}
