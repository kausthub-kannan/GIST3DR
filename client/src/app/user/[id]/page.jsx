"use client";
import { UserPage } from "@/components/UserPage";
import { useAuth } from "@/hooks/useAuth";

export default function User({ params }) {
  // useAuth();
  const { id } = params; 

  return (
    <UserPage id={id} /> 
  );
}


