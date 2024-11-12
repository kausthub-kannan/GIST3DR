"use client";
import React from "react";
import Script from "next/script";

const AframeARRender = () => {
  return (
    <>
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.3.2/aframe/build/aframe-ar.js"
        strategy="afterInteractive"
      />
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-marker preset="hiro">
          <a-box
            position="0 0.5 0"
            material="color: blue;"
            depth="1"
            height="1"
            width="1"
          ></a-box>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    </>
  );
};

export default AframeARRender;
