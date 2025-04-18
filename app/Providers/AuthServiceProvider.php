<?php
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Auth::provider('eloquent', function ($app, array $config) {
            return new \Illuminate\Auth\EloquentUserProvider(
                $app['hash'], $config['model'], 'username'
            );
        });
    }
}