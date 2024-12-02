"use client";
import React from "react";
import ScrewAR from "@/components/models/screw-ar";
import { useSearchParams } from "next/navigation";

const ARPage = () => {
  const searchParams = useSearchParams();
  const screwHeight = parseFloat(searchParams.get("height"));
  const screwRadius = parseFloat(searchParams.get("radius"));

  return <ScrewAR screwHeight={screwHeight} screwRadius={screwRadius} />;
};

export default ARPage;