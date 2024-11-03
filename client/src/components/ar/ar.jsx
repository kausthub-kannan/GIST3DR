"use client";
import React, { useEffect } from "react";

const AframeScene = () => {
  // dynamically import aframe and aframe-react
  useEffect(() => {
    const loadAframe = async () => {
      await import("aframe");
      await import("aframe-react");
    };
    loadAframe();
  }, []);

  return (
    <a-scene>
      <a-box position="-1 0.5 -3" rotation="0 45 0" color="red"></a-box>
      <a-sphere position="0 1.25 -5" radius="1.25" color="green"></a-sphere>
      <a-cylinder
        position="1 0.75 -3"
        radius="0.5"
        height="1.5"
        color="blue"
      ></a-cylinder>
      <a-sky color="#000"></a-sky>
    </a-scene>
  );
};

export default AframeScene;
