"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { createPatient } from "../api/patient";

export function AddUser() {
  const [formData, setFormData] = useState({
    uuid: uuidv4(),
    name: "",
    age: "",
    area: "",
    boneDensity: "",
    height: "",
    width: "",
    thickness: "",
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

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = "Name is required.";
    if (!formData.age || formData.age <= 0) validationErrors.age = "Please enter a valid age.";
    if (!formData.area.trim()) validationErrors.area = "Area is required.";
    if (!formData.boneDensity || formData.boneDensity <= 0) validationErrors.boneDensity = "Invalid bone density.";
    if (!formData.height || formData.height <= 0) validationErrors.height = "Invalid height.";
    if (!formData.width || formData.width <= 0) validationErrors.width = "Invalid width.";
    if (!formData.thickness || formData.thickness <= 0) validationErrors.thickness = "Invalid thickness.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await createPatient(formData);
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
        });
        setErrors({});
      } else {
        console.error("Failed to add patient");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full my-10 mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Tyler" type="text" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="age">Age</Label>
            <Input id="age" placeholder="25" type="number" value={formData.age} onChange={handleChange} />
            {errors.age && <p className="text-red-500">{errors.age}</p>}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="area">Area</Label>
            <Input id="area" placeholder="City/Area" type="text" value={formData.area} onChange={handleChange} />
            {errors.area && <p className="text-red-500">{errors.area}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="boneDensity">Bone Density</Label>
            <Input id="boneDensity" placeholder="Value" type="number" value={formData.boneDensity} onChange={handleChange} />
            {errors.boneDensity && <p className="text-red-500">{errors.boneDensity}</p>}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="height">Height</Label>
            <Input id="height" placeholder="Height in cm" type="number" value={formData.height} onChange={handleChange} />
            {errors.height && <p className="text-red-500">{errors.height}</p>}
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="width">Width</Label>
            <Input id="width" placeholder="Width in cm" type="number" value={formData.width} onChange={handleChange} />
            {errors.width && <p className="text-red-500">{errors.width}</p>}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="thickness">Thickness</Label>
            <Input id="thickness" placeholder="Thickness in cm" type="number" value={formData.thickness} onChange={handleChange} />
            {errors.thickness && <p className="text-red-500">{errors.thickness}</p>}
          </LabelInputContainer>
        </div>
        <button
          className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 text-white rounded-md h-10"
          type="submit">
          ADD
        </button>
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
