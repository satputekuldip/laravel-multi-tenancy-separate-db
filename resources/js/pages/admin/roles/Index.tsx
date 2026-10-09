import { PermissionGuard } from '@/components/permission-guard';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions_count: number;
    users_count: number;
    created_at: string;
}

interface Props {
    roles: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Roles', href: '#' },
];

export default function RolesIndex({ roles }: Props) {
    const { props } = usePage<SharedData>();
    const permissions = props.auth?.permissions ?? [];
    const hasPermission = (permission: string) =>
        permissions.includes(permission);

    function handleDelete(role: Role) {
        if (window.confirm(`Delete role "${role.name}"?`)) {
            router.delete(`/admin/roles/${role.id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <PermissionGuard permission="roles.create">
                        <Button asChild>
                            <Link href="/admin/roles/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Role
                            </Link>
                        </Button>
                    </PermissionGuard>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border">
                                    <th className="px-4 py-2 text-left">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Guard
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Permissions
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Users
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No roles yet. Create one to get
                                            started.
                                        </td>
                                    </tr>
                                ) : (
                                    roles.data.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="border-b border-sidebar-border"
                                        >
                                            <td className="px-4 py-2 font-medium">
                                                {role.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {role.guard_name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {role.permissions_count}
                                            </td>
                                            <td className="px-4 py-2">
                                                {role.users_count}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {hasPermission(
                                                    'roles.update',
                                                ) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/roles/${role.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {hasPermission(
                                                    'roles.delete',
                                                ) &&
                                                    role.name !==
                                                        'super-admin' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role,
                                                                )
                                                            }
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
