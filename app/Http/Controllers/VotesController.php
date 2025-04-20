<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote as Vote;
use Illuminate\Support\Facades\Auth;

class VotesController extends Controller
{

public function vote(Request $request)
{
    $validated = $request->validate([
        'votable_id' => 'required|integer',
        'votable_type' => 'required|string|in:App\\Models\\Post,App\\Models\\Comment',
        'vote_type' => 'required|integer|in:-1,1', // -1 for downvote, 1 for upvote
    ]);
    
    $vote = Vote::where([
        'user_id' => Auth::id(),
        'votable_id' => $validated['votable_id'],
        'votable_type' => $validated['votable_type'],
    ])->first();
    
    if ($vote) {
        if ($vote->vote_type == $validated['vote_type']) {
            $vote->delete();
            $message = 'Vote removed';
        } else {
            $vote->update(['vote_type' => $validated['vote_type']]);
            $message = 'Vote updated';
        }
    } else {
        Vote::create([
            'user_id' => Auth::id(), 
            'votable_id' => $validated['votable_id'],
            'votable_type' => $validated['votable_type'],
            'vote_type' => $validated['vote_type'],
        ]);
        $message = 'Vote added';
    }
    
    return redirect()->back()->with('success', $message);
}

public function show(Request $request)
{
    $validated = $request->validate([
        'votable_id' => 'required|integer',
        'votable_type' => 'required|string|in:App\\Models\\Post,App\\Models\\Comment',
    ]);
    
    $votes = Vote::where([
        'votable_id' => $validated['votable_id'],
        'votable_type' => $validated['votable_type'],
    ])->get();
    
    $score = $votes->sum('vote_type'); 
    
    return response()->json([
        'votes' => $votes,
        'score' => $score,
        'upvotes' => $votes->where('vote_type', 1)->count(),
        'downvotes' => $votes->where('vote_type', -1)->count(),
    ]);
}

public function destroy($id)
{
    $vote = Vote::findOrFail($id);
    
    if (Auth::id()!== $vote->user_id) {
        return abort(403);
    }
    
    $vote->delete();
    
    return redirect()->back()->with('success', 'Vote removed');
}
}
