<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Community as Community;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class CommunityController extends Controller
{

    
    public function index()
    {
        $communities = Community::withCount('posts', 'members')->get();
        
        return Inertia::render('Communities/Index', [
            'communities' => $communities
        ]);
    }

    public function create()
    {
        return Inertia::render('Communities/Create');
    }

  
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

    
  public function show($id)
{
    $community = Community::with(['posts' => function($query) {
        $query->with('user', 'votes')
              ->withCount('comments')
              ->orderBy('created_at', 'desc');
    }, 'moderators'])
    ->withCount('posts', 'members') 
    ->findOrFail($id);

    $community->is_member = $community->members()->where('user_id', Auth::id())->exists(); 
    
    if ($community->is_private && !$community->members()->where('user_id', Auth::id())->exists()) {
        return redirect()->route('communities.index')
            ->with('error', 'This community is private');
    }
    
    return Inertia::render('Communities/Show', [
        'community' => $community,
        'isMember' => $community->members()->where('user_id', Auth::id())->exists(),
        'isModerator' => $community->moderators()->where('user_id', Auth::id())->exists(),
        'postsCount' => $community->posts_count, // Explicitly pass posts count
        'membersCount' => $community->members_count // Explicitly pass members count
    ]);
} 

    public function edit($id)
    {
        $community = Community::findOrFail($id);
        
 
        if (!$community->moderators()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'You do not have permission to edit this community');
        }
        
        return Inertia::render('Communities/Edit', [
            'community' => $community
        ]);
    }

  
    public function update(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        

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

  
    public function destroy($id)
    {
        $community = Community::findOrFail($id);

        if ($community->user_id !== Auth::id()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'Only the community owner can delete a community');
        }
        
        $community->delete();
        
        return redirect()->route('communities.index')
            ->with('success', 'Community deleted successfully');
    }
    
  
    public function join($id)
    {
        $community = Community::findOrFail($id);
        

        if ($community->members()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('info', 'You are already a member of this community');
        }
        
        $community->members()->attach(Auth::id());
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'You have joined this community');
    }
    
   
    public function leave($id)
    {
        $community = Community::findOrFail($id);
        

        if (!$community->members()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('info', 'You are not a member of this community');
        }
        
        $community->members()->detach(Auth::id());
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'You have left this community');
    }
    
  
    public function addModerator(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        
   
        if ($community->user_id !== Auth::id() && 
            !$community->moderators()->where('user_id', Auth::id())->exists()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'You do not have permission to add moderators');
        }
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        

        if (!$community->members()->where('user_id', $validated['user_id'])->exists()) {

            $community->members()->attach($validated['user_id']);
        }
        
 
        $community->members()->updateExistingPivot($validated['user_id'], [
            'is_moderator' => true
        ]);
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'Moderator added successfully');
    }

    public function removeModerator(Request $request, $id)
    {
        $community = Community::findOrFail($id);
        

        if ($community->user_id !== Auth::id()) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'Only the community owner can remove moderators');
        }
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
 
        if ($validated['user_id'] == $community->user_id) {
            return redirect()->route('communities.show', $community)
                ->with('error', 'Cannot remove the community owner as moderator');
        }
        

        $community->members()->updateExistingPivot($validated['user_id'], [
            'is_moderator' => false
        ]);
        
        return redirect()->route('communities.show', $community)
            ->with('success', 'Moderator removed successfully');
    }
}

