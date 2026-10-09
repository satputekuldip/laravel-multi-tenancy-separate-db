<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * @group Permissions
 *
 * APIs for listing permissions, roles, current user permissions, and checking a single permission.
 */
class PermissionController extends Controller
{
    /**
     * List all permissions
     *
     * Returns all permissions with id, name, guard_name, and timestamps.
     *
     * @response 200 scenario="success" {"permissions":[{"id":1,"name":"users.view","guard_name":"web","created_at":"2024-01-01T00:00:00.000000Z","updated_at":"2024-01-01T00:00:00.000000Z"}]}
     * @response 401 scenario="unauthenticated" {"message":"Unauthenticated."}
     */
    public function index(Request $request): JsonResponse
    {
        $permissions = Permission::orderBy('name')->get();

        return response()->json([
            'permissions' => $permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                    'created_at' => $permission->created_at,
                    'updated_at' => $permission->updated_at,
                ];
            }),
        ]);
    }

    /**
     * List all roles with their permissions
     *
     * Returns all roles with id, name, guard_name, permissions (array of permission names), and timestamps.
     *
     * @response 200 scenario="success" {"roles":[{"id":1,"name":"admin","guard_name":"web","permissions":["users.view","users.create"],"created_at":"2024-01-01T00:00:00.000000Z","updated_at":"2024-01-01T00:00:00.000000Z"}]}
     * @response 401 scenario="unauthenticated" {"message":"Unauthenticated."}
     */
    public function roles(Request $request): JsonResponse
    {
        $roles = Role::with('permissions')->orderBy('name')->get();

        return response()->json([
            'roles' => $roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'permissions' => $role->permissions->pluck('name'),
                    'created_at' => $role->created_at,
                    'updated_at' => $role->updated_at,
                ];
            }),
        ]);
    }

    /**
     * Get current user's permissions and roles
     *
     * Returns the authenticated user's permissions, role names, and direct permissions.
     *
     * @response 200 scenario="success" {"permissions":["users.view","users.create"],"roles":["admin"],"direct_permissions":[]}
     * @response 401 scenario="unauthenticated" {"message":"Unauthenticated."}
     */
    public function userPermissions(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'roles' => $user->getRoleNames(),
            'direct_permissions' => $user->getDirectPermissions()->pluck('name'),
        ]);
    }

    /**
     * Check if current user has a permission
     *
     * Returns allowed true/false for the given permission name.
     *
     * @queryParam permission string required The permission name to check (e.g. users.view). Example: users.view
     *
     * @response 200 scenario="allowed" {"allowed":true}
     * @response 200 scenario="denied" {"allowed":false}
     * @response 401 scenario="unauthenticated" {"message":"Unauthenticated."}
     * @response 422 scenario="validation error" {"message":"The permission field is required.","errors":{"permission":["The permission field is required."]}}
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate(['permission' => ['required', 'string', 'max:255']]);

        $allowed = $request->user()->can($request->input('permission'));

        return response()->json(['allowed' => $allowed]);
    }
}
