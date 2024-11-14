"use client"; 

import { Tabs } from "@/components/ui/tabs";
import Image from "next/image";
import { PatientsList } from "@/components/PatientsList";
import { AddUser } from "@/components/AddUser";
import { Plus } from 'lucide-react';
import { SearchInput } from "@/components/SearchInput";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    // useAuth();
  const tabs = [
    {
      title: "All Patients",
      value: "product",
      content: (
        <div className="w-full min-h-[600px] overflow-hidden relative rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-green-700 to-green-900">
          <p>Patients Data</p>
          <PatientsList />
        </div>
      ),
    },
    {
      title: " Add Patients",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-fit rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-green-700 to-green-900">
          <p className="flex items-center gap-2">Add Patients <Plus strokeWidth={3}/></p>
          <AddUser />
        </div>
      ),
    },
  ];
  return (
    <div className=" h-screen relative flex flex-col  mx-10 w-full  items-start justify-start my-10">
      {/* <div className="w-full flex justify-end justify-items-end justify-self-end">
      <SearchInput />
      </div> */}
      <Tabs tabs={tabs} />
    </div>
  );
}

