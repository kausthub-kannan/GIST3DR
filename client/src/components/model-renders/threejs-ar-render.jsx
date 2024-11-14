"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

const ThreeJSARRender = () => {
  const rendererRef = useRef(null);

  useEffect(() => {
    // Initialize the WebGL renderer with alpha for transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create scene and camera for AR environment
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    // Add ambient light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Placeholder geometry for dental screw (replace with 3D model later)
    const screwGeometry = new THREE.SphereGeometry(0.1, 32, 16);
    const screwMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const screw = new THREE.Mesh(screwGeometry, screwMaterial);
    screw.position.set(0, 0, -1); // Position 1 meter in front
    scene.add(screw);

    // Add AR button to DOM
    document.body.appendChild(ARButton.createButton(renderer));

    // Set up the rendering loop with WebXR animation
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Cleanup function for removing renderer and AR elements on component unmount
    return () => {
      renderer.setAnimationLoop(null);
      if (renderer.domElement) document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default ThreeJSARRender;
