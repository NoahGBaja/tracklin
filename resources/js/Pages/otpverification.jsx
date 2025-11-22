import React from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react'; 
import { Logo } from '../components/ui/attributes'; 

export default function OTPVerification({ email, onNavigate }) {
    const { errors, flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        otp_code: '',
    });

    const userEmail = usePage().props?.email ?? "user@kocak.com";

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.verify'), data);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#78B3F0] pt-12">
            <p onClick={() => window.history.back()}
            className="absolute top-16 left-18 text-white text-6xl font-bold cursor-pointer hover:opacity-80 mt-15">
            ‹ back
            </p>

            <div className="flex flex-col items-center w-full max-w-[600px] gap-7">
                <Logo/>

                <div className="flex flex-col items-center bg-white/90 p-10 rounded-3xl shadow-2xl w-full border-2 border-[#0026A4] min-h-[500px]">
                <p className="text-blue-400 text-2xl text-center justify-center mb-10 font-semibold">Verify OTP</p>
                    <form onSubmit={submit} className="flex flex-col w-full gap-6">
                        
                        <p className="text-sm text-center text-gray-700">
                            Enter 6 digit code sent to your email: <span className="font-semibold text-[#0026A4]">{userEmail}</span>
                        </p>
                        
                        <input
                            type="text"
                            name="otp_code"
                            placeholder="Enter 6-Digit Code"
                            value={data.otp_code}
                            onChange={(e) => setData('otp_code', e.target.value.slice(0, 6))}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full text-center"
                            maxLength="6"
                            required
                        />

                        {errors?.otp_code && (
                            <p className="text-red-500 text-center text-sm mt-1">
                                {errors.otp_code}
                            </p>
                        )}
                        
                        <div className="text-sm text-center text-[#0026A4]">
                            <button
                                type="button"
                                onClick={() => router.post(route('otp.resend'))}
                                className="mt-auto bg-[#1976D2] hover:bg-[#42A5F5] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#0026A4]"
                            >
                                Resend code
                            </button>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="mt-auto bg-[#1976D2] hover:bg-[#42A5F5] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#0026A4]"
                            disabled={processing}
                        >
                            {processing ? 'Verifying...' : 'Verify'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}