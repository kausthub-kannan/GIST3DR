"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPatient } from "../../../api/patient"; // Adjust path as needed
import { Badge } from "../../../components/ui/badge";
import useAuthStore from "@/stores/authStore";
import { ThreeDots } from "react-loader-spinner";
import { useAuth } from "@/hooks/useAuth";
import { isTokenExpired, handleLogout } from "../../../hooks/useAuth";
import { deleteCookie } from "cookies-next";
import Screw3D from "@/components/models/screw-3d";
import Bone3D from "@/components/models/bone-3d";

// sample data from getPatient api
// {
//   "id": "2b794326-74d3-41e3-b577-af0bc562805b",
//   "name": "caitlyn",
//   "age": 25,
//   "bone_density_gram_per_centimeter_sq": 144.15,
//   "height_millimeter": 34.24,
//   "width_millimeter": 15.19,
//   "thickness_millimeter": 60.6,
//   "area_millimeter_sq": 1818.69,
//   "modal_urls": {
//       "cancellous": "", (url_string)
//       "nerve_canal": null
//   },
//   "gif_urls": {
//       "cancellous": "", (url_string)
//       "cortical": "", (url_string)
//       "nerve_canal": null (url_string)
//   }
// }

export default function User() {
  useAuth();
  const router = useRouter();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const id = router.query?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // const token = useAuthStore((state) => state.token);

  useEffect(() => {
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
    return (
      <>
        <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
      </>
    );
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
        <div className="w-1/2 h-full">
          Screw 3D Render
          <Screw3D
            screwHeight={user.height_millimeter}
            screwRadius={user.width_millimeter}
          />
          {user.name} Screw Height: {user.height_millimeter}mm
          <br />
          {user.name} Screw Width: {user.width_millimeter}mm
        </div>
        <div className="w-1/2 h-full">
          <Bone3D modelPath={user.modal_urls.cancellous} />
        </div>
      </div>
    </div>
  );
}
