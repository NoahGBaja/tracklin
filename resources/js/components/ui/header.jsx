'use client'

import { Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Profil, Close_Button, Logo } from "./attributes"
import { router } from '@inertiajs/react'

export default function Header({ sidebar, role, userData }) {
    const { url } = usePage()
    const [showProfile, setShowProfile] = useState(false)
    const [showLogoutPopup, setShowLogoutPopup] = useState(false)

    const hiddenPages = ['/login', '/register', '/forgot-password']
    if (hiddenPages.includes(url)) return null;

    const links = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Features', href: '/features' },
    ]

    const handleProfileClick = () => {
        if (role === 'guest') {
            router.visit('/register')
        } else {
            setShowProfile(true)
        }
    }

    const handleLogout = () => {
        router.visit('/logout')
    }

    return (
        <>
            <div className="w-screen h-[10%] shadow-2xl fixed top-0 z-25">
                <div className="w-full h-full bg-[#03045E]">
                    <div className="flex ml-auto w-[30%] justify-center items-center h-full">
                        <div className="flex justify-evenly items-center text-2xl h-full w-[80%] text-white">
                            {links.map((item, i) => {
                                const active =
                                    url === item.href ||
                                    (item.name === 'Features' &&
                                     (url.startsWith('/todolist') || url === '/schedule' || url === '/timer'))

                                return (
                                    <div
                                        key={i}
                                        className={`cursor-pointer hover:opacity-75 hover:scale-98 transition duration-100 ease-in-out 
                                        ${active ? 'text-[#1e90ff]' : 'text-[#FFFFFF]'}`}>
                                        <Link href={item.href}>{item.name}</Link>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-center items-center h-full w-[20%]">
                            <div className="flex justify-center items-center w-[65%] h-full cursor-pointer">
                                <div onClick={handleProfileClick} className="hover:opacity-75 hover:scale-98 transition duration-75 ease-in-out">
                                    <Profil className="w-12 h-12 rounded-full border-2 border-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            {showProfile && (
                <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50"
                     onClick={() => setShowProfile(false)}>
                    <div
                        className="flex flex-row bg-[#1646A9]/95 border-3 border-white rounded-3xl w-[80%] md:w-[65%] h-[75%] shadow-[0_0_25px_#001F91] text-white overflow-hidden"
                        onClick={(e) => e.stopPropagation()}>

                        <div className="flex flex-col w-[35%] border-r-3 border-white items-center justify-center relative">
                            <div className="absolute top-[5%] left-[5%] w-[40%]">
                                <Logo />
                            </div>
                            <div className="flex justify-center items-center w-[100%] h-[90%]">
                                <Profil className="w-full h-full" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[65%] relative">
                            <div className="flex justify-end items-center h-[18%] pr-[5%] pt-[2%] space-x-[3%]">
                                <div onClick={() => setShowLogoutPopup(true)} 
                                     className="bg-[#005ec2] border-[#0D277B] border-3 #023e8a hover:opacity-60 px-4 py-2 rounded-xl cursor-pointer font-semibold">
                                    Logout
                                </div>
                                <div onClick={() => setShowProfile(false)} className="w-[5%] cursor-pointer hover:opacity-60">
                                    <Close_Button />
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-start h-[64%] border-y-3 border-white px-[10%]">
                                <div className="ml-5 mr-5 bg-[#87BDFF] text-[#245FBB] px-[10%] py-[3%] rounded-xl w-[90%] font-medium text-[1.8vw]">
                                    {userData?.name || 'Username'}
                                </div>
                            </div>

                            <div className="flex justify-center items-center h-[18%]">
                                <p className="text-[#428DF5] text-4xl"
                                   style={{textShadow: `-2.5px -2.5px 0 #0D277B, 2.5px -2.5px 0 #0D277B, -2.5px 2.5px 0 #0D277B, 2.5px 2.5px 0 #0D277B`}}>
                                    Tracklin Agent
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showLogoutPopup && (
                <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-60"
                     onClick={() => setShowLogoutPopup(false)}>
                    <div
                        className="bg-white border-4 border-[#1646A9] rounded-2xl px-35 py-10 w-[80%] md:w-[40%] text-center shadow-lg"
                        onClick={(e) => e.stopPropagation()}>
                        <p className="text-xl text-[#0D47A1] font-semibold mb-6">
                            Are you sure to log out from "{userData?.name || 'account'}"?
                        </p>
                        <div className="flex justify-around">
                            <button
                                onClick={handleLogout}
                                className="bg-[#1646A9] text-white border-2 px-6 py-3 rounded-xl hover:opacity-70">
                                Yes
                            </button>
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                className="bg-[#1976D2] text-white border-2 px-6 py-3 rounded-xl hover:opacity-70">
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
