"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPatient } from "../api/patient"; // Adjust path as needed
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

export function UserPage({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
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
    return <div className="flex flex-col space-y-3 m-8">
      <Skeleton className="bg-gray-800 h-[125px] w-full rounded-xl" />
      <div class="flex gap-2">
        <Skeleton className="bg-gray-800 h-[525px] w-[400px] rounded-xl" />
        <Skeleton className="bg-gray-800 h-[525px] w-full rounded-xl" />
      </div>
    </div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full m-4 p-4">
      <div className="flex gap-4 w-full border-2 border-[#7fee64] bg-[#7fee64] text-black rounded-md p-4 items-center">
        <h1 className="text-2xl font-bold">{user?.name || "Abhinav Naman"}</h1>
        <Badge className="bg-black text-[#7fee64]">{user?.age || "22"} years old</Badge>

        {/* <h3 className="text-sm text-gray-500">{user?.age || "22"} years old</h3> */}
      </div>
      <div className="flex gap-4 w-full border-2 border-[#7fee64] rounded-md p-4 items-center h-[80vh]">
        {/* AR part */}
      </div>
    </div>
  );
}
