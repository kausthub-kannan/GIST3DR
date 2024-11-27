import React, { useState, useEffect } from "react";
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
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../components/ui/animated-modal";
import Image from "next/image";
import { motion } from "framer-motion";

// import './styles.css'

import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";
import { fetchPatients } from "@/hooks/useFetchPatients";
import Link from "next/link";
import { isTokenExpired } from "@/hooks/useAuth";
import { deleteCookie } from "cookies-next";
import AddPatient from "./AddPatients";
import { BackgroundBeams } from "../components/ui/background-beams";

export function PatientsList() {
  const router = useRouter();
  const patients = usePatientsStore.getState().patients;
  const token = useAuthStore.getState().token;
  const clearAuthData = useAuthStore.getState().clearAuthData;

  const [loading, setLoading] = useState(false);

  const handleLoadPatients = async () => {
    setLoading(true);
    if (isTokenExpired()) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_first_name");
        localStorage.removeItem("user_last_name");
        deleteCookie("token");
      }

      // Clear Zustand store
      if (clearAuthData) clearAuthData();

      router.push("/sign-in");
      console.log("User logged out successfully.");
    } else {
      await fetchPatients();
    }
    setLoading(false);
  };

  const handleUserRedirect = (id) => {
    router.push(`/user/${id}`);
  };

  useEffect(() => {
    setLoading(true);
    handleLoadPatients();
    setLoading(false);
  }, []);

  return (
    <div className="z-30">
      <div className="flex items-center gap-2 justify-between mb-4">
        <h1 className="text-3xl text-white"> All Patients</h1>
        <div className="flex gap-8">
          {/* <button
            onClick={handleLoadPatients}
            className="card items-center text-white text-sm flex gap-2 rounded-full p-6 py-4 bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            </svg>{" "}
            Refresh list
          </button> */}
          <Modal className="">
            <ModalTrigger className="">
              <button className="card items-center text-white text-sm flex gap-2 p-6 py-4 rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M9 12h6" />
                  <path d="M12 9v6" />
                </svg>{" "}
                Add Patient
              </button>
            </ModalTrigger>
            <ModalBody className="bg-[#080b13] border-2 border-stone-500">
              <BackgroundBeams />

              <ModalContent className="">
                <AddPatient />
              </ModalContent>
            </ModalBody>
          </Modal>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-4">
          <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
        </div>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <Table>
            <TableHeader>
              <TableRow className="text-white card">
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
                <TableRow className="h-[50vh]">
                  <TableCell
                    colSpan={7}
                    className="text-center text-white align-middle text-xl"
                  >
                    No patients found. Add a patient to get started.
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
                    <TableCell>
                      {patient.bone_density_gram_per_centimeter_sq.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {patient.height_millimeter.toFixed(2)}
                    </TableCell>
                    <TableCell>{patient.width_millimeter.toFixed(2)}</TableCell>
                    <TableCell>{patient.thickness_millimeter}</TableCell>
                    <TableCell>
                      {patient.area_millimeter_sq.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
