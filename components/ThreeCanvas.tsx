'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gsap.registerPlugin(ScrollTrigger);

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070e24, 0.002);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 3D Cross Creation ---
    const crossGroup = new THREE.Group();

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x332200,
      emissiveIntensity: 0.5,
    });

    const verticalGeo = new THREE.BoxGeometry(1, 8, 1);
    const verticalBeam = new THREE.Mesh(verticalGeo, goldMaterial);

    const horizontalGeo = new THREE.BoxGeometry(5, 1, 1);
    const horizontalBeam = new THREE.Mesh(horizontalGeo, goldMaterial);
    horizontalBeam.position.y = 1.5;

    crossGroup.add(verticalBeam);
    crossGroup.add(horizontalBeam);

    crossGroup.position.x = window.innerWidth > 768 ? 4 : 0;
    crossGroup.position.z = -5;
    scene.add(crossGroup);

    // --- Particles (Cinematic Dust) ---
    const particleCount = window.innerWidth > 768 ? 1500 : 500;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMaterial);
    scene.add(particlesMesh);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffd700, 1.5);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x0055ff, 2, 50);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // --- Scroll Interaction (GSAP) ---
    const rotateTrigger = gsap.to(crossGroup.rotation, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
      x: Math.PI * 0.5,
      y: Math.PI * 2,
      z: Math.PI * 0.2,
    });

    const moveTrigger = gsap.to(crossGroup.position, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
      y: -10,
      z: -15,
    });

    // --- Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerWidth > 768) {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initial scale animation
    crossGroup.scale.set(0, 0, 0);
    const scaleTrigger = gsap.to(crossGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: 'elastic.out(1, 0.7)',
      delay: 0.5,
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle floating
      crossGroup.position.y += Math.sin(elapsedTime * 2) * 0.005;

      // Parallax
      crossGroup.rotation.x += (mouseY * 0.5 - crossGroup.rotation.x) * 0.05;
      crossGroup.rotation.y += (mouseX * 0.5 - crossGroup.rotation.y) * 0.05;

      // Particles loop
      particlesMesh.rotation.y = elapsedTime * 0.02;
      particlesMesh.position.y = (elapsedTime * 0.5) % 25;

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      crossGroup.position.x = window.innerWidth > 768 ? 4 : 0;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      rotateTrigger.kill();
      moveTrigger.kill();
      scaleTrigger.kill();
      renderer.dispose();
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
