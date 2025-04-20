<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Comment extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'content',
        'user_id',
        'post_id',
        'parent_id',

    ];
    
    protected $appends = ['upvotes_count', 'downvotes_count', 'current_user_vote'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
   
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }
 
    public function getUpvotesCountAttribute()
    {
        return $this->votes()->where('vote_type', 1)->count();
    }
    

    public function getDownvotesCountAttribute()
    {
        return $this->votes()->where('vote_type', -1)->count();
    }
    

    public function getCurrentUserVoteAttribute()
    {
        if (!Auth::check()) {
            return 0;
        }
        
        $vote = $this->votes()->where('user_id', Auth::id())->first();
        
        return $vote ? $vote->vote_type : 0;
    }
}