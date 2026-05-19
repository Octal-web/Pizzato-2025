<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Pizzato Vinhas e Vinhos</title>

        <!-- Fonts -->
        @if (str_starts_with(Route::currentRouteName(), 'Manager') || str_starts_with(Route::currentRouteName(), 'Intranet'))
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        @else
        <link rel="stylesheet" href="https://use.typekit.net/cbe4aou.css">
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="{{ (str_starts_with(Route::currentRouteName(), 'Manager') || str_starts_with(Route::currentRouteName(), 'Intranet')) ? 'font-admin' : 'font-sans' }} text-neutral-800 antialiased selection:text-white selection:bg-gray-700">
        @inertia
    </body>
</html>
