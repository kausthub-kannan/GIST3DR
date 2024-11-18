"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { signup } from "../../api/auth"; // Import signup function from auth service
import { useAuthOnAuthPage } from "../../hooks/useAuth";
import { useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner'

// Import signup function from auth service
export default function Signup() {

    useAuthOnAuthPage();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        grade: ""
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await signup(formData); // Assuming signup returns the full response
            
            // Adjust based on response structure
            const user = response?.user || response?.data?.user; // Handle both possible cases
            const accessToken = response?.access_token || response?.data?.access_token;
    
            if (user && accessToken) {
                // Save user details and token to localStorage
                localStorage.setItem("token", accessToken);
                localStorage.setItem("user_email", user.email);
                localStorage.setItem("user_first_name", user.first_name);
                localStorage.setItem("user_last_name", user.last_name);
    
                setSuccess("Signup successful!");
                setLoading(false); // Clear loading state
                router.push('/');
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            // Handle specific errors from API response
            if (err.response && err.response.data && err.response.data.detail === "User already registered") {
                setError("User already registered. Please sign in.");
            } else {
                setError("Signup failed. Please try again.");
            }
            setLoading(false);
            console.error("Error during signup:", err);
        }
    };
    

    return (
        <div className="flex flex-col gap-2">


            <div className="flex justify-center items-center w-full h-full mt-8 bg-[#7fee64] border-[#7fee64] rounded-md">
                <div className="max-w-xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8">
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                        Welcome to KKs Lab
                    </h2>
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
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                <LabelInputContainer>
                                    <Label htmlFor="first_name">First name</Label>
                                    <Input id="first_name" placeholder="Tyler" type="text" onChange={handleChange} value={formData.first_name} />
                                </LabelInputContainer>
                                <LabelInputContainer>
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input id="last_name" placeholder="Durden" type="text" onChange={handleChange} value={formData.last_name} />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={handleChange} value={formData.email} />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} value={formData.password} />
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-8">
                                <Label htmlFor="grade">Grade</Label>
                                <Input id="grade" placeholder="junior/senior" type="text" onChange={handleChange} value={formData.grade} />
                            </LabelInputContainer>

                            {error && <p className="text-red-500">{error}</p>}
                            {success && <p className="text-green-500">{success}</p>}

                            <button
                                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                type="submit">
                                Sign up &rarr;
                            </button>
                        </form>
                    </>}

                    <a href="/sign-in" className="text-black">sign in</a>
                </div>
            </div>
            {error &&
                <div className="flex justify-center items-center w-full h-full mt-2 bg-[#7fee64] border-[#7fee64] rounded-md p-4">
                    <p className="text-red-500">{error}</p>
                </div>
            }
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