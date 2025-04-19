<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;

Route::middleware(['auth'])->group(function () {
    Route::resource('posts', PostController::class)->except(['index']); // or keep index if needed
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
});