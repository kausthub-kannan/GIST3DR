"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { signin } from "../../api/auth";
import { useRouter } from "next/navigation";
import { ThreeDots } from "react-loader-spinner";
import { setCookie } from "cookies-next";

import { useAuthOnAuthPage } from "../../hooks/useAuth";
import { useFetchPatients } from "@/hooks/useFetchPatients";
import usePatientsStore from "@/stores/patientStore";
import useAuthStore from "@/stores/authStore";

export default function Signin() {
  //custom hook for page protection
  // useAuthOnAuthPage();

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { fetchPatients } = useFetchPatients();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signin(formData);

      if (response) {
        // Store in localStorage
        localStorage.setItem("token", response?.data.access_token);
        localStorage.setItem("user_email", response?.data.user.email);
        localStorage.setItem("user_first_name", response?.data.user.first_name);
        localStorage.setItem("user_last_name", response?.data.user.last_name);

        // Store token in cookies
        setCookie("token", response?.data.access_token, {
          maxAge: 60 * 60 * 24 * 7,
        }); // 7 days

        const authStore = useAuthStore.getState();
        authStore.setAuthData({
          isAuthenticated: true,
          token: response?.data.access_token,
          user_email: response?.data.user.email,
          user_first_name: response?.data.user.first_name,
          user_last_name: response?.data.user.last_name,
        });

        await fetchPatients();

        setSuccess("Signup successful!");
        setError(null);
        setLoading(false);
        router.push("/");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
      setLoading(false);
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className=" flex justify-center ">
      <div className="card max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 border-0 bg-[#7fee64] border-[#7fee64]">
        <h1 className="text-center text-2xl font-bold">GIST-3DR</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2 my-8">
            <p className="text-white">Getting all patients data...</p>
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
          </div>
        ) : (
          <>
            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="card text-white"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="card text-white"
                />
              </LabelInputContainer>

              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Sign in &rarr;
              </button>
            </form>
            <a
              href="/sign-up"
              className="text-white card p-2 rounded-full px-4"
            >
              Sign Up
            </a>
          </>
        )}
      </div>
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
