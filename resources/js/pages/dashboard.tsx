import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface ActivityItem {
    id: number;
    description: string;
    event: string | null;
    causer_name: string;
    created_at: string;
}

interface Props {
    userCount: number;
    recentActivity: ActivityItem[];
}

export default function Dashboard({ userCount, recentActivity }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Link href="/admin/users">
                        <Card className="flex items-center gap-4 p-6 transition-colors hover:bg-muted/50">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {userCount}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total users
                                </p>
                            </div>
                        </Card>
                    </Link>
                    <Link href="/admin/activity-log">
                        <Card className="flex items-center gap-4 p-6 transition-colors hover:bg-muted/50">
                            <div className="rounded-lg bg-primary/10 p-3">
                                <Activity className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {recentActivity.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Recent activity (last 10)
                                </p>
                            </div>
                        </Card>
                    </Link>
                </div>

                <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Recent activity
                    </h2>
                    {recentActivity.length === 0 ? (
                        <p className="text-muted-foreground">
                            No activity yet. Create users and manage roles to
                            see activity here.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {recentActivity.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        <span className="font-medium">
                                            {item.causer_name}
                                        </span>
                                        {' — '}
                                        {item.event || item.description}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="mt-4">
                        <Link
                            href="/admin/activity-log"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            View all activity →
                        </Link>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
