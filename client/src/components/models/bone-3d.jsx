"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Card } from "@/components/ui/card";

const Bone3D = ({ modelPath }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Get parent container dimensions
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Use container dimensions instead of window
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Update lighting to match screw component
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    hemisphereLight.position.set(0.5, 1, 0.25);
    scene.add(hemisphereLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Load the .obj model
    const loader = new OBJLoader();
    loader.load(
      modelPath,
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              metalness: 0.8,
              roughness: 0.3,
            });
          }
        });

        scene.add(object);
        // Center the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        // Scale the object to be smaller
        const scale = 0.75; // Adjust this value to make it smaller (0.5 = half size)
        object.scale.set(scale, scale, scale);

        // Add continuous rotation
        object.rotation.y = 0; // Initialize
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    // Position camera at an angle
    camera.position.set(25, 25, 25);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.target.set(0, 0, 0); // Set the target point to orbit around
    controls.enablePan = true; // Enable panning (right mouse button drag)

    // Add keyboard controls
    const keyboardControls = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      w: false,
      s: false,
    };

    const handleKeyDown = (event) => {
      if (keyboardControls.hasOwnProperty(event.key)) {
        keyboardControls[event.key] = true;
      }
    };

    const handleKeyUp = (event) => {
      if (keyboardControls.hasOwnProperty(event.key)) {
        keyboardControls[event.key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Update animation loop to include keyboard controls
    const animate = () => {
      requestAnimationFrame(animate);

      // Handle keyboard camera movements
      const moveSpeed = 1;
      if (keyboardControls.ArrowLeft) {
        camera.position.x -= moveSpeed;
        controls.target.x -= moveSpeed;
      }
      if (keyboardControls.ArrowRight) {
        camera.position.x += moveSpeed;
        controls.target.x += moveSpeed;
      }
      if (keyboardControls.ArrowUp) {
        camera.position.z -= moveSpeed;
        controls.target.z -= moveSpeed;
      }
      if (keyboardControls.ArrowDown) {
        camera.position.z += moveSpeed;
        controls.target.z += moveSpeed;
      }
      if (keyboardControls.w) {
        camera.position.y += moveSpeed;
        controls.target.y += moveSpeed;
      }
      if (keyboardControls.s) {
        camera.position.y -= moveSpeed;
        controls.target.y -= moveSpeed;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Update cleanup
    return () => {
      controls.dispose();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelPath]);

  return (
    <Card className="relative w-full p-1">
      <div ref={mountRef} style={{ width: "100%", height: "500px" }} />
    </Card>
  );
};

export default Bone3D;
