<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;

Route::get('/posts', [PostController::class, 'all'])->name('posts.index');

Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');

Route::post('/posts', [PostController::class, 'create'])->name('posts.create');

Route::get('/posts/{id}', [PostController::class, 'find'])->name('posts.find');

Route::get('/posts/{id}/edit', [PostController::class, 'update'])->name('posts.update');

Route::put('/posts/{id}', [PostController::class, 'update'])->name('posts.update');

Route::delete('/posts/{id}', [PostController::class, 'destroy'])->name('posts.destroy');

// only for users that are logged in
Route::middleware(['auth'])->group(function () {
    Route::resource('posts', PostController::class);
});