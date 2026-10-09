import { useEffect, useState } from 'react';

interface PermissionData {
    permissions: string[];
    roles: string[];
    direct_permissions: string[];
}

const PERMISSION_CACHE_KEY = 'app_permissions';
const PERMISSION_CACHE_TIMESTAMP_KEY = 'app_permissions_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let permissionCache: PermissionData | null = null;
let isLoading = false;
let loadPromise: Promise<PermissionData> | null = null;

async function fetchPermissions(): Promise<PermissionData> {
    const response = await fetch('/api/permissions/user', {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch permissions');
    }

    const data = await response.json();
    return {
        permissions: data.permissions || [],
        roles: data.roles || [],
        direct_permissions: data.direct_permissions || [],
    };
}

function getCachedPermissions(): PermissionData | null {
    try {
        const cached = localStorage.getItem(PERMISSION_CACHE_KEY);
        const timestamp = localStorage.getItem(PERMISSION_CACHE_TIMESTAMP_KEY);

        if (cached && timestamp) {
            const age = Date.now() - parseInt(timestamp, 10);
            if (age < CACHE_DURATION) {
                return JSON.parse(cached);
            }
        }
    } catch (error) {
        console.error('Error reading permission cache:', error);
    }

    return null;
}

function setCachedPermissions(data: PermissionData): void {
    try {
        localStorage.setItem(PERMISSION_CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(
            PERMISSION_CACHE_TIMESTAMP_KEY,
            Date.now().toString(),
        );
    } catch (error) {
        console.error('Error setting permission cache:', error);
    }
}

function clearPermissionCache(): void {
    try {
        localStorage.removeItem(PERMISSION_CACHE_KEY);
        localStorage.removeItem(PERMISSION_CACHE_TIMESTAMP_KEY);
    } catch (error) {
        console.error('Error clearing permission cache:', error);
    }
}

async function loadPermissions(forceRefresh = false): Promise<PermissionData> {
    if (!forceRefresh && permissionCache) {
        return permissionCache;
    }

    const cached = getCachedPermissions();
    if (!forceRefresh && cached) {
        permissionCache = cached;
        return cached;
    }

    if (isLoading && loadPromise) {
        return loadPromise;
    }

    isLoading = true;
    loadPromise = fetchPermissions()
        .then((data) => {
            permissionCache = data;
            setCachedPermissions(data);
            return data;
        })
        .finally(() => {
            isLoading = false;
            loadPromise = null;
        });

    return loadPromise;
}

export function usePermissions() {
    const [permissions, setPermissions] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [directPermissions, setDirectPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPermissions()
            .then((data) => {
                setPermissions(data.permissions);
                setRoles(data.roles);
                setDirectPermissions(data.direct_permissions);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const hasAnyPermission = (permissionList: string[]): boolean => {
        return permissionList.some((permission) =>
            permissions.includes(permission),
        );
    };

    const hasAllPermissions = (permissionList: string[]): boolean => {
        return permissionList.every((permission) =>
            permissions.includes(permission),
        );
    };

    const hasRole = (role: string): boolean => {
        return roles.includes(role);
    };

    const hasAnyRole = (roleList: string[]): boolean => {
        return roleList.some((role) => roles.includes(role));
    };

    const refreshPermissions = async (): Promise<void> => {
        clearPermissionCache();
        permissionCache = null;
        setLoading(true);
        try {
            const data = await loadPermissions(true);
            setPermissions(data.permissions);
            setRoles(data.roles);
            setDirectPermissions(data.direct_permissions);
        } catch (error) {
            console.error('Error refreshing permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        permissions,
        roles,
        directPermissions,
        loading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        refreshPermissions,
    };
}

// Export utility functions for use outside of React components
export { clearPermissionCache, loadPermissions };
