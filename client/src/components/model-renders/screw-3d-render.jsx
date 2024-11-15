"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Screw3DRender = ({
  containerWidth = "100%",
  containerHeight = "500px",
  screwHeight = 0.2,
  screwRadius = 0.03,
  headHeight = 0.04,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Get parent container dimensions
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Setup renderer with container dimensions
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Setup camera with container aspect ratio
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
    camera.position.z = 2;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // Add directional light for better shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Updated screw dimensions using props
    const headRadius = screwRadius * 1.8;

    // Create screw head
    const headGeometry = new THREE.CylinderGeometry(
      headRadius,
      headRadius,
      headHeight,
      32
    );
    const screwMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.8,
      roughness: 0.3,
    });
    const head = new THREE.Mesh(headGeometry, screwMaterial);
    head.position.y = screwHeight / 2 + headHeight / 2;

    // Create screw body
    const bodyGeometry = new THREE.CylinderGeometry(
      screwRadius,
      screwRadius * 0.8,
      screwHeight,
      32
    );
    const body = new THREE.Mesh(bodyGeometry, screwMaterial);

    // Group all parts together
    const screwGroup = new THREE.Group();
    screwGroup.add(head);
    screwGroup.add(body);

    // Position the screw
    screwGroup.rotation.x = -Math.PI / 2;
    scene.add(screwGroup);

    // Update animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      screwGroup.rotation.z += 0.01; // Add rotation to see the screw better
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

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
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

export default Screw3DRender;
