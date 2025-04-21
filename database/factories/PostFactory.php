<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Community;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [
            'How to install the latest kernel on Ubuntu',
            'Best Linux distro for programming in 2025',
            'Help with NVIDIA drivers on Arch',
            'My i3wm setup with screenshots',
            'Switching from Windows to Linux - tips?',
            'Which text editor do you prefer?',
            'Best terminal emulator for productivity',
            'Linux on Framework laptop review',
            'Optimizing battery life on Linux',
            'Favorite bash aliases and functions'
        ];
        
        $contents = [
            'I recently upgraded to the latest kernel and my system performance improved significantly. Here\'s how I did it...',
            'After trying several distros, I found that Arch with KDE works best for my development workflow.',
            'Has anyone managed to get the RTX 4080 working properly with the latest drivers?',
            'I spent the weekend customizing my desktop environment. What do you think?',
            'I\'m planning to switch from Windows to Linux. Any advice for a smooth transition?'
        ];
        
        $urls = [
            'https://www.phoronix.com/linux-benchmarks',
            'https://itsfoss.com/best-linux-distros/',
            'https://www.kernel.org/releases.html',
            'https://github.com/torvalds/linux',
            null
        ];

        return [
            'title' => $this->faker->randomElement($titles),
            'content' => $this->faker->randomElement($contents),
            'url' => $this->faker->randomElement($urls),
            'user_id' => User::factory(),
            'community_id' => Community::factory(),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
}