import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PermissionGuardProps {
    permission?: string;
    permissions?: string[];
    requireAll?: boolean;
    role?: string;
    roles?: string[];
    fallback?: ReactNode;
    children: ReactNode;
}

export function PermissionGuard({
    permission,
    permissions,
    requireAll = false,
    role,
    roles,
    fallback = null,
    children,
}: PermissionGuardProps) {
    const { props } = usePage<SharedData>();
    const authPermissions = props.auth?.permissions ?? [];
    const authRoles = props.auth?.roles ?? [];

    const hasPermission = (p: string) => authPermissions.includes(p);
    const hasAnyPermission = (list: string[]) =>
        list.some((p) => authPermissions.includes(p));
    const hasAllPermissions = (list: string[]) =>
        list.every((p) => authPermissions.includes(p));
    const hasRole = (r: string) => authRoles.includes(r);
    const hasAnyRole = (list: string[]) =>
        list.some((r) => authRoles.includes(r));

    let hasAccess = true;

    if (permission) {
        hasAccess = hasAccess && hasPermission(permission);
    }

    if (permissions) {
        hasAccess =
            hasAccess &&
            (requireAll
                ? hasAllPermissions(permissions)
                : hasAnyPermission(permissions));
    }

    if (role) {
        hasAccess = hasAccess && hasRole(role);
    }

    if (roles) {
        hasAccess = hasAccess && hasAnyRole(roles);
    }

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
