<?php
namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\Community;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
  public function index()
{
    // Step 1: Get all communities to ensure they're available
    $communities = Community::all()->keyBy('id');
    
    // Step 2: Get all posts with basic relationships
    $posts = Post::with(['user', 'votes'])
        ->withCount('comments')
        ->orderBy('created_at', 'desc')
        ->get();
    
    // Step 3: Process posts to ensure they have proper username and community data
    $posts->each(function($post) use ($communities) {
        // Add username for easier access in frontend
        $post->username = $post->user ? $post->user->name : null;
        
        // Manually attach community data
        if ($post->community_id) {
            if (isset($communities[$post->community_id])) {
                // Create a simple object with just what the frontend needs
                $post->community = [
                    'id' => $communities[$post->community_id]->id,
                    'name' => $communities[$post->community_id]->name
                ];
            } else {
                // Fallback
                $post->community = [
                    'id' => $post->community_id,
                    'name' => "Community {$post->community_id}"
                ];
            }
        } else {
            // Default
            $post->community = [
                'id' => 0,
                'name' => 'general'
            ];
        }
    });
    
    return Inertia::render('Dashboard', [
        'posts' => $posts
    ]);
}
}