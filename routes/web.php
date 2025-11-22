<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\OtpController;


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


Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:5,1');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:5,1');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');
Route::get('/verify-otp', [OtpController::class, 'show'])->name('otp.show');
Route::post('/verify-otp', [OtpController::class, 'verify'])->name('otp.verify');
Route::post('/otp/resend', [OtpController::class, 'resend'])->name('otp.resend');



Route::get('/verify-otp', [OtpController::class, 'show'])->name('otp.show');
Route::get('/register', fn () => Inertia::render('register'))->name("register");
Route::get('/login', fn () => Inertia::render('login'))->name('login');

Route::get('/forgot-password', function () {
    return Inertia::render('forgotpassword');
})->name('password.request');


Route::middleware(['auth'])->group(function () {

    Route::get('/todolist', [TaskController::class, 'index'])->name('todolist');
    Route::get('/schedule', [TaskController::class, 'schedule'])->name('schedule');
    Route::get('/timer', [TaskController::class, 'index'])->name('timer');

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
