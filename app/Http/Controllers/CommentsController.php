<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CommentsController extends Controller
{
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
        // Log the incoming request for debugging
        Log::info('Comment store request:', [
            'auth_check' => Auth::check(),
            'user_id' => Auth::id(),    
            'request_data' => $request->all()
        ]);

        if (!Auth::check()) {
            // Return a clear JSON response for API calls
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Authentication required',
                    'message' => 'You must be logged in to comment.'
                ], 401);
            }
            
            // For regular requests, redirect back with a flash message
            return redirect()->back()->with('error', 'You must be logged in to comment.');
        }
        
        // Validate the request
        $validated = $request->validate([
            'content' => 'required|string|max:10000',
            'post_id' => 'required|exists:posts,id',
            'parent_id' => 'nullable|exists:comments,id', // Added for nested comments
        ]);
        
        // Create the comment with the authenticated user's ID
        $comment = Comment::create([
            'content' => $validated['content'],
            'post_id' => $validated['post_id'],
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null, // Add parent_id if it exists
        ]);
        
        // Add the username for immediate display
        $comment->username = Auth::user()->name;
        
        // Return a response based on what the client expects
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $comment
            ]);
        }
        
        return redirect()->back()->with('success', 'Comment added successfully');
    }

    // Edit - Show edit form
    public function edit($id)
    {
        $comment = Comment::findOrFail($id);
        
        // Check if the user is authorized to edit this comment
        if (Auth::id() !== $comment->user_id) { 
            return abort(403, 'Unauthorized action.'); 
        }
        
        return Inertia::render('Comments/Edit', [
            'comment' => $comment
        ]);
    }

    // Update - Process the update
    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
        // Explicitly check if the user is authorized to update this comment
        if (Auth::id() !== $comment->user_id) { 
            return abort(403, 'Unauthorized action.'); 
        }
        
        $validated = $request->validate([
            'content' => 'required|string',
        ]);
        
        $comment->update($validated);
        
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Comment updated successfully',
                'comment' => $comment
            ]);
        }
        
        return redirect()->back()->with('success', 'Comment updated successfully');
    }

    // Delete comment
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        
        // Explicitly check if the user is authorized to delete this comment
        if (Auth::id() !== $comment->user_id) { 
            return abort(403, 'Unauthorized action.'); 
        }
        
        $comment->delete();
        
        if (request()->expectsJson()) {
            return response()->json([
                'message' => 'Comment deleted successfully'
            ]);
        }
        
        return redirect()->back()->with('success', 'Comment deleted successfully');
    }
}