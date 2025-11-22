<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    protected int $maxAttempts   = 5;
    protected int $otpTtlMinutes = 10;
    protected int $resendLimit   = 3;

    public function show(Request $request)
    {
        $email = session('otp_email');

        if (! $email) {
            return redirect()->route('login')
                ->withErrors(['login' => 'Missing verification context. Please log in or register again.']);
        }

        return inertia('OTPVerification', [
            'email'   => $email,
            'status'  => session('success'),
            'errors'  => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp_code' => ['required', 'digits:6'],
        ]);

        $email = session('otp_email');

        if (! $email) {
            return back()->withErrors([
                'otp_code' => 'Session expired. Please request a new code or register again.',
            ]);
        }

        $otpKey      = "otp:register:{$email}";
        $attemptsKey = "otp:register:{$email}:attempts";

        $hashedOtp = Cache::get($otpKey);

        if (! $hashedOtp) {
            return back()->withErrors([
                'otp_code' => 'Your code has expired. Please request a new one.',
            ]);
        }

        $attempts = Cache::get($attemptsKey, 0);

        if ($attempts >= $this->maxAttempts) {
            Cache::forget($otpKey);
            Cache::forget($attemptsKey);

            return back()->withErrors([
                'otp_code' => 'Too many incorrect attempts. A new code is required.',
            ]);
        }

        // Check code
        if (! Hash::check($request->otp_code, $hashedOtp)) {
            Cache::put($attemptsKey, $attempts + 1, now()->addMinutes($this->otpTtlMinutes));

            return back()->withErrors([
                'otp_code' => 'Invalid code. Please try again.',
            ]);
        }

        Cache::forget($otpKey);
        Cache::forget($attemptsKey);

        $user = User::where('email', $email)->first();

        if ($user) {
            if (! $user->email_verified_at) {
                $user->email_verified_at = now();
                $user->save();
            }

            auth()->login($user);
        }

        session()->forget('otp_email');

        return redirect('/')
            ->with('success', 'Your email has been verified successfully.');
    }

    public function resend(Request $request): RedirectResponse
    {
        $email = session('otp_email');

        if (! $email) {
            return redirect()->route('login')
                ->withErrors(['login' => 'Session expired. Please register or log in again.']);
        }

        $resendKey = "otp:register:{$email}:resend_count";
        $count     = Cache::get($resendKey, 0);

        if ($count >= $this->resendLimit) {
            return back()->withErrors([
                'otp_code' => 'You have requested too many codes. Please try again later.',
            ]);
        }

        $otp      = random_int(100000, 999999);
        $hashedOtp = Hash::make($otp);

        $otpKey      = "otp:register:{$email}";
        $attemptsKey = "otp:register:{$email}:attempts";

        Cache::put($otpKey, $hashedOtp, now()->addMinutes($this->otpTtlMinutes));
        Cache::put($attemptsKey, 0, now()->addMinutes($this->otpTtlMinutes));
        Cache::put($resendKey, $count + 1, now()->addMinutes($this->otpTtlMinutes));

        Mail::raw("Your new Tracklin verification code is: {$otp}", function ($message) use ($email) {
            $message->to($email)
                    ->subject('Your new Tracklin OTP Code');
        });

        return back()->with('success', 'We have resent your verification code.');
    }
}
