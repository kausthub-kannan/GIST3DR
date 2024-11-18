"use client"

import {useState, useEffect} from "react";
import { getPatients } from "@/api/patient";

export const useFetchPatients = (token) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () =>{
        if(!token) return;

        try{
            const response = await getPatients(token);
            console.log("useFetchPatients: ",response);
            setPatients(response.data);
            setLoading(false);
        }
        catch(error){
            console.error("Error fetching patients:", error);
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchPatients()
    }, [token])

    return {patients, loading};
}