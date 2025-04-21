<?php
namespace Database\Factories;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $comments = [
            'I\'ve been using this setup for months and it works perfectly. Great post!',
            'Have you tried updating your drivers? That fixed a similar issue for me.',
            'Thanks for sharing your experience, this was really helpful.',
            'I disagree - in my experience Ubuntu is much better for beginners than Fedora.',
            'You might want to check out the Arch Wiki, it has detailed documentation on this topic.',
            'I\'ve had the same problem. Adding "nomodeset" to my boot parameters fixed it.',
            'KDE Plasma has been my favorite DE for years now. So customizable!',
            'This worked perfectly on my system. Linux is amazing!',
            'Has anyone tried this on Debian? Wonder if the same steps work.',
            'Great tutorial! Maybe add a section about security considerations?'
        ];
        return [
            'content' => $this->faker->randomElement($comments),
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
            'parent_id' => null, 
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
    /**
     * Indicate this is a reply to another comment.
     *
     * @return Factory
     */
    public function asReply(): Factory
    {
        $replies = [
            'Totally agree with your point. This worked for me too.',
            'I had a different experience - maybe it depends on hardware?',
            'Could you share your config file? I\'d like to try those settings.',
            'Thanks for the tip! That saved me hours of troubleshooting.',
            'Have you tried the latest version? They fixed that bug recently.'
        ];
        return $this->state(function (array $attributes) use ($replies) {
            return [
                'parent_id' => Comment::factory(),
                'content' => $this->faker->randomElement($replies)
            ];
        });
    }
}