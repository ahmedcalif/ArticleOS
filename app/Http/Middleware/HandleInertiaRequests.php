<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
   // In App\Http\Middleware\HandleInertiaRequests.php
public function share(Request $request): array
{
    [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'quote' => ['message' => trim($message), 'author' => trim($author)],
         'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                ] : null,
            ], 
        
         'flash' => [
            'message' => $request->session()->get('success') ?: $request->session()->get('error') ?: $request->session()->get('info'),
            'type' => $request->session()->has('success') ? 'success' : 
                     ($request->session()->has('error') ? 'error' : 
                     ($request->session()->has('info') ? 'info' : null))
        ],
        
        'ziggy' => fn (): array => [
            ...(new Ziggy)->toArray(),
            'location' => $request->url(),
        ]
    ];
} 
}
