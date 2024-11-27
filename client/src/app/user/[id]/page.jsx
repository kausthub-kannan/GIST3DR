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
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

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
  const [id, setId] = useState(null);

  // Move all client-side operations into useEffect
  useEffect(() => {
    // Get ID from URL after component mounts
    const pathSegments = window.location.pathname.split("/");
    const urlId = pathSegments[pathSegments.length - 1];
    setId(urlId);
  }, []);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Handle token initialization
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

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

  const [selectedBoneType, setSelectedBoneType] = useState("cancellous");

  // initial render check
  if (!id || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        No user data found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="card flex gap-4 w-full border-2 rounded-md p-4 items-center">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <Badge className="card ">{user.age} years old</Badge>
      </div>
      <div className="flex gap-4 w-full card rounded-md p-4 items-center h-[80vh]">
        <div className="w-1/3 h-full">
          <Card>
            <Screw3D
              screwHeight={user.height_millimeter}
              screwRadius={user.width_millimeter}
            />
          </Card>
          {user.name} Screw Height: {user.height_millimeter}mm
          <br />
          {user.name} Screw Width: {user.width_millimeter}mm
        </div>
        <div className="w-2/3 h-full flex flex-col gap-4 items-center">
          {selectedBoneType === "cancellous" && (
            <Bone3D modelPath={user.modal_urls.cancellous} />
          )}
          {selectedBoneType === "cortical" && (
            <Bone3D modelPath={user.modal_urls.cortical} />
          )}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedBoneType("cancellous")}
              className={cn(
                "hover:scale-105 transition-transform duration-200",
                selectedBoneType === "cancellous" && "bg-white text-black"
              )}
            >
              Cancellous
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedBoneType("cortical")}
              className={cn(
                "hover:scale-105 transition-transform duration-200",
                selectedBoneType === "cortical" && "bg-white text-black"
              )}
            >
              Cortical
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
