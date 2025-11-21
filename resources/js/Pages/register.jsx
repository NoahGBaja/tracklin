import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react"; 
import { Logo } from '../components/ui/attributes';


export default function Register() {
    const { errors } = usePage().props;
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        ReenterPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/register', {
            name: formData.username,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.ReenterPassword,
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
                <p className="text-blue-400 text-2xl text-center justify-center mb-10 font-semibold">Regist your account!</p>
                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6" method="post">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 mt-1">
                                {errors.name}
                            </p>
                        )}
                        
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 mt-1">
                                {errors.email}
                            </p>
                        )}
                        
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                        
                        <input
                            type="password"
                            name="ReenterPassword"
                            placeholder="Re-enter Password"
                            value={formData.ReenterPassword}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-400 w-full"
                            required
                        />
                        {(formData.password != formData.ReenterPassword) && (
                            <p className="text-red-500 mt-1">
                                "Password Need to match!"
                            </p>
                        )}
                        
                        <div className="flex justify-left text-sm text-[#0026A4] mt-2">
                            <p>Already have an account?</p>
                            <Link href="/login" className="ml-2 underline mb-2 cursor-pointer hover:opacity-75">Login</Link>
                        </div>
                        
                        <button type="submit" 
                        className="mt-auto bg-[#1976D2] hover:bg-[#42A5F5] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#0026A4]">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}