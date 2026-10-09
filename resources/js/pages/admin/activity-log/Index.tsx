import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Causer {
    id: number;
    name: string;
}

interface Activity {
    id: number;
    description: string;
    event: string | null;
    causer: Causer | null;
    subject_type: string | null;
    subject_id: number | null;
    properties: Record<string, unknown> | null;
    created_at: string;
}

interface Props {
    activities: {
        data: Activity[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    actors: Causer[];
    filters: {
        actor_id?: string;
        action?: string;
        from_date?: string;
        to_date?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Activity Log', href: '#' },
];

function buildQuery(filters: Props['filters'], page?: number) {
    const q: Record<string, string> = {};
    if (filters.actor_id) q.actor_id = filters.actor_id;
    if (filters.action) q.action = filters.action;
    if (filters.from_date) q.from_date = filters.from_date;
    if (filters.to_date) q.to_date = filters.to_date;
    if (page) q.page = String(page);
    return q;
}

export default function ActivityLogIndex({
    activities,
    actors,
    filters,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Activity Log</h1>

                <div className="flex flex-wrap gap-4 rounded-lg border border-sidebar-border bg-sidebar p-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">
                            Actor
                        </label>
                        <select
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.actor_id ?? ''}
                            onChange={(e) => {
                                router.get(
                                    '/admin/activity-log',
                                    buildQuery(
                                        {
                                            ...filters,
                                            actor_id:
                                                e.target.value || undefined,
                                        },
                                        1,
                                    ),
                                );
                            }}
                        >
                            <option value="">All</option>
                            {actors.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">
                            Action
                        </label>
                        <Input
                            type="text"
                            placeholder="Filter by action..."
                            defaultValue={filters.action}
                            className="max-w-xs"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const v = (e.target as HTMLInputElement)
                                        .value;
                                    router.get(
                                        '/admin/activity-log',
                                        buildQuery(
                                            {
                                                ...filters,
                                                action: v || undefined,
                                            },
                                            1,
                                        ),
                                    );
                                }
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">
                            From
                        </label>
                        <Input
                            type="date"
                            defaultValue={filters.from_date}
                            onChange={(e) => {
                                router.get(
                                    '/admin/activity-log',
                                    buildQuery(
                                        {
                                            ...filters,
                                            from_date:
                                                e.target.value || undefined,
                                        },
                                        1,
                                    ),
                                );
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">
                            To
                        </label>
                        <Input
                            type="date"
                            defaultValue={filters.to_date}
                            onChange={(e) => {
                                router.get(
                                    '/admin/activity-log',
                                    buildQuery(
                                        {
                                            ...filters,
                                            to_date:
                                                e.target.value || undefined,
                                        },
                                        1,
                                    ),
                                );
                            }}
                        />
                    </div>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border">
                                    <th className="px-4 py-2 text-left">
                                        Time
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Actor
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Action
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No activity logged yet.
                                        </td>
                                    </tr>
                                ) : (
                                    activities.data.map((activity) => (
                                        <tr
                                            key={activity.id}
                                            className="border-b border-sidebar-border"
                                        >
                                            <td className="px-4 py-2 text-sm text-muted-foreground">
                                                {new Date(
                                                    activity.created_at,
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {activity.causer
                                                    ? activity.causer.name
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-2 font-medium">
                                                {activity.event ||
                                                    activity.description}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-muted-foreground">
                                                {activity.properties &&
                                                Object.keys(activity.properties)
                                                    .length > 0
                                                    ? JSON.stringify(
                                                          activity.properties,
                                                      )
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {activities.last_page > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {activities.current_page > 1 && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={`/admin/activity-log?${new URLSearchParams(buildQuery(filters, activities.current_page - 1)).toString()}`}
                                    >
                                        Previous
                                    </Link>
                                </Button>
                            )}
                            <span className="flex items-center px-4">
                                Page {activities.current_page} of{' '}
                                {activities.last_page}
                            </span>
                            {activities.current_page < activities.last_page && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={`/admin/activity-log?${new URLSearchParams(buildQuery(filters, activities.current_page + 1)).toString()}`}
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
