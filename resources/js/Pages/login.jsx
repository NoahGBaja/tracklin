import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Logo } from '../components/ui/attributes';

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/login', {
            login: formData.username,
            password: formData.password,
        });
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
                <p className="text-blue-400 text-2xl text-center justify-center mb-10 font-semibold">Login to your account!</p>
                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username/ Email"
                            value={formData.username}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full mb-28"
                            required
                        />                

                        <div className="flex flex-col items-start text-sm text-[#0026A4] mt-2">
                            <div className="flex items-center gap-2">
                                <p className="mb-3">Don’t have an account?</p>
                                <Link href="/register" className="underline mb-3 cursor-pointer hover:opacity-75">
                                Register here
                                </Link>
                            </div>

                            <Link href="/forgot-password" className="underline mb-2 cursor-pointer hover:opacity-75">
                                Forgot Password?
                            </Link>
                        </div>
                        <button type="submit" 
                        className="mt-auto bg-[#1976D2] hover:bg-[#42A5F5] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#0026A4]">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}