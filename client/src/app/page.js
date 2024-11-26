"use client";

import { useEffect, useState } from "react";
import { PatientsList } from "@/components/PatientsList";
import { ThreeDots } from 'react-loader-spinner'
import './styles.css'

//hooks
import { useAuth } from "@/hooks/useAuth";
import {useFetchPatients} from "@/hooks/useFetchPatients";
import {isTokenExpired, handleLogout} from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";
import { deleteCookie } from 'cookies-next';


export default function Home() {
  useAuth();
  const router = useRouter();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  useEffect(()=>{
    if(isTokenExpired()){

    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_first_name");
        localStorage.removeItem("user_last_name");
        deleteCookie('token');
    }

    // Clear Zustand store
    if (clearAuthData) clearAuthData();

    router.push("/sign-in");
    console.log("User logged out successfully.");
    }
  },[])

  return (
    <div className=" h-screen relative flex flex-col w-full items-start justify-start">
        <div className="card w-full min-h-[600px] overflow-hidden relative rounded-2xl p-4 text-xl md:text-4xl border-2 font-bold text-[#7fee64] border-[#7fee64] text-[#ddffdc]">
          <PatientsList />
        </div>
    </div>
  );
}

