import { Badge } from '@/components/ui/badge';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items: NavItem[];
    groupLabel?: string;
}

export function NavMain({ items = [], groupLabel = 'Platform' }: NavMainProps) {
    const page = usePage<SharedData>();
    const navCounts = page.props.navCounts ?? {};
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const count =
                        item.countKey != null
                            ? (navCounts[item.countKey] ?? 0)
                            : undefined;
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(
                                    resolveUrl(item.href),
                                )}
                                tooltip={{ children: item.title }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex w-full items-center justify-between gap-2"
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        {item.icon && <item.icon />}
                                        <span className="truncate">
                                            {item.title}
                                        </span>
                                    </span>
                                    {count != null && count > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="shrink-0 tabular-nums"
                                        >
                                            {count > 99 ? '99+' : count}
                                        </Badge>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
