<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Community>
 */
class CommunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $linuxCommunities = [
            'ubuntu' => 'The Ubuntu community for users of all levels. Discuss installation, customization, software, and more.',
            'archlinux' => 'A community for Arch Linux users. Share tips, solve problems, and explore the bleeding edge.',
            'linux_gaming' => 'Gaming on Linux! Discuss Steam Proton, native games, Lutris, and hardware compatibility.',
            'kde_plasma' => 'KDE Plasma desktop environment discussions, customizations, and troubleshooting.',
            'linux_sysadmin' => 'For system administrators working with Linux servers and infrastructure.',
            'debian' => 'The stable, reliable Debian Linux community. For users, developers and enthusiasts.',
            'fedora' => 'Fedora Linux discussions, news, and support for this cutting-edge distro.',
            'linux_security' => 'Linux security topics including hardening, tools, vulnerabilities, and best practices.',
            'i3wm' => 'The i3 window manager community. Share configs, tips, and minimize mouse usage.',
            'linux_ricing' => 'Making Linux beautiful - share your desktop customizations, dotfiles, and themes.',
            'shell_scripting' => 'Discussions about bash, zsh, fish and other shell scripting techniques.',
            'linux_hardware' => 'Linux hardware compatibility, drivers, and troubleshooting.',
            'elementary_os' => 'The elementary OS community for users of this beautiful, simple Linux distro.',
            'raspberry_pi' => 'Linux on Raspberry Pi - projects, help, and inspiration.',
            'pop_os' => 'System76\'s Pop!_OS community for users, gamers, and developers.',
            'vim_users' => 'All things Vim and Neovim. Share configs, plugins, and tips.',
            'emacs_users' => 'Emacs community - the extensible, customizable text editor and more.',
            'linux_containers' => 'Docker, LXC, Podman and other Linux container technologies.',
            'linux_networking' => 'Linux networking configurations, tools, and troubleshooting.',
            'open_source' => 'Discussions about open source software, philosophy, and contributions.',
        ];

        $communityNames = array_keys($linuxCommunities);
        $communityName = $this->faker->unique()->randomElement($communityNames);

        return [
            'name' => $communityName,
            'description' => $linuxCommunities[$communityName],
            'creator_id' => User::factory(),
            'created_at' => $this->faker->dateTimeBetween('-2 years', '-6 months'),
            'updated_at' => function (array $attributes) {
                return $this->faker->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }

    /**
     * Popular Linux distribution community
     */
    public function distribution(): static
    {
        $distros = [
            'ubuntu' => 'The Ubuntu community for users of all levels. Discuss installation, customization, software, and more.',
            'archlinux' => 'A community for Arch Linux users. Share tips, solve problems, and explore the bleeding edge.',
            'debian' => 'The stable, reliable Debian Linux community. For users, developers and enthusiasts.',
            'fedora' => 'Fedora Linux discussions, news, and support for this cutting-edge distro.',
            'opensuse' => 'openSUSE Linux community - for users of Leap, Tumbleweed and more.',
            'gentoo' => 'Gentoo Linux community - compile everything, optimize everything.',
            'manjaro' => 'Manjaro Linux - Arch-based, user-friendly Linux distribution with rolling releases.',
            'mint' => 'Linux Mint - elegant, easy to use, up to date and comfortable Linux desktop.',
            'pop_os' => 'System76\'s Pop!_OS community for users, gamers, and developers.',
            'endeavouros' => 'EndeavourOS - terminal-centric Arch-based distro with a friendly community.',
        ];

        $distroNames = array_keys($distros);
        $distroName = $this->faker->randomElement($distroNames);

        return $this->state(function (array $attributes) use ($distroName, $distros) {
            return [
                'name' => $distroName,
                'description' => $distros[$distroName],
            ];
        });
    }

    /**
     * Desktop environment community
     */
    public function desktopEnvironment(): static
    {
        $desktopEnvs = [
            'kde_plasma' => 'KDE Plasma desktop environment discussions, customizations, and troubleshooting.',
            'gnome' => 'GNOME desktop environment community. Share extensions, themes and workflows.',
            'xfce' => 'The lightweight and stable Xfce desktop environment community.',
            'i3wm' => 'The i3 window manager community. Share configs, tips, and minimize mouse usage.',
            'cinnamon' => 'Linux Mint\'s Cinnamon desktop environment - traditional layout with modern features.',
            'mate' => 'MATE desktop - the continuation of GNOME 2 for users who prefer the classic desktop metaphor.',
            'budgie' => 'Budgie desktop environment - modern, elegant and user-friendly.',
            'deepin' => 'Deepin Desktop Environment - beautiful and easy-to-use desktop from China.',
            'awesome_wm' => 'Awesome Window Manager - highly configurable and extensible tiling window manager.',
            'sway' => 'Sway - i3-compatible Wayland compositor for a modern Linux desktop.',
        ];

        $desktopEnvNames = array_keys($desktopEnvs);
        $desktopEnvName = $this->faker->randomElement($desktopEnvNames);

        return $this->state(function (array $attributes) use ($desktopEnvName, $desktopEnvs) {
            return [
                'name' => $desktopEnvName,
                'description' => $desktopEnvs[$desktopEnvName],
            ];
        });
    }
}