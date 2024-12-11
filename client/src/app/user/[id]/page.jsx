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
          "hover:scale-105 transition-transform duration-200 text-sm",
          selectedType === type && "bg-white text-black"
        )}
      >
        {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
      </Button>
    ))}
  </div>
);

export default function User() {
  useAuth();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots height="80" width="80" color="white" ariaLabel="loading" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        {error || "No user data found."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <Card className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full p-4 items-center">
        <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
          <p>Screw Height: {user.height_millimeter}mm</p>
          <p>Screw Width: {user.width_millimeter}mm</p>
        </div>
        <Badge className="sm:ml-auto text-sm">Age: {user.age}</Badge>
      </Card>

      <div className="flex flex-col lg:flex-row gap-4 w-full card rounded-md p-4 items-center min-h-[80vh]">
        <div className="w-full lg:w-1/3 h-[300px] lg:h-full">
          <Card className="p-1">
            <Screw3D
              screwHeight={user.height_millimeter}
              screwRadius={user.width_millimeter}
            />
          </Card>
          <Button
            variant="outline"
            onClick={handleARView}
            className="hover:scale-105 transition-transform duration-200 bg-white text-black mt-3 mx-auto block w-full sm:w-auto"
          >
            View in AR
          </Button>
        </div>

        <div className="w-full lg:w-2/3 h-[400px] lg:h-full flex flex-col gap-4 items-center">
          <Bone3D modelPath={user.modal_urls[selectedBoneType]} />

          <BoneTypeSelector
            selectedType={selectedBoneType}
            onTypeChange={setSelectedBoneType}
            availableTypes={user.modal_urls}
          />
        </div>
      </div>
    </div>
  );
}
