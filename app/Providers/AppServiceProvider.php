<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share auth data with Inertia
        Inertia::share([
            'auth' => function () {
                return [
                    'id' => Auth::id(),
                    'name' => Auth::check() ? Auth::user()->name : null,
                ];
            },
            // Add appearance to the shared Inertia data
            'appearance' => function () {
                return Auth::check() 
                    ? Auth::user()->appearance ?? 'system'
                    : session('appearance', 'system');
            },
        ]);

        // Also share appearance with Blade views
        View::share('appearance', Auth::check() 
            ? Auth::user()->appearance ?? 'system'
            : session('appearance', 'system')
        );
    }
}