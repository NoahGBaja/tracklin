// resources/js/Pages/ForgotPassword.jsx

import React from 'react';
import { Link, useForm } from '@inertiajs/react'; 
import { Mail } from 'lucide-react'; 
import { Logo } from '../components/ui/attributes'; 

export default function ForgotPassword({ onNavigate }) { 
    const { data, setData, post, processing, errors } = useForm({
        email: 'user@example.com', 
    });

    const submit = (e) => {
        e.preventDefault();
        // Untuk demo desain, panggil navigasi lokal
        if (onNavigate) {
             onNavigate(data.email); 
        } else {
             post('/verify-otp'); 
        }
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
                <p className="text-blue-400 text-2xl text-center justify-center mb-10 font-semibold">Reset Your Password</p>
                    <form onSubmit={submit} className="flex flex-col w-full gap-6">
                        
                        <div className="relative">
                            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full pl-10"
                                required
                            />
                        </div>

                        {/* Link Back to Login */}
                        <div className="flex flex-col items-start text-sm text-[#0026A4] mt-2">
                             <div className="flex justify-start">
                                <p>Back to login?</p>
                                <Link href="/login" className="ml-2 underline cursor-pointer hover:opacity-75">
                                    Login
                                </Link>
                            </div>
                        </div>
                        
                        <button type="submit" 
                        className="mt-auto bg-[#1976D2] hover:bg-[#42A5F5] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#0026A4]">
                            Send Reset Link
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
}