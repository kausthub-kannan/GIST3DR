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

export function PatientsList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        setPatients(response.data); // assuming the data is an array of patient objects
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
        {patients.map((patient) => (
          <TableRow key={patient.uuid} className="w-full cursor-pointer">
            <TableCell className="font-medium">{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.boneDensity}</TableCell>
            <TableCell>{patient.height}</TableCell>
            <TableCell>{patient.width}</TableCell>
            <TableCell>{patient.thickness}</TableCell>
            <TableCell>{patient.area}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
