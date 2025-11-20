<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


$pages = ['/', '/about', '/features', '/test','/login','/register','todolist','schedule', '/Timer', '/forgot-password', '/verify-otp', '/home', 'todolist','schedule'];

$items = array_map(function($page){
    return ($name= ltrim($page, '/')) === '' ?
     'home' : $name;
},$pages);


$associate = array_map(function($a, $b){
    return ['page'=>$a, 'file'=>$b];
},$pages,$items);

foreach ($associate as $item) {
    Route::get($item['page'],fn()=> Inertia::render($item['file']));
}


Route::post('/register', [RegisterController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/register', fn () => Inertia::render('register'))->name("register");
Route::get('/login', fn () => Inertia::render('login'))->name('login');

Route::get('/forgot-password', function () {
    return Inertia::render('forgotpassword');
})->name('password.request');

Route::get('/timer', function () {
    // Pastikan nama komponen ini sesuai dengan file Timer.jsx Anda
    return Inertia::render('Timer');
})->name('timer');

