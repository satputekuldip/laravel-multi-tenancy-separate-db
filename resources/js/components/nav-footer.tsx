import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const page = usePage<SharedData>();
    const navCounts = page.props.navCounts ?? {};
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const url = resolveUrl(item.href);
                        const internal =
                            typeof item.href === 'string' &&
                            item.href.startsWith('/');
                        const count =
                            item.countKey != null
                                ? (navCounts[item.countKey] ?? 0)
                                : undefined;
                        const linkClassName = 'flex w-full items-center gap-2';
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
                                >
                                    {internal ? (
                                        <Link
                                            href={item.href as string}
                                            prefetch
                                            className={linkClassName}
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-5 w-5 shrink-0"
                                                />
                                            )}
                                            <span className="min-w-0 truncate">
                                                {item.title}
                                            </span>
                                            {count != null && count > 0 && (
                                                <Badge
                                                    variant="destructive"
                                                    className="ml-auto shrink-0 tabular-nums"
                                                >
                                                    {count > 99 ? '99+' : count}
                                                </Badge>
                                            )}
                                        </Link>
                                    ) : (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={linkClassName}
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-5 w-5 shrink-0"
                                                />
                                            )}
                                            <span className="min-w-0 truncate">
                                                {item.title}
                                            </span>
                                            {count != null && count > 0 && (
                                                <Badge
                                                    variant="destructive"
                                                    className="ml-auto shrink-0 tabular-nums"
                                                >
                                                    {count > 99 ? '99+' : count}
                                                </Badge>
                                            )}
                                        </a>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
