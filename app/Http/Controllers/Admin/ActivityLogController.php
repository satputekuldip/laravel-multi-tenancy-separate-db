<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of activity log entries with optional filters.
     */
    public function index(Request $request): Response
    {
        $this->authorize('activity-logs.view');

        $query = Activity::with('causer')
            ->orderByDesc('created_at');

        if ($request->filled('actor_id')) {
            $query->where('causer_id', $request->input('actor_id'));
        }

        if ($request->filled('action')) {
            $term = $request->input('action');
            $query->where(function ($q) use ($term) {
                $q->where('description', 'like', "%{$term}%")
                    ->orWhere('event', 'like', "%{$term}%");
            });
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }

        $activities = $query->paginate(20)->withQueryString();

        $activities->getCollection()->transform(function (Activity $activity) {
            return [
                'id' => $activity->id,
                'description' => $activity->description,
                'event' => $activity->event,
                'causer' => $activity->causer ? [
                    'id' => $activity->causer->getKey(),
                    'name' => $activity->causer->name ?? (method_exists($activity->causer, 'name') ? $activity->causer->name : 'System'),
                ] : null,
                'subject_type' => $activity->subject_type,
                'subject_id' => $activity->subject_id,
                'properties' => $activity->properties,
                'created_at' => $activity->created_at->toIso8601String(),
            ];
        });

        $actorIds = Activity::query()
            ->whereNotNull('causer_id')
            ->select('causer_id')
            ->distinct()
            ->pluck('causer_id');

        $actors = \App\Models\User::whereIn('id', $actorIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])
            ->values()
            ->all();

        return Inertia::render('admin/activity-log/Index', [
            'activities' => $activities,
            'actors' => $actors,
            'filters' => [
                'actor_id' => $request->input('actor_id', ''),
                'action' => $request->input('action', ''),
                'from_date' => $request->input('from_date', ''),
                'to_date' => $request->input('to_date', ''),
            ],
        ]);
    }
}
