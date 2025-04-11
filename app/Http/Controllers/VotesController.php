<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VotesController extends Controller
{
    // VoteController.php

// Store/Update - Upvote or downvote (toggle or create)
public function vote(Request $request)
{
    $validated = $request->validate([
        'votable_id' => 'required|integer',
        'votable_type' => 'required|string|in:App\\Models\\Post,App\\Models\\Comment',
        'vote_type' => 'required|integer|in:-1,1', // -1 for downvote, 1 for upvote
    ]);
    
    // Find existing vote
    $vote = Vote::where([
        'user_id' => auth()->id(),
        'votable_id' => $validated['votable_id'],
        'votable_type' => $validated['votable_type'],
    ])->first();
    
    if ($vote) {
        // If vote exists with the same type, remove it (toggle off)
        if ($vote->vote_type == $validated['vote_type']) {
            $vote->delete();
            $message = 'Vote removed';
        } else {
            // If vote exists with different type, update it
            $vote->update(['vote_type' => $validated['vote_type']]);
            $message = 'Vote updated';
        }
    } else {
        // Create new vote
        Vote::create([
            'user_id' => auth()->id(),
            'votable_id' => $validated['votable_id'],
            'votable_type' => $validated['votable_type'],
            'vote_type' => $validated['vote_type'],
        ]);
        $message = 'Vote added';
    }
    
    return redirect()->back()->with('success', $message);
}

// Show votes for a specific item (Post or Comment)
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
    
    $score = $votes->sum('vote_type'); // Sum will give net score
    
    return response()->json([
        'votes' => $votes,
        'score' => $score,
        'upvotes' => $votes->where('vote_type', 1)->count(),
        'downvotes' => $votes->where('vote_type', -1)->count(),
    ]);
}

// Delete a vote
public function destroy($id)
{
    $vote = Vote::findOrFail($id);
    
    // Check if user owns this vote
    if (auth()->id() !== $vote->user_id) {
        return abort(403);
    }
    
    $vote->delete();
    
    return redirect()->back()->with('success', 'Vote removed');
}
}
