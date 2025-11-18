<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', fn () => Inertia::render('home'));
Route::get('/about', fn () => Inertia::render('about'));
Route::get('/features', fn () => Inertia::render('features'));
Route::get('/test', fn () => Inertia::render('test'));
Route::get('/login', fn () => Inertia::render('login'));
Route::get('/register', fn () => Inertia::render('register'));
Route::get('/todolist', fn () => Inertia::render('todolist'));
Route::get('/schedule', fn () => Inertia::render('schedule'));


