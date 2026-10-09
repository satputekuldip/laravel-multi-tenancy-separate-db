<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EcommerceDashboardController extends Controller
{
    /**
     * Display the ecommerce dashboard with dummy stats, chart data, and lists.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('ecommerce/dashboard', [
            'stats' => [
                'totalRevenue' => 45231.89,
                'revenueChange' => 12.5,
                'orders' => 1247,
                'ordersChange' => 8.2,
                'customers' => 3420,
                'customersChange' => -2.4,
                'conversionRate' => 3.24,
                'conversionChange' => 0.8,
            ],
            'revenueChart' => [
                ['month' => 'Jan', 'revenue' => 4200, 'orders' => 98],
                ['month' => 'Feb', 'revenue' => 3800, 'orders' => 87],
                ['month' => 'Mar', 'revenue' => 5100, 'orders' => 112],
                ['month' => 'Apr', 'revenue' => 4800, 'orders' => 105],
                ['month' => 'May', 'revenue' => 6200, 'orders' => 134],
                ['month' => 'Jun', 'revenue' => 7500, 'orders' => 156],
            ],
            'recentOrders' => [
                ['id' => 'ORD-2841', 'customer' => 'Sarah Chen', 'amount' => 189.99, 'status' => 'delivered', 'date' => '2025-03-01T14:32:00Z'],
                ['id' => 'ORD-2840', 'customer' => 'Marcus Webb', 'amount' => 425.50, 'status' => 'shipped', 'date' => '2025-03-01T11:20:00Z'],
                ['id' => 'ORD-2839', 'customer' => 'Elena Rodriguez', 'amount' => 94.00, 'status' => 'processing', 'date' => '2025-03-01T09:15:00Z'],
                ['id' => 'ORD-2838', 'customer' => 'James Kim', 'amount' => 312.00, 'status' => 'delivered', 'date' => '2025-02-28T16:45:00Z'],
                ['id' => 'ORD-2837', 'customer' => 'Olivia Park', 'amount' => 67.50, 'status' => 'pending', 'date' => '2025-02-28T13:22:00Z'],
            ],
            'topProducts' => [
                ['name' => 'Wireless Earbuds Pro', 'sales' => 342, 'revenue' => 25650],
                ['name' => 'Leather Messenger Bag', 'sales' => 198, 'revenue' => 29700],
                ['name' => 'Smart Watch Series 5', 'sales' => 156, 'revenue' => 46800],
                ['name' => 'Organic Skincare Set', 'sales' => 234, 'revenue' => 14040],
                ['name' => 'Desk Lamp LED', 'sales' => 187, 'revenue' => 11220],
            ],
        ]);
    }
}
