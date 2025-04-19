<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Post as Post;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    // GET /posts
    public function index()
    {
      $posts = Post::with(['community', 'user', 'votes'])
                    ->withCount('comments')
                    ->orderBy('created_at', 'desc')
                    ->get();
                    
        return Inertia::render('Posts/Index', [
            'posts' => $posts
        ]); 
    }
    
   // GET /posts/create
public function create(Request $request)
{
    $communities = \App\Models\Community::all(['id', 'name']);
    $selectedCommunityId = $request->input('community_id');
    
    return Inertia::render('Posts/Create', [
        'communities' => $communities,
        'selectedCommunityId' => $selectedCommunityId
    ]);
}
    // POST /posts
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'community_id' => 'nullable|exists:communities,id',
    ]);
    
    $post = new Post();
    $post->title = $validated['title'];
    $post->content = $validated['content'];
    
   $post->user_id = Auth::id();
    
    if (isset($validated['community_id'])) {
        $post->community_id = $validated['community_id'];
    }
    
    $post->save();
    
    return redirect()->route('posts.index')->with('success', 'Post created successfully');
}
    
    // GET /posts/{id}
 public function show($id)
{
    $post = Post::with(['community', 'user', 'votes', 'comments.user'])
              ->findOrFail($id);
    
    $post->username = $post->user ? $post->user->name : 'anonymous';
    
    $comments = $post->comments->map(function($comment) {
        $comment->username = $comment->user ? $comment->user->name : 'anonymous';
        return $comment;
    });
    
    return Inertia::render('Posts/Show', [
        'post' => $post,
        'comments' => $comments
    ]);
} 
    // GET /posts/{id}/edit
    public function edit($id)
    {
        $post = Post::findOrFail($id);
        return Inertia::render('Posts/Edit', [
            'post' => $post
        ]);
    }
    
    // PUT/PATCH /posts/{id}
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255', 
            'content' => 'required|string',
        ]);
        
        $post->update($validated);
        return redirect()->route('posts.index')->with('success', 'Post updated successfully');
    }
    
    // DELETE /posts/{id}
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post deleted successfully');
    }
}