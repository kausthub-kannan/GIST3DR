"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Screw3D = ({
  containerWidth = "100%",
  containerHeight = "500px",
  screwHeight = 0.5,
  screwRadius = 0.15,
  headHeight = 0.2,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Get parent container dimensions
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Setup renderer with container dimensions
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Enable transparency
    });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    // Remove or comment out the background color
    // scene.background = new THREE.Color(0xf0f0f0);

    // Setup camera with container aspect ratio
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
    camera.position.z = 1;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Update lighting setup
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8888bb, 1.0); // Increased intensity
    hemisphereLight.position.set(0, 1, 0);
    scene.add(hemisphereLight);

    // Add multiple directional lights for better coverage
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(0, 5, 0);
    scene.add(topLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sideLight.position.set(5, 0, 0);
    scene.add(sideLight);

    // Adjust material properties for better visibility
    const screwMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.7, // Slightly reduced metalness
      roughness: 0.3, // Slightly increased roughness
    });

    // Scale millimeter values to match current scene scale (roughly 1mm = 0.01 units)
    const scaledHeight = screwHeight * 0.01;
    const scaledRadius = screwRadius * 0.01;
    const scaledHeadHeight = headHeight; // Not adjusting the head height

    // Updated screw dimensions using scaled values
    const headRadius = scaledRadius * 1.4;

    // Create screw head with silver material
    const headGeometry = new THREE.CylinderGeometry(
      headRadius,
      headRadius,
      scaledHeadHeight,
      32
    );
    const head = new THREE.Mesh(headGeometry, screwMaterial);
    head.position.y = scaledHeight / 2 + scaledHeadHeight / 2;

    // Create screw body
    const bodyGeometry = new THREE.CylinderGeometry(
      scaledRadius,
      scaledRadius * 0.8,
      scaledHeight,
      32
    );
    const body = new THREE.Mesh(bodyGeometry, screwMaterial);

    // Group all parts together
    const screwGroup = new THREE.Group();
    screwGroup.add(head);
    screwGroup.add(body);

    // Position the screw
    // screwGroup.rotation.x = -Math.PI / 2;
    scene.add(screwGroup);

    // Update animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // screwGroup.rotation.z += 0.01; // Add rotation to see the screw better
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Add window resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [screwHeight, screwRadius, headHeight]);

  return (
    <div
      ref={mountRef}
      style={{
        width: containerWidth,
        height: containerHeight,
        minHeight: containerHeight,
        position: "relative",
      }}
    />
  );
};

export default Screw3D;
