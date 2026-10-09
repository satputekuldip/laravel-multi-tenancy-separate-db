import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Languages,
    LayoutGrid,
    Shield,
    ShoppingBag,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Ecommerce',
        href: '/ecommerce',
        icon: ShoppingBag,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        permission: 'users.view',
    },
    {
        title: 'Roles',
        href: '/admin/roles',
        icon: Shield,
        permission: 'roles.view',
    },
];

const adminFooterNavItems: NavItem[] = [
    {
        title: 'Languages',
        href: '/admin/languages',
        icon: Languages,
        permission: 'languages.view',
    },
    {
        title: 'Activity Log',
        href: '/admin/activity-log',
        icon: Activity,
        permission: 'activity-logs.view',
    },
];

function filterNavByPermission(
    items: NavItem[],
    permissions: string[],
): NavItem[] {
    return items.filter(
        (item) => !item.permission || permissions.includes(item.permission),
    );
}

export function AppSidebar() {
    const page = usePage<SharedData>();
    const canAccessAdmin = page.props.auth?.canAccessAdmin ?? false;
    const permissions = page.props.auth?.permissions ?? [];
    const filteredAdminNav = filterNavByPermission(adminNavItems, permissions);
    const filteredAdminFooterNav = filterNavByPermission(
        adminFooterNavItems,
        permissions,
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {canAccessAdmin && filteredAdminNav.length > 0 && (
                    <NavMain items={filteredAdminNav} groupLabel="Admin" />
                )}
            </SidebarContent>

            <SidebarFooter>
                {canAccessAdmin && filteredAdminFooterNav.length > 0 && (
                    <NavFooter
                        items={filteredAdminFooterNav}
                        className="border-t border-sidebar-border/50 pt-2"
                    />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
