<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): RedirectResponse {
        $data = $request->validated();
        $login = trim($data['login']);
        $password = $data['password'];
        
        $isEmail = filter_var($login, FILTER_VALIDATE_EMAIL) !== false;
        $field = $isEmail ? 'email' : 'name';

        if (!Auth::attempt([$field => $login, 'password' => $password])) {
            return back()->withErrors([
                'login' => 'Invalid Credentials',
            ]);
        }
        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function destroy(Request $request): RedirectResponse {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
