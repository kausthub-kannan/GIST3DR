"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

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

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    const screwHeight = 0.2;
    const screwRadius = 0.03;

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

    const bodyGeometry = new THREE.CylinderGeometry(
      screwRadius,
      screwRadius * 0.8,
      screwHeight,
      32
    );
    const body = new THREE.Mesh(bodyGeometry, screwMaterial);

    const screwGroup = new THREE.Group();
    screwGroup.add(head);
    screwGroup.add(body);

    screwGroup.rotation.x = -Math.PI / 2;
    screwGroup.position.set(0, 0, -1);
    scene.add(screwGroup);

    document.body.appendChild(ARButton.createButton(renderer));

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      if (renderer.domElement) document.body.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
};

export default ThreeJSARRender;
