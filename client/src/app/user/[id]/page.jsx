"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPatient } from "@/api/patient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThreeDots } from "react-loader-spinner";
import Screw3D from "@/components/models/screw-3d";
import Bone3D from "@/components/models/bone-3d";
import { useAuth } from "@/hooks/useAuth";
import { usePatientData } from "@/hooks/usePatientData";
import { Sidebar } from "@/components/Sidebar";

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

const BoneTypeSelector = ({ selectedType, onTypeChange, availableTypes }) => (
  <div className="flex flex-wrap gap-2">
    {Object.entries(availableTypes).map(([type, url]) => (
      <Button
        key={type}
        variant="outline"
        onClick={() => onTypeChange(type)}
        disabled={!url}
        className={cn(
          "hover:scale-105 transition-transform duration-200 text-sm  rounded-full border-0 shadow-none ",
          selectedType === type && " card"
        )}
      >
        {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
      </Button>
    ))}
  </div>
);

export default function User() {
  // useAuth();
  const router = useRouter();

  const { user, loading, error } = usePatientData();
  const [selectedBoneType, setSelectedBoneType] = React.useState("cancellous");

  const handleARView = (e) => {
    e.preventDefault();
    const screwHeight = user.height_millimeter;
    const screwRadius = user.width_millimeter;

    router.push(
      `/user/${user.id}/ar?height=${screwHeight}&radius=${screwRadius}`
    );
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
  //     </div>
  //   );
  // }

  // if (error || !user) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       {error || "No user data found."}
  //     </div>
  //   );
  // }

  return (
    <div className="flex gap-2 z-10">
      <Sidebar className="mt-0 z-50" />
      {loading ? (
        <div className="mx-auto my-auto">
          <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
        </div>
      ) : (
        <>
          {!user ? (
            <div className="mx-auto my-auto">No user data found.</div>
          ) : (
            <div className="flex flex-col gap-4 w-full p-4 pt-0">
              <div className="card flex gap-4 w-full border-2 rounded-md p-4 items-center">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <Badge className="card">Age: {user?.age}</Badge>
                <Badge className="card">Screw Height: {user.height_millimeter}mm </Badge>
                <Badge className="card">Screw width: {user.width_millimeter}mm </Badge>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 w-full card rounded-md p-4 items-center h-fit">
                <div className="w-full lg:w-1/3 h-[300px] lg:h-full">
                  <div className="m-1 card rounded-md">
                    <Screw3D
                      screwHeight={user.height_millimeter}
                      screwRadius={user.width_millimeter}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleARView}
                    className=" hover:scale-105 transition-transform duration-200 mt-3 card rounded-full"
                  >
                    View in AR
                  </Button>
                </div>

                <div className="w-full lg:w-2/3 h-[400px] lg:h-full flex flex-col gap-4 items-center">
                  <Bone3D modelPath={user.modal_urls[selectedBoneType]} />

                  <div className="flex w-full justify-end">
                    <div className="card  p-4 rounded-lg w-fit">
                      <BoneTypeSelector
                        selectedType={selectedBoneType}
                        onTypeChange={setSelectedBoneType}
                        availableTypes={user.modal_urls}
                      />
                    </div >
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}