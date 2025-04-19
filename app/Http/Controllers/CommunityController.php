<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Community as Community;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class CommunityController extends Controller
{

    /**
     * Display a listing of communities
     */
    public function index()
    {
        $communities = Community::withCount('posts', 'members')->get();
        
        return Inertia::render('Communities/Index', [
            'communities' => $communities
        ]);
    }

    /**
     * Show the form for creating a new community
     */
    public function create()
    {
        return Inertia::render('Communities/Create');
    }

    /**
     * Store a newly created community
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:communities,name',
            'description' => 'nullable|string|max:500',
            'rules' => 'nullable|string|max:1000',
            'is_private' => 'boolean',
        ]);
        
      $community = Community::create([
    ...$validated,
    'creator_id' => Auth::id() 
]); 
        
        $community->members()->attach(Auth::id(), ['is_moderator' => true]);
 return redirect()->route('communities.show', $community)
    ->with('success', 'Community was created successfully');       
}

    /**
     * Display the specified community
     */
    public function show($id)
    {
        $community = Community::with(['posts' => function($query) {
            $query->with('user', 'votes')
                  ->withCount('comments')
                  ->orderBy('created_at', 'desc');
        }, 'moderators'])->findOrFail($id);

       $community->is_member = $community->members()->where('user_id', Auth::id())->exists(); 
        
        if ($community->is_private && !$community->members()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.index')
                ->with('error', 'This community is private');
        }
        
    return Inertia::render('Communities/Show', [
    'community' => $community,
    'isMember' => $community->members()->where('user_id', Auth::id())->exists(),
    'isModerator' => $community->moderators()->where('user_id', Auth::id())->exists(),
]); 
    }

    /**
     * Show the form for editing the community
     */
    public function edit($id)
    {
        $community = Community::findOrFail($id);
        
        // Check if user is a moderator
        if (!$community->moderators()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'You do not have permission to edit this community');
        }
        
        return Inertia::render('Communities/Edit', [
            'community' => $community
        ]);
    }

    /**
     * Update the community
     */
    public function update(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        
        // Check if user is a moderator
        if (!$community->moderators()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'You do not have permission to update this community');
        }
        
        $validated = $request->validate([
            'description' => 'nullable|string|max:500',
            'rules' => 'nullable|string|max:1000',
            'is_private' => 'boolean',
        ]);
        
        $community->update($validated);
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'Community updated successfully');
    }

    /**
     * Remove the community
     */
    public function destroy($id)
    {
        $community = Community::findOrFail($id);
        
        // Check if user is the owner
        if ($community->user_id !== Auth::id()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'Only the community owner can delete a community');
        }
        
        $community->delete();
        
        return redirect()->route('communities.index')
            ->with('success', 'Community deleted successfully');
    }
    
    /**
     * Join a community
     */
    public function join($id)
    {
        $community = Community::findOrFail($id);
        
        // If already a member
        if ($community->members()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('info', 'You are already a member of this community');
        }
        
        $community->members()->attach(Auth::id());
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'You have joined this community');
    }
    
    /**
     * Leave a community
     */
    public function leave($id)
    {
        $community = Community::findOrFail($id);
        
        // If not a member
        if (!$community->members()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('info', 'You are not a member of this community');
        }
        
        $community->members()->detach(Auth::id());
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'You have left this community');
    }
    
    /**
     * Add a moderator to the community
     */
    public function addModerator(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        
        // Check if user is the owner or a moderator
        if ($community->user_id !== Auth::id() && 
            !$community->moderators()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'You do not have permission to add moderators');
        }
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
        // Check if user is already a member
        if (!$community->members()->where('user_id', $validated['user_id'])->exists()) {
            // Add as member first
            $community->members()->attach($validated['user_id']);
        }
        
        // Update to moderator
        $community->members()->updateExistingPivot($validated['user_id'], [
            'is_moderator' => true
        ]);
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'Moderator added successfully');
    }
    
    /**
     * Remove a moderator from the community
     */
    public function removeModerator(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        
        // Check if user is the owner
        if ($community->user_id !== Auth::id()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'Only the community owner can remove moderators');
        }
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
        // Cannot remove the owner as moderator
        if ($validated['user_id'] == $community->user_id) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'Cannot remove the community owner as moderator');
        }
        
        // Update to regular member
        $community->members()->updateExistingPivot($validated['user_id'], [
            'is_moderator' => false
        ]);
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'Moderator removed successfully');
    }
}

