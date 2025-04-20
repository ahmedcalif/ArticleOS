<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CommentsController extends Controller
{
    public function index()
    {
        $comments = Comment::with('user')->get();
        
        return Inertia::render('Comments/Index', [
            'comments' => $comments
        ]);
    }
    public function store(Request $request)
    {
        Log::info('Comment store request:', [
            'auth_check' => Auth::check(),
            'user_id' => Auth::id(),    
            'request_data' => $request->all()
        ]);

        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Authentication required',
                    'message' => 'You must be logged in to comment.'
                ], 401);
            }
            
            return redirect()->back()->with('error', 'You must be logged in to comment.');
        }
        
        $validated = $request->validate([
            'content' => 'required|string|max:10000',
            'post_id' => 'required|exists:posts,id',
            'parent_id' => 'nullable|exists:comments,id', 
        ]);
        
        $comment = Comment::create([
            'content' => $validated['content'],
            'post_id' => $validated['post_id'],
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null, 
        ]);
        
        $comment->username = Auth::user()->name;
        
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $comment
            ]);
        }
        
        return redirect()->back()->with('success', 'Comment added successfully');
    }

    public function edit($id)
    {
        $comment = Comment::findOrFail($id);
        
        if (Auth::id() !== $comment->user_id) { 
            return abort(403, 'Unauthorized action.'); 
        }
        
        return Inertia::render('Comments/Edit', [
            'comment' => $comment
        ]);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
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

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        
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