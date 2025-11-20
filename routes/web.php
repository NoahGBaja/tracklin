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
    // print_r($item['file']);
}


Route::post('/register', [RegisterController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class,'destroy'])->name('logout');

Route::get('/register', fn () => Inertia::render('register'))->name("register");
Route::get('/login', fn () => Inertia::render('login'))->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/todolist', fn () => Inertia::render('todolist'));
    Route::get('/schedule', fn () => Inertia::render('schedule'));
});
Route::get('/forgot-password', function () {
    return Inertia::render('forgotpassword');
})->name('password.request');

Route::get('/timer', function () {
    return Inertia::render('Timer');
})->name('timer');
