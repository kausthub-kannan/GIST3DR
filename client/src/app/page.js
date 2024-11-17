"use client";

import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import Image from "next/image";
import { PatientsList } from "@/components/PatientsList";
import { AddUser } from "@/components/AddUser";
import { Plus } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { getPatients } from "../api/patient";
import { ThreeDots } from 'react-loader-spinner'

export default function Home() {
  useAuth();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // Get token directly

  useEffect(()=>{
    setToken(localStorage.getItem('token'));
  },[])

  useEffect(() => {
    console.log("hello")
    const fetchPatients = async () => {
      if (!token) return; // Ensure token exists
      try {
        const response = await getPatients(token);
        console.log(response);
        setPatients(response.data);
        setLoading(false); // assuming the data is an array of patient objects
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, [token]);



  // const tabs = [
  //   {
  //     title: "All Patients",
  //     value: "product",
  //     content: (
  //       <div className="w-full min-h-[600px] overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl border-2 font-bold text-black text-[#7fee64] border-[#7fee64] bg-black">
  //         <PatientsList patients={patients} />
  //       </div>
  //     ),
  //   },
  //   {
  //     title: " Add Patients",
  //     value: "services",
  //     content: (
  //       <div className="w-full overflow-hidden relative h-fit border-0 rounded-2xl p-10 pt-2 text-xl md:text-4xl font-bold text-black bg-[#7fee64]">
  //         <AddUser />
  //       </div>
  //     ),
  //   },
  // ];
  
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
        {/* <Tabs tabs={tabs} /> */}
        <div className="w-full min-h-[600px] overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl border-2 font-bold text-black text-[#7fee64] border-[#7fee64] bg-black">
          <PatientsList patients={patients} />
        </div>
      </>}
    </div>
  );
}

