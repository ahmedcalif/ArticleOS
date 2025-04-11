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
}