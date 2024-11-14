"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeJS3DRender = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
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

    // Create screw body
    const screwHeight = 0.2;
    const screwRadius = 0.03;

    // Create screw head
    const headHeight = 0.04;
    const headRadius = screwRadius * 1.8;
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
      screwRadius * 0.8, // Slightly tapered end
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

    // Cleanup function
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeJS3DRender;
