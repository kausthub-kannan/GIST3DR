"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeJSARRender = () => {
  const rendererRef = useRef(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    // Add light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Add a 3D cube
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -1); // Position 1 meter in front
    scene.add(cube);

    // Setup the AR button
    document.body.appendChild(THREE.ARButton.createButton(renderer));

    // Render loop
    const render = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    };
    render();

    return () => {
      renderer.setAnimationLoop(null);
      if (renderer.domElement) document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default ThreeJSARRender;
