"use client"

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";
import { UserInput } from "./UserInput";
import UserInfo from "./UserInfo";

export function UserPage({id}) {

  return (
    (
      <div className="flex flex-col gap-4 w-full m-4 p-4">
        <div className="flex gap-4 w-full border-2 border-[#7fee64] rounded-md p-4 items-center">
          <h1 className="text-2xl font-bold">User Name</h1>
          <h3 className="text-sm text-gray-500">29 years old</h3>
        </div>
        <div className="flex gap-4 w-full border-2 border-[#7fee64] rounded-md p-4 items-center h-[80vh]">

        </div>
      </div>
    )
  );
}

