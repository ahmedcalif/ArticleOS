<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\CommentFactory;

class Comment extends Model
{
    use HasFactory; 

    
    protected $fillable = [
        'content',
        'user_id',
        'post_id',
        'parent_id'
    ];
  
    /**
     * Create a new factory instance for the model.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    protected static function newFactory()
    {
        return CommentFactory::new();
    }
}