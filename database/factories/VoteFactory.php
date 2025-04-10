<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vote>
 */
class VoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $votableType = $this->faker->randomElement(['post', 'comment']);
        $votableId = $votableType === 'post' 
            ? Post::factory() 
            : Comment::factory();

        return [
            'user_id' => User::factory(),
            'votable_id' => $votableId,
            'votable_type' => $votableType,
            'value' => $this->faker->randomElement([1, -1]), // Upvote or downvote
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    /**
     * Indicate this is a post vote.
     *
     * @return Factory
     */
    public function forPost(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'votable_type' => 'post',
                'votable_id' => Post::factory(),
            ];
        });
    }

    /**
     * Indicate this is a comment vote.
     *
     * @return Factory
     */
    public function forComment(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'votable_type' => 'comment',
                'votable_id' => Comment::factory(),
            ];
        });
    }

    /**
     * Indicate this is an upvote.
     *
     * @return Factory
     */
    public function asUpvote(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'value' => 1,
            ];
        });
    }

    /**
     * Indicate this is a downvote.
     *
     * @return Factory
     */
    public function asDownvote(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'value' => -1,
            ];
        });
    }
}