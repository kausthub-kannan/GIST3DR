import React from "react";
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

import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";
import { fetchPatients } from "@/hooks/useFetchPatients";

export function PatientsList() {
  const router = useRouter();
  const patients = usePatientsStore.getState().patients;
  const loading = usePatientsStore.getState().loading;
  const token = useAuthStore.getState().token;

  const handleLoadPatients = () => {
   fetchPatients();
  };

  const handleUserRedirect = (id) => {
    router.push(`/user/${id}`);
  };

  return (
    <div>
      <div className="flex gap-2 justify-between mb-2">
      <h1 className="text-3xl text-[#7fee64]"> All Patients</h1>
      <button onClick={handleLoadPatients} className="text-sm flex gap-2 p-2 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b]">
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
      refresh
      </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-4">
          {/* Replace with your desired spinner or skeleton */}
          <ThreeDots height="80" width="80" color="#7fee64" ariaLabel="loading" />
        </div>
      ) : (
        <Table>
          <TableHeader className="">
            <TableRow className="text-black bg-[#7fee64] mt-2">
              <TableHead>Name</TableHead>
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
                <TableCell colSpan={7} className="text-center">
                  Add Patient
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow
                  key={patient?.id}
                  className="w-full cursor-pointer text-[#7fee64] hover:border hover:border-[#7fee64]"
                  onClick={() => handleUserRedirect(patient.id)}
                >
                  <TableCell className="font-medium">{patient.name}</TableCell>
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
      )}
    </div>
  );
}
