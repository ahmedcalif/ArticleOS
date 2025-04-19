<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Community as Community;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'votes'])
                ->withCount('comments')
                ->orderBy('created_at', 'desc')
                ->get();

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'auth' => [
                'logged_in' => Auth::check(),
                'user_id' => Auth::check() ? Auth::id() : null,
                'user' => Auth::check() ? Auth::user() : null
            ]
        ]);
    }
    public function create(Request $request)
    {
        $communities = Community::all();
        return Inertia::render('Posts/Create', [
              'communities' => $communities,
            'selectedCommunityId' => request('community_id'),
            'auth' => [
                'logged_in' => Auth::check(),
                'user_id' => Auth::check() ? Auth::id() : null,
                'user' => Auth::check() ? Auth::user() : null
            ]
        ]);
    }
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'community_id' => 'required|exists:communities,id',
    ]);

    $post = Post::create([
        'title' => $validated['title'],
        'content' => $validated['content'],
        'user_id' => Auth::id(),
        'community_id' => $validated['community_id'],
    ]);

    return redirect()->route('posts.show', $post)
        ->with('success', 'Post created successfully!');
}
 
 public function show($id)
{
    $post = Post::with(['community', 'user', 'votes'])->findOrFail($id);
    
    $isLoggedIn = Auth::check();
    $currentUser = Auth::user();
    
   $comments = Comment::with(['user' => function($query) {
            $query->select('id', 'name', 'username'); // Only get needed fields
        }])
        ->where('post_id', $id)
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($comment) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'post_id' => $comment->post_id,
                'parent_id' => $comment->parent_id,
                'user_id' => $comment->user_id,
                'username' => $comment->user ? $comment->user->username ?? $comment->user->name : 'anonymous',
                'created_at' => $comment->created_at,
                'updated_at' => $comment->updated_at,
            ];
        })
        ->toArray();
    
    return Inertia::render('Posts/Show', [
        'post' => [
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'created_at' => $post->created_at,
            'updated_at' => $post->updated_at,
            'user_id' => $post->user_id,
            'username' => $post->user ? $post->user->name : 'anonymous',
            'community' => $post->community,
            'community_id' => $post->community_id,
            'comments_count' => $post->comments_count,
            'votes' => $post->votes,
            'current_user_id' => $isLoggedIn ? $currentUser->id : null,
            'is_creator' => $isLoggedIn && $currentUser && $currentUser->id === $post->user_id,
            'is_logged_in' => $isLoggedIn
        ],
        'comments' => $comments, 
        'auth' => [
            'logged_in' => $isLoggedIn,
            'user_id' => $isLoggedIn ? $currentUser->id : null,
            'user' => $isLoggedIn ? $currentUser : null
        ]
    ]);
} 
    
    public function edit($id)
    {
        $post = Post::findOrFail($id);
        
        // Check if the current user is the creator of the post
        if (Auth::id() !== $post->user_id) {
            return abort(403, 'Unauthorized action.');
        }
        
        return Inertia::render('Posts/Edit', [
            'post' => $post,
            'auth' => [
                'logged_in' => Auth::check(),
                'user_id' => Auth::check() ? Auth::id() : null,
                'user' => Auth::check() ? Auth::user() : null
            ]
        ]);
    }

    /**
     * Update the specified post in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        
        // Check if the current user is the creator of the post
        if (Auth::id() !== $post->user_id) {
            return abort(403, 'Unauthorized action.');
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'content' => 'nullable|string',
            'url' => 'nullable|url|max:500',
        ]);
        
        $post->update($validated);
        
        return redirect()->route('posts.show', $post->id);
    }

    /**
     * Remove the specified post from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        
        // Check if the current user is the creator of the post
        if (Auth::id() !== $post->user_id) {
            return abort(403, 'Unauthorized action.');
        }
        
        $post->delete();
        
        return redirect()->route('posts.index');
    }
}