import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button';
import { ThreeDots } from "react-loader-spinner";

import useAuthStore from '@/stores/authStore';
import { signout } from "@/api/auth";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
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

    // Clear Zustand store
    clearAuthData();
    setLoading(false); // Hide loading spinner
    router.push('/sign-in');

    console.log("User logged out successfully.");
  };


  return (
    <>
      <div className="flex gap-2 w-full rounded-2xl p-4 border-2 text-[#7fee64] border-[#7fee64] justify-between items-center mb-4 mt-4">
        <h1 className="font-bold text-xl">KKs Lab</h1>
        <ul className="flex gap-6 ">
          <li><Link href='/'>Dashboard</Link></li>
          <li><Link href='/add-patient'>Add Patient</Link></li>
        </ul>
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

          </PopoverTrigger>
          <PopoverContent align="end" className="bg-[#1B1B1B] rounded-2xl p-4 border-2 text-[#7fee64] border-[#7fee64]">
            <div className='flex flex-col gap-2'>
              <h2>{first_name} {last_name}</h2>
              <h4>{email}</h4>

              {loading ? <>
                <ThreeDots height="80" width="80" color="#7fee64" ariaLabel="loading" /></> : <><Button variant="outline" onClick={handleLogout}>Logout</Button></>}

            </div>
          </PopoverContent>
        </Popover>

      </div>
    </>
  )
}