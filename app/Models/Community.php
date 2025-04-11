<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Community extends Model
{
    use HasFactory;

    protected $fillable = [
    'name',
    'description',
    'rules',
    'is_private',
    'creator_id'
];

    /**
     * Get the creator of the community
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get all posts in this community
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get all members of this community
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_members')
                    ->withPivot('is_moderator')
                    ->withTimestamps();
    }

    /**
     * Get all moderators of this community
     */
    public function moderators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_members')
                    ->wherePivot('is_moderator', true)
                    ->withTimestamps();
    }
}