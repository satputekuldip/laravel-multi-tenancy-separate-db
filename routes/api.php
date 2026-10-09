<?php

use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->prefix('api')->group(function () {
    // Permission API routes
    Route::get('/permissions', [PermissionController::class, 'index'])->name('api.permissions.index');
    Route::get('/permissions/roles', [PermissionController::class, 'roles'])->name('api.permissions.roles');
    Route::get('/permissions/user', [PermissionController::class, 'userPermissions'])->name('api.permissions.user');
    Route::get('/permissions/check', [PermissionController::class, 'check'])->name('api.permissions.check');

    // Language API routes
    Route::get('/languages', [LanguageController::class, 'index'])->name('api.languages.index');
    Route::get('/languages/{languageCode}/translations', [LanguageController::class, 'translations'])->name('api.languages.translations');
    Route::get('/languages/translations/all', [LanguageController::class, 'allTranslations'])->name('api.languages.all-translations');
});
