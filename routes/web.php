<?php
use App\Http\Controllers\CommunityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\VotesController;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// This route are to debug don't worry about this 
Route::get('/check-auth', function () {
    return [
        'logged_in' => Auth::check(),
        'user_id' => Auth::id(),
        'user' => Auth::user(),
    ];
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {   
        $communities = App\Models\Community::all()->keyBy('id');
        
        $posts = Post::with(['user', 'votes'])
            ->withCount('comments')
            ->orderBy('created_at', 'desc')
            ->get();
            
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
    
    Route::resource('posts', PostController::class);
    Route::resource('communities', CommunityController::class);
    

    Route::post('/comments', [CommentsController::class, 'store']);
    Route::patch('/comments/{id}', [CommentsController::class, 'update']);
    Route::delete('/comments/{id}', [CommentsController::class, 'destroy']);
    Route::get('/comments', [CommentsController::class, 'index']);
    Route::get('/comments/{id}/edit', [CommentsController::class, 'edit']);

    Route::post('/vote', [VotesController::class, 'vote']);
    Route::get('/votes', [VotesController::class, 'show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';