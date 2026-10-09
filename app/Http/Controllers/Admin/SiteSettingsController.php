<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Services\SettingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function __construct(
        private readonly SettingService $settings
    ) {}

    /**
     * Display the site settings form (admin or settings module layout).
     */
    public function index(): Response
    {
        $settings = $this->settings->getSiteSettings();
        $view = request()->routeIs('settings.*') ? 'settings/site-settings/Index' : 'admin/site-settings/Index';

        return Inertia::render($view, [
            'settings' => $settings,
        ]);
    }

    /**
     * Update site-scoped settings.
     */
    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        $this->settings->setSiteSettings($request->validated('settings', []));

        $redirectRoute = request()->routeIs('settings.*') ? 'settings.site-settings.index' : 'admin.site-settings.index';

        return redirect()
            ->route($redirectRoute)
            ->with('success', 'Site settings updated.');
    }
}
