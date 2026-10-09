<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkAssignRoleRequest;
use App\Http\Requests\Admin\BulkDestroyUsersRequest;
use App\Http\Requests\Admin\ImportUsersRequest;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $this->authorize('users.view');

        $query = User::with('roles')->latest();

        if (! $request->user()->hasRole('super-admin')) {
            $query->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'));
        }

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $request->input('role')));
        }

        $users = $query->paginate(15)->withQueryString();
        $roles = Role::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', ''),
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(Request $request): Response
    {
        $this->authorize('users.create');

        $roles = Role::orderBy('name')->get();

        return Inertia::render('admin/users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(Request $request, User $user): Response
    {
        $this->authorize('users.update');

        $user->load('roles');
        $roles = Role::orderBy('name')->get();
        $isSelf = $user->id === $request->user()?->id;
        $canChangeRoleAndEmail = $request->user()?->hasRole('super-admin') && ! $isSelf;

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'roles' => $roles,
            'canChangeRoleAndEmail' => $canChangeRoleAndEmail,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $isSelf = $user->id === $request->user()?->id;
        $canChangeRoleAndEmail = $request->user()?->hasRole('super-admin') && ! $isSelf;

        $user->name = $request->name;
        if ($canChangeRoleAndEmail) {
            $user->email = $request->email;
        }

        if ($request->filled('password')) {
            $user->password = $request->password;
        }

        $user->save();

        if ($canChangeRoleAndEmail && $request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('users.delete');

        if ($user->id === $request->user()?->id) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Import users from CSV file.
     * CSV columns: name, email, password (optional). First row may be header.
     */
    public function import(ImportUsersRequest $request): RedirectResponse
    {
        $file = $request->file('file');
        $path = $file->getRealPath();
        $rows = [];
        $hasHeader = false;

        if (($handle = fopen($path, 'r')) !== false) {
            $first = fgetcsv($handle);
            if ($first !== false) {
                $normalized = array_map('strtolower', array_map('trim', $first));
                if (in_array('name', $normalized, true) || in_array('email', $normalized, true)) {
                    $hasHeader = true;
                } else {
                    $rows[] = $this->mapCsvRowToUserData($first);
                }
            }
            while (($data = fgetcsv($handle)) !== false) {
                $rows[] = $this->mapCsvRowToUserData($data, $hasHeader ? $first : null);
            }
            fclose($handle);
        }

        $created = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            if (empty($row['name']) && empty($row['email'])) {
                continue;
            }
            $oneBased = $hasHeader ? $index + 2 : $index + 1;
            $validator = Validator::make($row, [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
                'password' => ['nullable', 'string', Password::default()],
            ], [], ['name' => 'name (row '.$oneBased.')', 'email' => 'email (row '.$oneBased.')', 'password' => 'password (row '.$oneBased.')']);

            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $message) {
                    $errors[] = "Row {$oneBased}: {$message}";
                }

                continue;
            }

            $password = $row['password'] ?? null;
            if ($password === null || $password === '') {
                $password = str()->password(16);
            }

            User::create([
                'name' => $row['name'],
                'email' => $row['email'],
                'password' => $password,
            ]);
            $created++;
        }

        $message = $created > 0
            ? "Imported {$created} user(s) successfully."
            : 'No users were imported.';
        if (count($errors) > 0) {
            $message .= ' '.count($errors).' row(s) had errors: '.implode(' ', array_slice($errors, 0, 5));
            if (count($errors) > 5) {
                $message .= ' …';
            }
        }

        return redirect()->route('admin.users.index')
            ->with($created > 0 ? 'success' : 'warning', $message);
    }

    /**
     * @param  array<int, string>  $data
     * @param  array<int, string>|null  $header
     * @return array{name: string, email: string, password: string|null}
     */
    private function mapCsvRowToUserData(array $data, ?array $header = null): array
    {
        if ($header !== null) {
            $keyed = [];
            foreach ($header as $i => $col) {
                $keyed[strtolower(trim($col))] = $data[$i] ?? '';
            }

            return [
                'name' => trim($keyed['name'] ?? ''),
                'email' => trim($keyed['email'] ?? ''),
                'password' => isset($keyed['password']) ? trim($keyed['password']) : null,
            ];
        }

        return [
            'name' => trim($data[0] ?? ''),
            'email' => trim($data[1] ?? ''),
            'password' => isset($data[2]) ? trim($data[2]) : null,
        ];
    }

    /**
     * Bulk delete users by IDs.
     * Current user is always excluded (cannot delete yourself).
     */
    public function bulkDestroy(BulkDestroyUsersRequest $request): RedirectResponse
    {
        $ids = $request->validated('ids');
        $currentUserId = $request->user()?->id;
        $hadSelf = in_array($currentUserId, array_map('intval', $ids), true);
        $ids = array_values(array_filter($ids, fn ($id) => (int) $id !== (int) $currentUserId));

        $query = User::whereIn('id', $ids);
        if (! $request->user()->hasRole('super-admin')) {
            $query->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'));
        }
        $deleted = $query->delete();

        $message = $deleted > 0
            ? "{$deleted} user(s) deleted successfully."
            : ($hadSelf ? 'You cannot delete your own account.' : 'No users deleted.');
        if ($deleted > 0 && $hadSelf) {
            $message .= ' Your own account was not included.';
        }

        return redirect()->route('admin.users.index')
            ->with($deleted > 0 ? 'success' : 'warning', $message);
    }

    /**
     * Bulk assign role to users by IDs.
     */
    public function bulkAssignRole(BulkAssignRoleRequest $request): RedirectResponse
    {
        $ids = $request->validated('ids');
        $roleName = $request->validated('role');

        $role = Role::where('name', $roleName)->first();
        $query = User::whereIn('id', $ids);
        if (! $request->user()->hasRole('super-admin')) {
            $query->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super-admin'));
        }
        $users = $query->get();
        foreach ($users as $user) {
            $user->syncRoles([$role->name]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', count($users).' user(s) assigned role "'.$role->name.'".');
    }
}
