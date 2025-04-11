<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CommentsController extends Controller
{
    // CommentController.php

// Index - Get all comments
public function index()
{
    $comments = Comment::with('user')->get();
    
    return Inertia::render('Comments/Index', [
        'comments' => $comments
    ]);
}

// Store - Create a new comment
public function store(Request $request)
{
    $validated = $request->validate([
        'content' => 'required|string',
        'post_id' => 'required|exists:posts,id',
        // Add other validations as needed
    ]);
    
    $comment = Comment::create([
        'content' => $validated['content'],
        'post_id' => $validated['post_id'],
        'user_id' => auth()->id(), // Assuming you're using authentication
    ]);
    
    return redirect()->back()->with('success', 'Comment added successfully');
}

// Edit - Show edit form
public function edit($id)
{
    $comment = Comment::findOrFail($id);
    
    // Optional: Check if the user is authorized to edit this comment
    // if (auth()->id() !== $comment->user_id) { return abort(403); }
    
    return Inertia::render('Comments/Edit', [
        'comment' => $comment
    ]);
}

// Update - Process the update
public function update(Request $request, $id)
{
    $comment = Comment::findOrFail($id);
    
    // Optional: Check if the user is authorized to update this comment
    // if (auth()->id() !== $comment->user_id) { return abort(403); }
    
    $validated = $request->validate([
        'content' => 'required|string',
    ]);
    
    $comment->update($validated);
    
    return redirect()->back()->with('success', 'Comment updated successfully');
}

// Delete a comment
public function destroy($id)
{
    $comment = Comment::findOrFail($id);
    
    // Optional: Check if the user is authorized to delete this comment
    // if (auth()->id() !== $comment->user_id) { return abort(403); }
    
    $comment->delete();
    
    return redirect()->back()->with('success', 'Comment deleted successfully');
}
}
