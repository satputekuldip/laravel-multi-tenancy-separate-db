import { PermissionGuard } from '@/components/permission-guard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileUp, Plus, Trash2, UserCog } from 'lucide-react';
import { useRef, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles?: Array<{ id: number; name: string }>;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Users',
        href: '#',
    },
];

export default function UsersIndex({ users, roles, filters }: Props) {
    const { props } = usePage<SharedData>();
    const permissions = props.auth?.permissions ?? [];
    const currentUserId = props.auth?.user?.id;
    const hasPermission = (permission: string) =>
        permissions.includes(permission);

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [importOpen, setImportOpen] = useState(false);
    const [importing, setImporting] = useState(false);
    const [assignRoleOpen, setAssignRoleOpen] = useState(false);
    const [assignRoleId, setAssignRoleId] = useState('');
    const [bulkAssigning, setBulkAssigning] = useState(false);
    const importFormRef = useRef<HTMLFormElement>(null);
    const importFileRef = useRef<HTMLInputElement>(null);

    function applyFilters(params: {
        search?: string;
        role?: string;
        page?: number;
    }) {
        const query: Record<string, string> = {};
        if (params.search) query.search = params.search;
        if (params.role) query.role = params.role;
        if (params.page) query.page = String(params.page);
        router.get('/admin/users', query, { preserveState: true });
    }

    function handleDelete(user: User) {
        if (
            window.confirm(
                `Delete user "${user.name}"? They will no longer be able to log in.`,
            )
        ) {
            router.delete(`/admin/users/${user.id}`);
        }
    }

    const pageIds = users.data.map((u) => u.id);
    const allOnPageSelected =
        pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

    function toggleSelectAll() {
        if (allOnPageSelected) {
            setSelectedIds((prev) => {
                const next = new Set(prev);
                pageIds.forEach((id) => next.delete(id));
                return next;
            });
        } else {
            setSelectedIds((prev) => new Set([...prev, ...pageIds]));
        }
    }

    function toggleSelect(id: number) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function handleBulkDelete() {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        if (
            !window.confirm(
                `Delete ${ids.length} selected user(s)? They will no longer be able to log in.`,
            )
        ) {
            return;
        }
        router.post(
            '/admin/users/bulk-destroy',
            { ids },
            { preserveScroll: true },
        );
        setSelectedIds(new Set());
    }

    function handleBulkAssignRole() {
        if (!assignRoleId) return;
        const ids = Array.from(selectedIds);
        router.post(
            '/admin/users/bulk-assign-role',
            { ids, role: assignRoleId },
            {
                preserveScroll: true,
                onBefore: () => setBulkAssigning(true),
                onFinish: () => setBulkAssigning(false),
                onSuccess: () => {
                    setAssignRoleOpen(false);
                    setAssignRoleId('');
                    setSelectedIds(new Set());
                },
            },
        );
    }

    function handleImportSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = importFormRef.current;
        const fileInput = importFileRef.current;
        if (!form || !fileInput?.files?.length) return;
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        setImporting(true);
        router.post('/admin/users/import', formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setImporting(false),
            onSuccess: () => {
                setImportOpen(false);
                form.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <div className="flex items-center gap-2">
                        <PermissionGuard permission="users.create">
                            <Dialog
                                open={importOpen}
                                onOpenChange={setImportOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" type="button">
                                        <FileUp className="mr-2 h-4 w-4" />
                                        Import CSV
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Import users from CSV
                                        </DialogTitle>
                                        <DialogDescription>
                                            Upload a CSV file with columns:
                                            name, email, and optionally
                                            password. The first row may be a
                                            header (name, email, password).
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        ref={importFormRef}
                                        onSubmit={handleImportSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="import-file">
                                                CSV file
                                            </Label>
                                            <Input
                                                id="import-file"
                                                ref={importFileRef}
                                                type="file"
                                                accept=".csv,.txt"
                                                required
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setImportOpen(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={importing}
                                            >
                                                {importing
                                                    ? 'Importing…'
                                                    : 'Import'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button asChild>
                                <Link href="/admin/users/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create user
                                </Link>
                            </Button>
                        </PermissionGuard>
                    </div>
                </div>

                {selectedIds.size > 0 && (
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar p-3">
                        <span className="text-sm text-muted-foreground">
                            {selectedIds.size} selected
                        </span>
                        {hasPermission('users.delete') && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete selected
                            </Button>
                        )}
                        {hasPermission('users.update') && (
                            <Dialog
                                open={assignRoleOpen}
                                onOpenChange={(open) => {
                                    setAssignRoleOpen(open);
                                    if (!open) setAssignRoleId('');
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <UserCog className="mr-2 h-4 w-4" />
                                        Assign role
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Assign role to selected users
                                        </DialogTitle>
                                        <DialogDescription>
                                            Choose a role to assign to{' '}
                                            {selectedIds.size} user(s).
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="bulk-role">
                                                Role
                                            </Label>
                                            <select
                                                id="bulk-role"
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={assignRoleId}
                                                onChange={(e) =>
                                                    setAssignRoleId(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select role…
                                                </option>
                                                {roles.map((r) => (
                                                    <option
                                                        key={r.id}
                                                        value={r.name}
                                                    >
                                                        {r.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setAssignRoleOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleBulkAssignRole}
                                            disabled={
                                                !assignRoleId || bulkAssigning
                                            }
                                        >
                                            {bulkAssigning
                                                ? 'Assigning…'
                                                : 'Assign role'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedIds(new Set())}
                        >
                            Clear selection
                        </Button>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 rounded-lg border border-sidebar-border bg-sidebar p-4">
                    <div className="flex items-center gap-2">
                        <Input
                            type="search"
                            placeholder="Search by name or email..."
                            defaultValue={filters.search}
                            className="max-w-xs"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    applyFilters({
                                        ...filters,
                                        search:
                                            (e.target as HTMLInputElement)
                                                .value || undefined,
                                    });
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                const search = (
                                    document.querySelector(
                                        'input[type="search"]',
                                    ) as HTMLInputElement
                                )?.value;
                                applyFilters({
                                    ...filters,
                                    search: search || undefined,
                                    page: 1,
                                });
                            }}
                        >
                            Search
                        </Button>
                    </div>
                    <select
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={filters.role ?? ''}
                        onChange={(e) =>
                            applyFilters({
                                ...filters,
                                role: e.target.value || undefined,
                                page: 1,
                            })
                        }
                    >
                        <option value="">All roles</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.name}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border">
                                    <th className="w-10 px-4 py-2">
                                        {users.data.length > 0 && (
                                            <Checkbox
                                                checked={allOnPageSelected}
                                                onCheckedChange={
                                                    toggleSelectAll
                                                }
                                                aria-label="Select all on page"
                                            />
                                        )}
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Roles
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Created
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No users found. Try adjusting search
                                            or filters.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-sidebar-border"
                                        >
                                            <td className="w-10 px-4 py-2">
                                                <Checkbox
                                                    checked={selectedIds.has(
                                                        user.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleSelect(user.id)
                                                    }
                                                    aria-label={`Select ${user.name}`}
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.roles &&
                                                user.roles.length > 0 ? (
                                                    <div className="flex gap-2">
                                                        {user.roles.map(
                                                            (role) => (
                                                                <span
                                                                    key={
                                                                        role.id
                                                                    }
                                                                    className="rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        No roles
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-muted-foreground">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {hasPermission(
                                                        'users.update',
                                                    ) && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/users/${user.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {hasPermission(
                                                        'users.delete',
                                                    ) &&
                                                        user.id !==
                                                            currentUserId && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {users.last_page > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {users.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={`/admin/users?page=${users.current_page - 1}${filters.search ? `&search=${encodeURIComponent(filters.search)}` : ''}${filters.role ? `&role=${encodeURIComponent(filters.role)}` : ''}`}
                                    >
                                        Previous
                                    </Link>
                                </Button>
                            )}
                            <span className="flex items-center px-4">
                                Page {users.current_page} of {users.last_page}
                            </span>
                            {users.current_page < users.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={`/admin/users?page=${users.current_page + 1}${filters.search ? `&search=${encodeURIComponent(filters.search)}` : ''}${filters.role ? `&role=${encodeURIComponent(filters.role)}` : ''}`}
                                    >
                                        Next
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
