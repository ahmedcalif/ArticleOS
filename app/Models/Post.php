<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model    
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'content',
        'user_id',
        'community_id',
    ];

    /**
     * Get the user that owns the post.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the community that the post belongs to.
     */
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Get the comments for the post.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the votes for the post.
     */
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}