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
    camera.position.y = 0;
    camera.position.z = 1.3;

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
      metalness: 0.7,
      roughness: 0.3,
    });

    const scaledHeight = screwHeight * 0.01;
    const scaledRadius = screwRadius * 0.01;
    const scaledHeadHeight = headHeight;

    const headRadius = scaledRadius * 1.4;

    const headGeometry = new THREE.CylinderGeometry(
      headRadius,
      headRadius,
      scaledHeadHeight,
      32
    );
    const head = new THREE.Mesh(headGeometry, screwMaterial);
    head.position.y = scaledHeight / 2 + scaledHeadHeight / 2;

    const bodyGeometry = new THREE.CylinderGeometry(
      scaledRadius,
      scaledRadius * 0.8,
      scaledHeight,
      32
    );
    const body = new THREE.Mesh(bodyGeometry, screwMaterial);

    const screwGroup = new THREE.Group();
    screwGroup.add(head);
    screwGroup.add(body);
    scene.add(screwGroup);

    // Function to create text labels using THREE.Sprite
    const createTextSprite = (text, position) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = "Bold 20px Arial";
      context.fillStyle = "white";
      context.fillText(text, 10, 50);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(position.x, position.y, position.z);
      sprite.scale.set(0.7, 0.5, 1); // Adjust scale based on your scene
      return sprite;
    };

    // Add height label
    const heightLabel = createTextSprite(
      `Height: ${screwHeight}mm`,
      new THREE.Vector3(0, scaledHeight + 0.1, 0)
    );
    scene.add(heightLabel);

    // Add width label
    const widthLabel = createTextSprite(
      `Width: ${(screwRadius * 2) / 2}mm`,
      new THREE.Vector3(scaledRadius * 3, 0, 0.2)
    );
    scene.add(widthLabel);

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