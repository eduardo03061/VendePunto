<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckSubscription
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isSubscriptionActive()) {
            return redirect('/redeem')->with('error', 'You need an active subscription to access this resource.'); 
            // O redirige a donde quieras que vaya si no está suscrito
        }

        return $next($request);
    }
}