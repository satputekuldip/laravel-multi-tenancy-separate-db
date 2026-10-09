<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('ecommerce', [\App\Http\Controllers\EcommerceDashboardController::class, 'index'])->name('ecommerce.dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('users/import', [\App\Http\Controllers\Admin\UserController::class, 'import'])->name('users.import');
    Route::post('users/bulk-destroy', [\App\Http\Controllers\Admin\UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
    Route::post('users/bulk-assign-role', [\App\Http\Controllers\Admin\UserController::class, 'bulkAssignRole'])->name('users.bulk-assign-role');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);
    Route::get('activity-log', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-log.index');
    Route::get('site-settings', [\App\Http\Controllers\Admin\SiteSettingsController::class, 'index'])->name('site-settings.index');
    Route::put('site-settings', [\App\Http\Controllers\Admin\SiteSettingsController::class, 'update'])->name('site-settings.update');
    Route::get('languages/{language}/translations', [\App\Http\Controllers\Admin\LanguageController::class, 'translations'])->name('languages.translations');
    Route::put('languages/{language}/translations', [\App\Http\Controllers\Admin\LanguageController::class, 'updateTranslations'])->name('languages.translations.update');
    Route::resource('languages', \App\Http\Controllers\Admin\LanguageController::class)->except(['show', 'destroy']);
    Route::get('permissions', function () {
        return \Inertia\Inertia::render('admin/permissions/index');
    })->name('permissions.index');
});

require __DIR__.'/settings.php';
