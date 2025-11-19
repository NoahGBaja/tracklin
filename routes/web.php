<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$pages = ['/', '/about', '/features', '/test','/login'];

<<<<<<< HEAD
Route::get('/', fn () => Inertia::render('home'));
Route::get('/about', fn () => Inertia::render('about'));
Route::get('/features', fn () => Inertia::render('features'));
Route::get('/test', fn () => Inertia::render('test'));
Route::get('/login', fn () => Inertia::render('login'));
Route::get('/register', fn () => Inertia::render('register'));
Route::get('/todolist', fn () => Inertia::render('todolist'));
Route::get('/schedule', fn () => Inertia::render('schedule'));

=======
$items = array_map(function($page){
    return ($name= ltrim($page, '/')) === '' ?
     'home' : $name;
},$pages);
>>>>>>> d2077f4 (refactor)


$associate = array_map(function($a, $b){
    return ['page'=>$a, 'file'=>$b];
},$pages,$items);

foreach ($associate as $item) {
    Route::get($item['page'],fn()=> Inertia::render($item['file']));
    // print_r($item['file']);
}
