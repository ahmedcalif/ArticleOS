<?php

use App\Http\Controllers\CommunityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController as PostController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
  Route::get('dashboard', function () {
    $posts = App\Models\Post::with(['user'])
        ->withCount('comments')
        ->orderBy('created_at', 'desc')
        ->get();
        
    return Inertia::render('dashboard', [
        'posts' => $posts
    ]);
})->name('dashboard'); 
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


 Route::middleware(['auth'])->group(function () {
    Route::resource('posts', PostController::class);
});


Route::middleware(['auth'])->group(function () {
    Route::resource('communities', CommunityController::class);
});
