"use client";
import React, { useEffect, useState } from "react";

const Aframe3DRender = () => {
  const [size, setSize] = useState(1.25);
  const [rotation, setRotation] = useState(45);
  const [modelScale, setModelScale] = useState(1);

  // dynamically import aframe
  useEffect(() => {
    const loadAframe = async () => {
      await import("aframe");
    };
    loadAframe();
  }, []);

  return (
    <div className="h-screen">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "75vw",
            height: "75vh",
            border: "1px solid black",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <a-scene embedded>
            <a-camera
              position="0 1.6 0"
              wasd-controls="acceleration: 300"
              look-controls
            ></a-camera>

            <a-obj-model
              src="/models/label_1.obj"
              position="-250 -400 0"
              rotation={`30 ${rotation} 5`}
              scale={`${modelScale} ${modelScale} ${modelScale}`}
              material="color: #000000; opacity: 1"
            ></a-obj-model>
            <a-obj-model
              src="/models/label_2.obj"
              position="-250 -400 0"
              rotation={`30 ${rotation} 5`}
              scale={`${modelScale} ${modelScale} ${modelScale}`}
              material="color: #000000; opacity: 1"
            ></a-obj-model>

            <a-sphere
              position="0 1.25 -5"
              radius={size}
              color="#EF2D5E"
            ></a-sphere>

            <a-sphere
              position="2 1.25 -5"
              radius={size}
              color="#4CC3D9"
            ></a-sphere>
            <a-sky color="#808080"></a-sky>
          </a-scene>
        </div>
        <div style={{ marginTop: "20px" }}>
          <label>
            Size:
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: "20px" }}>
            Rotation:
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: "20px" }}>
            Model Scale:
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={modelScale}
              onChange={(e) => setModelScale(e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Aframe3DRender;
