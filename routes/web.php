<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$pages = ['/', '/about', '/features', '/test','/login','/register','todolist','schedule'];

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
