<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| Static Pages (Auto Mapped)
|--------------------------------------------------------------------------
| Halaman biasa yang tidak butuh controller.
| Dibuat dalam bentuk array agar mudah di-manage.
*/

$staticPages = [
    '/',
    '/about',
    '/features',
    '/otpverification',
    '/timer'
];

$items = array_map(function ($page) {
    return ($name = ltrim($page, '/')) === '' ? 'home' : $name;
}, $staticPages);

$associate = array_map(function ($a, $b) {
    return ['page' => $a, 'file' => $b];
}, $staticPages, $items);

foreach ($associate as $item) {
    Route::get($item['page'], fn () => Inertia::render($item['file']));
}

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:3,5');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:3,5');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/register', fn () => Inertia::render('register'))->name("register");
Route::get('/login', fn () => Inertia::render('login'))->name('login');

Route::get('/forgot-password', function () {
    return Inertia::render('forgotpassword');
})->name('password.request');

/*
|--------------------------------------------------------------------------
| To-Do List + Tasks DB Routes
|--------------------------------------------------------------------------
| INI BAGIAN PENTING:
| todolist harus pakai controller agar data tasks bisa dikirim ke React
*/
Route::middleware(['auth'])->group(function () {

    // PAGE todolist — mengambil tasks dari DB
    Route::get('/todolist', [TaskController::class, 'index'])->name('todolist');
     Route::get('/schedule', [TaskController::class, 'schedule'])->name('schedule');

    // API endpoints
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});


Route::get('/whoami', function () {
    return [
        'auth_id' => auth()->id(),
        'session' => session()->all(),
    ];
});
