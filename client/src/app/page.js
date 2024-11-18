"use client";

import { useEffect, useState } from "react";
import { PatientsList } from "@/components/PatientsList";
import { ThreeDots } from 'react-loader-spinner'

//hooks
import { useAuth } from "@/hooks/useAuth";
import {useFetchPatients} from "@/hooks/useFetchPatients";

export default function Home() {
  useAuth();
  const [token, setToken] = useState(); // Get token directly
  const {patients, loading} = useFetchPatients(token);
  console.log(patients)

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [])


  return (
    <div className=" h-screen relative flex flex-col  mx-10 w-full  items-start justify-start my-10">
      {loading ? <>
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </> : <>
        <div className="w-full min-h-[600px] overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl border-2 font-bold text-black text-[#7fee64] border-[#7fee64] bg-black">
          <PatientsList patients={patients} />
        </div>
      </>}
    </div>
  );
}

