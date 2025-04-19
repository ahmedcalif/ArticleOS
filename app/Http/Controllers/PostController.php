<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     *
     * @return \Inertia\Response
     */
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

    /**
     * Show the form for creating a new post.
     *
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        return Inertia::render('Posts/Create', [
            'community_id' => $request->input('community_id'),
            'auth' => [
                'logged_in' => Auth::check(),
                'user_id' => Auth::check() ? Auth::id() : null,
                'user' => Auth::check() ? Auth::user() : null
            ]
        ]);
    }

    /**
     * Store a newly created post in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'content' => 'nullable|string',
            'url' => 'nullable|url|max:500',
            'community_id' => 'required|exists:communities,id',
        ]);

        $post = Post::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'url' => $validated['url'] ?? null,
            'user_id' => Auth::id(),
            'community_id' => $validated['community_id'],
        ]);

        return redirect()->route('posts.show', $post->id);
    }

    /**
     * Display the specified post.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $post = Post::with(['community', 'user', 'comments.user', 'votes'])->findOrFail($id);
        
         $isLoggedIn = Auth::check();
    $currentUser = Auth::user();
        
        // Format the comments
        $comments = $post->comments->map(function ($comment) use ($currentUser, $isLoggedIn) {
            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'post_id' => $comment->post_id,
                'user_id' => $comment->user_id,
                'username' => $comment->user ? $comment->user->name : 'anonymous',
                'created_at' => $comment->created_at,
                'updated_at' => $comment->updated_at,
                'can_edit' => $isLoggedIn && $currentUser === $comment->user_id
            ];
        });
        
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
                'comments_count' => $comments->count(),
                'votes' => $post->votes,
                // Embed auth info directly in the post object
                'current_user_id' => $currentUser,
                'is_creator' => $isLoggedIn && $currentUser === $post->user_id,
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



    /**
     * Show the form for editing the specified post.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
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