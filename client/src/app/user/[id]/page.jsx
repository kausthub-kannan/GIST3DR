"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPatient } from "../../../api/patient"; // Adjust path as needed
import { Badge } from "../../../components/ui/badge";
import useAuthStore from "@/stores/authStore";
import { ThreeDots } from "react-loader-spinner";
import { useAuth } from "@/hooks/useAuth";
import {isTokenExpired, handleLogout} from "../../../hooks/useAuth";
import { deleteCookie } from 'cookies-next';





export default function User({ params }) {
  useAuth();
  const router = useRouter();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const { id } = params; 

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if(isTokenExpired()){
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_first_name");
        localStorage.removeItem("user_last_name");
        deleteCookie('token');
    }

    // Clear Zustand store
    if (clearAuthData) clearAuthData();

    router.push("/sign-in");
    console.log("User logged out successfully.");
    }

    const fetchUser = async () => {
      if (!id || !token) return;

      try {
        const response = await getPatient(id, token);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]);

  if (loading) {
    return (<>
      <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
    </>);
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
    <div className="card flex gap-4 w-full border-2  rounded-md p-4 items-center">
      <h1 className="text-2xl font-bold">{user?.name || "Abhinav Naman"}</h1>
      <Badge className="card ">{user?.age || "22"} years old</Badge>

      {/* <h3 className="text-sm text-gray-500">{user?.age || "22"} years old</h3> */}
    </div>
    <div className="flex gap-4 w-full card rounded-md p-4 items-center h-[80vh]">
      {/* AR part */}
      {/* <DemoAR /> */}
    </div>
  </div>
  );
}


