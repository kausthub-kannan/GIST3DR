import React, { useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button';
import { ThreeDots } from "react-loader-spinner";
import '../app/styles.css'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip"
import { deleteCookie } from 'cookies-next';


import { BackgroundGradient } from "../components/ui/background-gradient";

import useAuthStore from '@/stores/authStore';
import { signout } from "@/api/auth";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
    useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const email = useAuthStore((state) => state.email);
    const first_name = useAuthStore((state) => state.user_first_name);
    const last_name = useAuthStore((state) => state.user_last_name);
    const clearAuthData = useAuthStore((state) => state.clearAuthData);

    console.log(`${first_name} ${last_name}`)
    console.log(email)

    const handleLogout = async () => {
        setLoading(true); // Show loading spinner
        // await signout();
        // Clear localStorage (if you’re using it for persistence)
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_first_name");
        localStorage.removeItem("user_last_name");

        deleteCookie('token');

        // Clear Zustand store
        clearAuthData();

        setLoading(false); // Hide loading spinner
        if (typeof window !== "undefined") {
            router.push("/sign-in");
        }
        

        console.log("User logged out successfully.");
    };


    return (
        <>
            <div className="card flex flex-col gap-12 rounded-2xl p-4 border-2 border-[#7fee64] justify-between items-center mb-4 mt-4 h-fit z-50">
                <Link href='/'>
                    <div className="">
                        <h1 className="font-bold text-xl">KKs</h1>
                        <h1 className="font-bold text-xl">Lab</h1>
                    </div>
                </Link>
                <ul className="flex flex-col gap-6 ">
                    <li>
                    <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                        <Link href='/'>
                            <button className="card  text-white text-sm flex gap-2 p-2 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-home"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" /></svg>
                            </button>
                        </Link>
                        </TooltipTrigger>
                                <TooltipContent className="card" side="right" >
                                    <p>Home</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                    <li>
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href='/add-patient'>
                                        <button className="card  text-white text-sm flex gap-2 p-2 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" /></svg>
                                        </button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="card" side="right" >
                                    <p>Add Patient</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                </ul>
                <Popover className="card">
                    <PopoverTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                    </PopoverTrigger>
                    <PopoverContent className="" side="right">
                        {/* card bg-[#1B1B1B] rounded-2xl p-4 border-2  */}
                        <BackgroundGradient className=" max-w-sm p-4">
                            <div className='flex gap-2'>
                                <div className='w-full flex-1'>
                                    <h2>Hello {first_name || "Doctor"} {last_name}</h2>
                                    <h4>{email || "abc@gmail.com"}</h4>
                                </div>

                                {loading ? <>
                                    <ThreeDots height="80" width="80" color="#7fee64" ariaLabel="loading" /></> : <button onClick={handleLogout} className="card w-14 h-14 flex justify-center items-center text-white text-sm p-2 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-logout"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>
                                </button>}

                            </div>
                        </BackgroundGradient>
                    </PopoverContent>
                </Popover>

            </div>
        </>
    )
}