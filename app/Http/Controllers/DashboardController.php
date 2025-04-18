<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user'])
            ->withCount('comments')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Transform posts to include username directly
        $posts->each(function($post) {
            $post->username = $post->user ? $post->user->name : null;
        });
        
        return Inertia::render('Dashboard', [
            'posts' => $posts
        ]);
    }
}