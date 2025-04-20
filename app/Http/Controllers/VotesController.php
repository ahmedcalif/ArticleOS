<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class VotesController extends Controller
{
    public function vote(Request $request)
    {
        try {
            $validated = $request->validate([
                'votable_id' => 'required|integer',
                'votable_type' => 'required|string|in:App\\Models\\Post,App\\Models\\Comment',
                'vote_type' => 'required|integer|in:-1,1', // -1 for downvote, 1 for upvote
            ]);
            
            // Get model instance based on type - this verifies the entity exists
            $modelClass = $validated['votable_type'];
            $model = $modelClass::findOrFail($validated['votable_id']);
            
            $vote = Vote::where([
                'user_id' => Auth::id(),
                'votable_id' => $validated['votable_id'],
                'votable_type' => $validated['votable_type'],
            ])->first();
            
            // Handle the vote
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
            
            // Get fresh vote counts
            $votes = Vote::where([
                'votable_id' => $validated['votable_id'],
                'votable_type' => $validated['votable_type'],
            ])->get();
            
            // Count upvotes and downvotes separately
            $upvotes = $votes->where('vote_type', 1)->count();
            $downvotes = $votes->where('vote_type', -1)->count();
            
            // Get the user's current vote after the operation
            $currentUserVote = Vote::where([
                'user_id' => Auth::id(),
                'votable_id' => $validated['votable_id'],
                'votable_type' => $validated['votable_type'],
            ])->first();
            
            return response()->json([
                'message' => $message,
                'upvotes' => $upvotes,
                'downvotes' => $downvotes,
                'user_vote' => $currentUserVote ? $currentUserVote->vote_type : 0
            ]);
        } catch (\Exception $e) {
            Log::error('Vote error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function show(Request $request)
    {
        try {
            $validated = $request->validate([
                'votable_id' => 'required|integer',
                'votable_type' => 'required|string|in:App\\Models\\Post,App\\Models\\Comment',
            ]);
            
            $votes = Vote::where([
                'votable_id' => $validated['votable_id'],
                'votable_type' => $validated['votable_type'],
            ])->get();
            
            // Get the user's current vote
            $userVote = 0;
            if (Auth::check()) {
                $vote = Vote::where([
                    'user_id' => Auth::id(),
                    'votable_id' => $validated['votable_id'],
                    'votable_type' => $validated['votable_type'],
                ])->first();
                
                $userVote = $vote ? $vote->vote_type : 0;
            }
            
            // Count upvotes and downvotes separately
            $upvotes = $votes->where('vote_type', 1)->count();
            $downvotes = $votes->where('vote_type', -1)->count();
            
            return response()->json([
                'upvotes' => $upvotes,
                'downvotes' => $downvotes,
                'user_vote' => $userVote
            ]);
        } catch (\Exception $e) {
            Log::error('Vote show error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}