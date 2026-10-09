import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

interface Props {
    permissions?: Permission[];
    roles?: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Permissions',
        href: '#',
    },
];

export default function PermissionsIndex({
    permissions: initialPermissions,
    roles: initialRoles,
}: Props) {
    const {
        permissions: userPermissions,
        refreshPermissions,
        loading,
    } = usePermissions();
    const [permissions, setPermissions] = useState<Permission[]>(
        initialPermissions || [],
    );
    const [roles, setRoles] = useState<Role[]>(initialRoles || []);
    const [loadingData, setLoadingData] = useState(false);

    const loadPermissions = async () => {
        setLoadingData(true);
        try {
            const response = await fetch('/api/permissions', {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setPermissions(data.permissions || []);
        } catch (error) {
            console.error('Error loading permissions:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const loadRoles = async () => {
        setLoadingData(true);
        try {
            const response = await fetch('/api/permissions/roles', {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
            });
            const data = await response.json();
            setRoles(data.roles || []);
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleRefresh = async () => {
        await Promise.all([
            loadPermissions(),
            loadRoles(),
            refreshPermissions(),
        ]);
    };

    useEffect(() => {
        if (!initialPermissions || !initialRoles) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleRefresh();
        }
        // Intentionally run only on mount when initial server data is missing.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Permissions & Roles</h1>
                    <Button
                        onClick={handleRefresh}
                        disabled={loadingData || loading}
                        variant="outline"
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${loadingData || loading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            All Permissions
                        </h2>
                        <div className="max-h-[600px] space-y-2 overflow-y-auto">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center justify-between rounded border border-sidebar-border p-2"
                                >
                                    <span className="font-mono text-sm">
                                        {permission.name}
                                    </span>
                                    {userPermissions.includes(
                                        permission.name,
                                    ) && (
                                        <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-600 dark:text-green-400">
                                            You have this
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Roles & Their Permissions
                        </h2>
                        <div className="max-h-[600px] space-y-4 overflow-y-auto">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="rounded border border-sidebar-border p-4"
                                >
                                    <h3 className="mb-2 font-semibold">
                                        {role.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.length > 0 ? (
                                            role.permissions.map(
                                                (permission) => (
                                                    <span
                                                        key={permission}
                                                        className="rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                                                    >
                                                        {permission}
                                                    </span>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No permissions
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Your Permissions
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {userPermissions.length > 0 ? (
                            userPermissions.map((permission) => (
                                <span
                                    key={permission}
                                    className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-600 dark:text-green-400"
                                >
                                    {permission}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                No permissions
                            </span>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
