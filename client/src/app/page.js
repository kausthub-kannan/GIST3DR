"use client";

import { useEffect, useState } from "react";
import { PatientsList } from "@/components/PatientsList";
import { ThreeDots } from 'react-loader-spinner'
import { Navbar } from "@/components/Navbar";
import './styles.css'

//hooks
import { useAuth } from "@/hooks/useAuth";
import {useFetchPatients} from "@/hooks/useFetchPatients";
import { useInitializeAuth } from '@/hooks/useInitializeAuth';

export default function Home() {
  // useAuth();
  // useInitializeAuth();

  return (
    <div className=" h-screen relative flex flex-col w-full items-start justify-start">
      {/* <Navbar /> */}
        <div className="card w-full min-h-[600px] overflow-hidden relative rounded-2xl p-4 text-xl md:text-4xl border-2 font-bold text-[#7fee64] border-[#7fee64] text-[#ddffdc]">
          <PatientsList />
        </div>
      {/* </>} */}
    </div>
  );
}

