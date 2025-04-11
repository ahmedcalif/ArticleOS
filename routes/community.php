<?php

use App\Http\Controllers\CommunityController as CommunityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Single routes
Route::get('/communities', [CommunityController::class, 'index'])->name('communities.index');
Route::get('/communities/create', [CommunityController::class, 'create'])->name('communities.create');
Route::post('/communities', [CommunityController::class, 'store'])->name('communities.store');
Route::get('/communities/{id}', [CommunityController::class, 'show'])->name('communities.show');
Route::get('/communities/{id}/edit', [CommunityController::class, 'edit'])->name('communities.edit');
Route::put('/communities/{id}', [CommunityController::class, 'update'])->name('communities.update');
Route::delete('/communities/{id}', [CommunityController::class, 'destroy'])->name('communities.destroy');

// Community membership routes
Route::post('/communities/{id}/join', [CommunityController::class, 'join'])->name('communities.join');
Route::delete('/communities/{id}/leave', [CommunityController::class, 'leave'])->name('communities.leave');

// Moderator management routes
Route::post('/communities/{id}/moderators', [CommunityController::class, 'addModerator'])->name('communities.moderators.add');
Route::delete('/communities/{id}/moderators', [CommunityController::class, 'removeModerator'])->name('communities.moderators.remove');