// resources/js/Pages/CheckInbox.jsx

import React from 'react';
import { Link } from '@inertiajs/react'; 
import { Mail } from 'lucide-react';
import { Logo } from '../components/ui/attributes'; 

export default function CheckInbox({ email, onNavigate }) {
    const userEmail = email || "user@example.com"; 
    
    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[#78B3F0] pt-12">
            <p onClick={() => window.history.back()}
            className="absolute top-16 left-18 text-white text-6xl font-bold cursor-pointer hover:opacity-80 mt-15">
            ‹ back
            </p>

            <div className="flex flex-col items-center w-full max-w-[600px] gap-7">
                <Logo/>

                <div className="flex flex-col items-center bg-white/90 p-10 rounded-3xl shadow-2xl w-full border-2 border-[#0026A4] min-h-[500px] justify-between">
                
                    {/* Content Section */}
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <p className="text-blue-400 text-2xl font-semibold text-center mb-4">Check Your Inbox!</p>
                        
                        <p className="text-center text-gray-700">
                            We've sent a password reset link to <span className="font-semibold text-[#0026A4]">{userEmail}</span>. 
                            The link will expire shortly, so please use it right away.
                        </p>
                        
                        {/* Ikon Mail */}
                        <Mail className="w-16 h-16 text-[#1976D2] mt-4"/>
                    </div>
                    
                    {/* Button Section */}
                    <Link
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate(); }} // Panggil navigasi ke Login
                        className="w-full bg-[#1976D2] hover:bg-[#42A5F5] text-white text-lg py-3 rounded-2xl shadow-md transition border-2 border-[#0026A4] text-center"
                    >
                        Login Again
                    </Link>
                </div>
            </div>
        </div>
    );
}