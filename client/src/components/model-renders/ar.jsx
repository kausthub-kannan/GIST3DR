"use client";
import React, { useEffect } from "react";

const AframeARRender = () => {
  // dynamically import aframe and aframe-react
  useEffect(() => {
    const loadAframe = async () => {
      await import("aframe");
      await import("aframe-react");
    };
    loadAframe();
  }, []);

  return <a-scene>{/* PENDING */}</a-scene>;
};

export default AframeARRender;
