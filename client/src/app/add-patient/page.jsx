"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { createPatient } from "../../api/patient";

export default function AddUser() {
  const [token, setToken] = useState();
  const [formData, setFormData] = useState({
    uuid: uuidv4(),
    name: "",
    age: "",
    area: "",
    boneDensity: "",
    height: "",
    width: "",
    thickness: "",
    dicom_file: null, // Added file field
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "age" || id === "boneDensity" || id === "height" || id === "width" || id === "thickness" 
        ? Number(value) 
        : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      dicom_file: e.target.files[0], // Set the selected file
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = "Name is required.";
    if (!formData.age || formData.age <= 0) validationErrors.age = "Please enter a valid age.";
    if (!formData.area.trim()) validationErrors.area = "Area is required.";
    if (!formData.boneDensity || formData.boneDensity <= 0) validationErrors.boneDensity = "Invalid bone density.";
    if (!formData.height || formData.height <= 0) validationErrors.height = "Invalid height.";
    if (!formData.width || formData.width <= 0) validationErrors.width = "Invalid width.";
    if (!formData.thickness || formData.thickness <= 0) validationErrors.thickness = "Invalid thickness.";
    if (!formData.dicom_file) validationErrors.dicom_file = "DICOM file is required.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = new FormData(); // Use FormData for multipart requests
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const response = await createPatient(data, token);
      if (response.status === 200) {
        console.log("Patient added successfully");
        setFormData({
          uuid: uuidv4(),
          name: "",
          age: "",
          area: "",
          boneDensity: "",
          height: "",
          width: "",
          thickness: "",
          dicom_file: null,
        });
        setErrors({});
      } else {
        console.error("Failed to add patient");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div className="w-[800px] mx-auto border-0 p-4 pt-0 md:p-8">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md ">
          <LabelInputContainer className="">
            <Label htmlFor="name" className="text-[#7fee64]">Name</Label>
            <input id="name" placeholder="" type="text" value={formData.name} onChange={handleChange} className="bg-black text-[#7fee64] appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md">
          <LabelInputContainer>
            <Label htmlFor="age" className="text-[#7fee64]">Age</Label>
            <input id="age" placeholder="25" type="number" value={formData.age} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.age && <p className="text-red-500">{errors.age}</p>}
          </LabelInputContainer>
          <LabelInputContainer className='border-l-2 border-[#7fee64] pl-2'>
            <Label htmlFor="area" className="text-[#7fee64]">Area</Label>
            <input id="area" placeholder="City/Area" type="text" value={formData.area} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.area && <p className="text-red-500">{errors.area}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md">
          <LabelInputContainer>
            <Label htmlFor="boneDensity" className="text-[#7fee64]">Bone Density</Label>
            <input id="boneDensity" placeholder="Value" type="number" value={formData.boneDensity} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.boneDensity && <p className="text-red-500">{errors.boneDensity}</p>}
          </LabelInputContainer>
          <LabelInputContainer className='border-l-2 border-[#7fee64] pl-2'>
            <Label htmlFor="height" className="text-[#7fee64]">Height</Label>
            <input id="height" placeholder="Height in cm" type="number" value={formData.height} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.height && <p className="text-red-500">{errors.height}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md">
          <LabelInputContainer>
            <Label htmlFor="width" className="text-[#7fee64]">Width</Label>
            <input id="width" placeholder="Width in cm" type="number" value={formData.width} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.width && <p className="text-red-500">{errors.width}</p>}
          </LabelInputContainer>
          <LabelInputContainer className='border-l-2 border-[#7fee64] pl-2'>
            <Label htmlFor="thickness" className="text-[#7fee64]">Thickness</Label>
            <input id="thickness" placeholder="Thickness in cm" type="number" value={formData.thickness} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"/>
            {errors.thickness && <p className="text-red-500">{errors.thickness}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md">
          <LabelInputContainer className=''>
            <Label htmlFor="dicom_file" className="text-[#7fee64]">DICOM File</Label>
            <input
              id="dicom_file"
              type="file"
              onChange={handleFileChange}
              accept=".dcm"
              className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"
            />
            {errors.dicom_file && <p className="text-red-500">{errors.dicom_file}</p>}
          </LabelInputContainer>
        </div>
        <div class="flex w-full justify-end">
        <button
          className="bg-[#7fee64] p-2 rounded-md text-black font-medium text-base"
          type="submit">
          ADD
        </button>
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
