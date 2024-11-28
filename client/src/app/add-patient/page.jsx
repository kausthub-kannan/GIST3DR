"use client";
import React, { useEffect, useState } from "react";
import { createPatient } from "../../api/patient";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/stores/authStore";
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from 'next/navigation';
import { isTokenExpired, handleLogout } from "../../hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";


export default function AddUser() {
  const router = useRouter();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  // useAuth();
  // const token = useAuthStore((state) => state.token);
  const [token, setToken] = useState(localStorage.getItem('token'));
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
      ...prevData,
      [id]: id === "age" ? parseInt(value, 10) || "" : value,
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
        router.push('/');
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
    setToken(localStorage.getItem('token'));

    if (isTokenExpired()) {
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
  }, [])


  return (
    <div className="flex gap-2">
      <Sidebar className="mt-0 z-50" />
      <div className="flex flex-col gap-2 w-full">

        <div className="w-[800px] mx-auto border-0 p-4 pt-0 md:p-8">

          {loading ? <>
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </> : <>
            <form className="my-8" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md card">
                <label htmlFor="name" className=" shrink-0">Name : </label>
                <input id="name" placeholder="" type="text" value={formData.name} onChange={handleChange} className="bg-transparent appearance-none outline-none border-none focus:ring-0 text-base font-medium w-full" />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md card">
                <label htmlFor="age" className=" shrink-0">Age : </label>
                <input id="age" placeholder="" type="number" value={formData.age} onChange={handleChange} className="bg-transparent appearance-none outline-none border-none focus:ring-0 text-base font-medium w-full" />
                {errors.age && <p className="text-red-500">{errors.age}</p>}
              </div>
              <div className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-2 mb-4 border-2 border-[#7fee64] p-2 rounded-md card">
                <label htmlFor="dicom_file" className="">DICOM File : </label>
                <input
                  id="dicom_file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".dcm"
                  className="bg-transparent  appearance-none outline-none border-none focus:ring-0 text-base font-medium"
                />
                {errors.dicom_file && <p className="text-red-500">{errors.dicom_file}</p>}
              </div>

              <div className="flex w-full justify-end">
                {/* <button
                className="bg-[#7fee64] p-2 mt-2 rounded-md text-black font-medium text-base"
                type="submit">
                ADD
                </button> */}
                <button type="submit" className="card  text-white text-sm flex gap-2 p-2 px-4 items-center rounded-full bg-[#7fee64] border-[#7fee64] text-[#1b1b1b] hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg> Add
                </button>
              </div>
            </form>
          </>}


        </div>
      </div>
    </div>
  );
}

