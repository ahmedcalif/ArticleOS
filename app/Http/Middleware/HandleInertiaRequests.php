<?php
namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        
        // Get the authenticated user with explicit check
        $user = Auth::user();
        $isLoggedIn = !is_null($user);
        
        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'logged_in' => $isLoggedIn,
                'user_id' => $isLoggedIn ? $user->id : null,
                'user' => $isLoggedIn ? $user : null,
            ],
            'flash' => [
                'message' => $request->session()->get('success') ?: $request->session()->get('error') ?: $request->session()->get('info'),
                'type' => $request->session()->has('success') ? 'success' : 
                         ($request->session()->has('error') ? 'error' : 
                         ($request->session()->has('info') ? 'info' : null))
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}