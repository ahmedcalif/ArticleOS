<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'community_id'
    ];

    /**
     * Get the user who created the post
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the community this post belongs to
     */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

 public function comments()
{
    return $this->hasMany(Comment::class);
} 
public function votes()
{
    return $this->hasMany(Vote::class);
}

// Method to get the vote count
public function getVoteCountAttribute()
{
    return $this->votes->sum(function ($vote) {
        return $vote->is_upvote ? 1 : -1;
    });
}
}

