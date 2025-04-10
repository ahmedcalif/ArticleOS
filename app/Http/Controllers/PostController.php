<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post as Post;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function show() {
    return Inertia::render("posts/index");
    }

   public function all()
{
    $posts = Post::all();
    
    return Inertia::render('Posts/Index', [
        'posts' => $posts
    ]);

} 
public function find($id) {
    $posts = Post::find($id);

    return Inertia::render("Posts/Index", [
        'posts' => $posts
    ]);
}

public function create(Request $request) {
    $posts = new Post();

    $posts->title = $request->title();
    $posts->content = $request->content();
    $posts->save();

    return redirect()->route('posts.index')->with('success', 'Post created successfully');
}

public function update(Request $request, $id) {
    $posts = Post::findOrFail($id);

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'content' => 'required|string',
    ]);

    $posts->update($validated);

    return redirect()->route('posts.index')->with('success', 'Post updated successfully');
   
}

public function delete($id) {
   $posts = Post::delete($id);

   return redirect()->route('posts.index')->with('success', 'Post deleted successfully');

}
}
