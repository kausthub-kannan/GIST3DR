import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPatients } from "../api/patient"; // Import the getPatients function
import { Skeleton } from "./ui/skeleton";
import { useRouter } from 'next/navigation';

export function PatientsList({patients}) {
  const router = useRouter();

  const handleUserRedirect =(id)=>{
    router.push(`/user/${id}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-black bg-[#7fee64] rounded-md border mt-2">
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
            <TableCell colSpan={7} className="text-center">Add Patient</TableCell>
          </TableRow>
        ) : (
          patients.map((patient) => (
            <TableRow key={patient.uuid} className="w-full cursor-pointer text-[#7fee64]" onClick={()=> handleUserRedirect(patient.id)}>
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
  );
}
