"use client";
import React, { useEffect, useState } from "react";
import { createPatient } from "../../api/patient";
import { useAuth } from "@/hooks/useAuth";

export default function AddUser() {
  useAuth();
  const [token, setToken] = useState();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dicom_file: null,
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData, [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      dicom_file: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = "Name is required.";
    if (!formData.age || formData.age <= 0) validationErrors.age = "Please enter a valid age.";
    if (!formData.dicom_file) validationErrors.dicom_file = "DICOM file is required.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    console.log("inside handleSubmit 1")

    e.preventDefault();
    if (!validateForm()) return;

    try {

      console.log("inside handleSubmit 2")
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${value}`);
      }


      console.log("inside handleSubmit 3")

      const response = await createPatient(data, token);

      console.log("Response data:", response.data);
      console.log("Response status:", response.status);


      console.log("inside handleSubmit 4")
      if (response.status === 200) {
        console.log("inside handleSubmit 5")
        console.log("Patient added successfully");
        setFormData({
          name: "",
          age: "",
          dicom_file: null,
        });
        setErrors({});
      } else {
        console.error("Failed to add patient");
      }
      setLoading(false)
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("Token not found in localStorage");
    } else {
      console.log("Token found:", storedToken);
    }
    setToken(storedToken);
  }, []);
  


  return (
    <div className="w-[800px] mx-auto border-0 p-4 pt-0 md:p-8">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md ">
          <label htmlFor="name" className="text-[#7fee64] shrink-0">Name : </label>
          <input id="name" placeholder="" type="text" value={formData.name} onChange={handleChange} className="bg-black text-[#7fee64] appearance-none outline-none border-none focus:ring-0 text-base font-medium w-full" />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md ">
          <label htmlFor="age" className="text-[#7fee64] shrink-0">Age : </label>
          <input id="age" placeholder="" type="number" value={formData.age} onChange={handleChange} className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium w-full" />
          {errors.age && <p className="text-red-500">{errors.age}</p>}
        </div>
        <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md ">
          <label htmlFor="dicom_file" className="text-[#7fee64]">DICOM File : </label>
          <input
            id="dicom_file"
            type="file"
            onChange={handleFileChange}
            accept=".dcm"
            className="bg-black text-[#7fee64]  appearance-none outline-none border-none focus:ring-0 text-base font-medium"
          />
          {errors.dicom_file && <p className="text-red-500">{errors.dicom_file}</p>}
        </div>
        <div className="flex w-full justify-end">
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
