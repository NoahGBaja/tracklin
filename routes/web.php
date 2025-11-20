<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$pages = ['/', '/about', '/features', '/test', '/login', '/register', '/schedule', '/todolist'];

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
