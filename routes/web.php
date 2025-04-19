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
  $communities = App\Models\Community::all()->keyBy('id');
  
  $posts = App\Models\Post::with(['user', 'votes'])
      ->withCount('comments')
      ->orderBy('created_at', 'desc')
      ->get();
      
  // Manually attach community data
  $posts->each(function($post) use ($communities) {
      $post->username = $post->user ? $post->user->name : null;
      
      if ($post->community_id && isset($communities[$post->community_id])) {
          $post->community = [
              'id' => $communities[$post->community_id]->id,
              'name' => $communities[$post->community_id]->name
          ];
      } else {
          $post->community = [
              'id' => $post->community_id ?? 0,
              'name' => $post->community_id ? "Community {$post->community_id}" : 'general'
          ];
      }
  });
      
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
