<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Post as Post;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    // GET /posts
    public function index()
    {
        $posts = Post::all();
        return Inertia::render('Posts/Index', [
            'posts' => $posts
        ]);
    }
    
    // GET /posts/create
    public function create()
    {
        return Inertia::render('Posts/Create');
    }
    
    // POST /posts
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        
        $post = new Post();
        $post->title = $validated['title'];
        $post->content = $validated['content'];
        $post->save();
        
        return redirect()->route('posts.index')->with('success', 'Post created successfully');
    }
    
    // GET /posts/{id}
    public function show($id)
    {
        $post = Post::findOrFail($id);
        return Inertia::render('Posts/Show', [
            'post' => $post
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