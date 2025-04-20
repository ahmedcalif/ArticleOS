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

  
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_members')
                    ->withPivot('is_moderator')
                    ->withTimestamps();
    }

    
    public function moderators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_members')
                    ->wherePivot('is_moderator', true)
                    ->withTimestamps();
    }
}