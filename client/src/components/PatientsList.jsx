import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { ThreeDots } from "react-loader-spinner";
// import './styles.css'

import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";
import { fetchPatients } from "@/hooks/useFetchPatients";
import Link from "next/link";

export function PatientsList() {
  const router = useRouter();
  const patients = usePatientsStore.getState().patients;
  let loading = usePatientsStore.getState().loading;
  const token = useAuthStore.getState().token;

  const handleLoadPatients =async () => {
    loading = true;
    await fetchPatients();
    loading = false;
  };

  const handleUserRedirect = (id) => {
    router.push(`/user/${id}`);
  };
  
  useEffect(()=>{
    loading = true;
    fetchPatients();
    loading = false;
  },[]);

  return (
    <div className="z-30">
      <div className="flex gap-2 justify-between mb-4">
        <h1 className="text-3xl text-white"> All Patients</h1>
        <div className="flex gap-8">
          <button onClick={handleLoadPatients} className="card  text-white text-sm flex gap-2 p-2 px-4 items-center rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg> Refresh list
          </button>
          <Link href='/add-patient'>
            <button className="card  text-white text-sm flex gap-2 p-2 px-4 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg> Add Patient
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-4">
          {/* Replace with your desired spinner or skeleton */}
          <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader className="">
              <TableRow className="text-white card ">
                <TableHead className="">Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Bone Density</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Width</TableHead>
                <TableHead>Thickness</TableHead>
                <TableHead>Area</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-white">
                    <Link href='/add-patient'>
                      <button className="card items-center text-white text-sm flex gap-2 p-2 px-6 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg> Add Patient
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow
                    key={patient?.id}
                    className="w-full cursor-pointer text-white hover:bg-gray-600"
                    onClick={() => handleUserRedirect(patient.id)}
                  >
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.bone_density_gram_per_centimeter_sq.toFixed(2)}</TableCell>
                    <TableCell>{patient.height_millimeter.toFixed(2)}</TableCell>
                    <TableCell>{patient.width_millimeter.toFixed(2)}</TableCell>
                    <TableCell>{patient.thickness_millimeter}</TableCell>
                    <TableCell>{patient.area_millimeter_sq.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
