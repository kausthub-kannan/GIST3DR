"use client";
import "./globals.css";
import { Sidebar} from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "../components/ui/background-beams";

const bodyStyle = {
  background: 'radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%)',
};
export default function RootLayout({ children }) {

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  

  return (
    <html lang="en">
      <body className="flex gap-6 min-h-screen bg-gradient-to-bl from-gray-800 via-gray-900 to-black mx-16 m-4 text-white">
        <BackgroundBeams />
        
          { token &&  <Sidebar />}
        <div className="flex flex-col gap-2 w-full mt-4">
            {children}
        </div>
      </body>
    </html>
  );
}
