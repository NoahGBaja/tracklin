<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\RedirectResponse;

class RegisterController extends Controller
{
    public function store(RegisterRequest $request): RedirectResponse{
    $data = $request->validated();

    $user = User::create([
        'name'     => $data['name'],
        'email'    => $data['email'],
        'password' => Hash::make($data['password']),
    ]);

    $email = $user->email;

    // generate & store OTP (you already had this)
    $otp = random_int(100000, 999999);
    $hashedOtp = Hash::make($otp);

    $otpKey      = "otp:register:{$email}";
    $attemptsKey = "otp:register:{$email}:attempts";

    Cache::put($otpKey, $hashedOtp, now()->addMinutes(10));
    Cache::put($attemptsKey, 0,       now()->addMinutes(10));

    session(['otp_email' => $email]);

    Mail::raw("Your Tracklin verification code is: {$otp}", function ($message) use ($user) {
        $message->to($user->email)
                ->subject('Your Tracklin OTP Code');
    });

    // 👇 THIS is the “hook” to OTPVerification.jsx
    return redirect()->route('otp.show');
    }
}
