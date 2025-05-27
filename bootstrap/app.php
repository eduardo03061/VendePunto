<?php

use App\Http\Middleware\CheckSubscription;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Session\Middleware\StartSession;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Registra el middleware CheckSubscription con el alias 'subscription'
        $middleware->append(StartSession::class,
        \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class);
        $middleware->alias([
            'subscription' => CheckSubscription::class,
        ]);

        // Mueve HandleInertiaRequests a group, no es necesario en todas las rutas web
        $middleware->group('web', [
            \App\Http\Middleware\HandleInertiaRequests::class,
            // \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class, // Probablemente no lo necesites a menos que sepas para qué es
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();