<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with summary widgets (user count, recent activity).
     */
    public function index(Request $request): Response
    {
        $userCount = User::query()->count();

        $recentActivity = Activity::query()
            ->with('causer')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'event' => $activity->event,
                    'causer_name' => $activity->causer?->name ?? 'System',
                    'created_at' => $activity->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('dashboard', [
            'userCount' => $userCount,
            'recentActivity' => $recentActivity,
        ]);
    }
}
