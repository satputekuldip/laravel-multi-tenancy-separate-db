import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ecommerce', href: '/ecommerce' },
    { title: 'Dashboard', href: '/ecommerce' },
];

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClassName?: string;
}

function StatCard({
    title,
    value,
    change,
    subtitle,
    icon: Icon,
    iconClassName,
}: StatCardProps) {
    const positive = change != null && change >= 0;
    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-2xl font-bold tabular-nums">
                            {value}
                        </p>
                        {change != null && (
                            <div className="flex items-center gap-1 text-xs">
                                {positive ? (
                                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <ArrowDownRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                )}
                                <span
                                    className={
                                        positive
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-rose-600 dark:text-rose-400'
                                    }
                                >
                                    {positive ? '+' : ''}
                                    {change}%
                                </span>
                                <span className="text-muted-foreground">
                                    {subtitle ?? 'vs last period'}
                                </span>
                            </div>
                        )}
                    </div>
                    <div
                        className={`rounded-xl p-3 ${iconClassName ?? 'bg-primary/10 text-primary'}`}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface RevenuePoint {
    month: string;
    revenue: number;
    orders: number;
}

interface OrderRow {
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
}

interface ProductRow {
    name: string;
    sales: number;
    revenue: number;
}

interface Props {
    stats: {
        totalRevenue: number;
        revenueChange: number;
        orders: number;
        ordersChange: number;
        customers: number;
        customersChange: number;
        conversionRate: number;
        conversionChange: number;
    };
    revenueChart: RevenuePoint[];
    recentOrders: OrderRow[];
    topProducts: ProductRow[];
}

const statusVariants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    delivered: 'default',
    shipped: 'secondary',
    processing: 'outline',
    pending: 'outline',
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
}

export default function EcommerceDashboard({
    stats,
    revenueChart,
    recentOrders,
    topProducts,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ecommerce Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Ecommerce Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of your store performance and recent activity.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalRevenue)}
                        change={stats.revenueChange}
                        subtitle="vs last month"
                        icon={DollarSign}
                        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    />
                    <StatCard
                        title="Orders"
                        value={stats.orders.toLocaleString()}
                        change={stats.ordersChange}
                        icon={ShoppingCart}
                        iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    />
                    <StatCard
                        title="Customers"
                        value={stats.customers.toLocaleString()}
                        change={stats.customersChange}
                        icon={Users}
                        iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    />
                    <StatCard
                        title="Conversion Rate"
                        value={`${stats.conversionRate}%`}
                        change={stats.conversionChange}
                        icon={TrendingUp}
                        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue overview</CardTitle>
                        <CardDescription>
                            Monthly revenue and order count for the last 6
                            months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueChart}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="revenueGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                        tickFormatter={(v) => `$${v}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card)',
                                        }}
                                        formatter={(value) => [
                                            value != null
                                                ? formatCurrency(Number(value))
                                                : '—',
                                            'Revenue',
                                        ]}
                                        labelFormatter={(label) =>
                                            `Month: ${label}`
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2}
                                        fill="url(#revenueGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent orders</CardTitle>
                            <CardDescription>
                                Latest orders from your store.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No orders yet.
                                    </p>
                                ) : (
                                    recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 py-3 last:border-0 last:pb-0"
                                        >
                                            <div className="min-w-0 space-y-0.5">
                                                <p className="leading-tight font-medium">
                                                    {order.id}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.customer}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold tabular-nums">
                                                    {formatCurrency(
                                                        order.amount,
                                                    )}
                                                </span>
                                                <Badge
                                                    variant={
                                                        statusVariants[
                                                            order.status
                                                        ] ?? 'secondary'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top products</CardTitle>
                            <CardDescription>
                                Best selling products by revenue.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No product data yet.
                                    </p>
                                ) : (
                                    topProducts.map((product, index) => (
                                        <div
                                            key={product.name}
                                            className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-medium text-muted-foreground">
                                                    {index + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate leading-tight font-medium">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.sales} sales
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="shrink-0 font-semibold text-primary tabular-nums">
                                                {formatCurrency(
                                                    product.revenue,
                                                )}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Orders by month</CardTitle>
                        <CardDescription>Order volume trend.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={revenueChart}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 12 }}
                                        className="text-muted-foreground"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card)',
                                        }}
                                        formatter={(value) => [
                                            value ?? '—',
                                            'Orders',
                                        ]}
                                        labelFormatter={(label) =>
                                            `Month: ${label}`
                                        }
                                    />
                                    <Bar
                                        dataKey="orders"
                                        fill="var(--chart-2)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
