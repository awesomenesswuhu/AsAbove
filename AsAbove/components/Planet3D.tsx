"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Mesh, DoubleSide } from "three";
import * as THREE from "three";

interface Planet3DProps {
  textureUrl: string;
  normalMapUrl?: string;
  isHovered: boolean;
  rotationSpeed?: number;
  atmosphere?: boolean;
  glowColor?: string;
  size?: number;
}

export default function Planet3D({
  textureUrl,
  normalMapUrl,
  isHovered,
  rotationSpeed = 0.5,
  atmosphere = false,
  glowColor = "#FFB347",
  size = 1,
}: Planet3DProps) {
  const meshRef = useRef<Mesh>(null);
  const atmosphereRef = useRef<Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null);

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  }, [textureUrl]);

  // Load normal map if provided
  useEffect(() => {
    if (normalMapUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        normalMapUrl,
        (loadedNormal) => {
          loadedNormal.wrapS = THREE.RepeatWrapping;
          loadedNormal.wrapT = THREE.RepeatWrapping;
          setNormalMap(loadedNormal);
        },
        undefined,
        (error) => {
          console.error("Error loading normal map:", error);
        }
      );
    }
  }, [normalMapUrl]);

  // Rotate planet on hover
  useFrame((_, delta) => {
    if (meshRef.current) {
      if (isHovered) {
        meshRef.current.rotation.y += rotationSpeed * delta;
      } else {
        // Slow idle rotation
        meshRef.current.rotation.y += 0.1 * delta;
      }
    }

    // Rotate atmosphere slightly slower for depth effect
    if (atmosphereRef.current && atmosphere) {
      if (isHovered) {
        atmosphereRef.current.rotation.y += (rotationSpeed * 0.8) * delta;
      }
    }
  });

  return (
    <>
      {/* Main Planet Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={texture || undefined}
          normalMap={normalMap || undefined}
          metalness={0.3}
          roughness={0.7}
          side={DoubleSide}
        />
      </mesh>

      {/* Atmospheric Glow Effect */}
      {atmosphere && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[size * 1.05, 64, 64]} />
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
            side={DoubleSide}
          />
        </mesh>
      )}
    </>
  );
}
