"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { signin } from "../../api/auth";
import { useAuthOnAuthPage } from "../../hooks/useAuth"; // Import signup function from auth service

export default function Signup() {
    useAuthOnAuthPage();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signin(formData);

            //local storage or should i use zustand?
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("user_email", response.user.email);
            localStorage.setItem("user_first_name", response.user.first_name);
            localStorage.setItem("user_last_name", response.user.last_name);


            //confirmations
            setSuccess("Signup successful!");
            setError(null); // Clear any existing errors
            console.log("Form submitted:", response.data);
            
        } catch (err) {
            setError("Signup failed. Please try again."); // Handle errors
            console.error("Error during signup:", err);
        }
    };

    // useEffect(() => {
    //     useAuth();
    // }, []);

    return (
        <div className="flex justify-center items-center w-full h-full mt-8">
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to Aceternity
                </h2>
                <form className="my-8" onSubmit={handleSubmit}>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={handleChange} value={formData.email} />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} value={formData.password} />
                    </LabelInputContainer>

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit">
                        Sign in &rarr;
                    </button>
                </form>
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
