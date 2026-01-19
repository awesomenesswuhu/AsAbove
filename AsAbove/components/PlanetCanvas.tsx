"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Planet3D from "./Planet3D";

interface PlanetCanvasProps {
  textureUrl: string;
  normalMapUrl?: string;
  isHovered: boolean;
  rotationSpeed?: number;
  atmosphere?: boolean;
  glowColor?: string;
  planetSize?: number;
}

export default function PlanetCanvas({
  textureUrl,
  normalMapUrl,
  isHovered,
  rotationSpeed = 0.5,
  atmosphere = false,
  glowColor,
  planetSize = 1,
}: PlanetCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      <Suspense fallback={null}>
        <Planet3D
          textureUrl={textureUrl}
          normalMapUrl={normalMapUrl}
          isHovered={isHovered}
          rotationSpeed={rotationSpeed}
          atmosphere={atmosphere}
          glowColor={glowColor}
          size={planetSize}
        />
      </Suspense>
      
      {/* Disable orbit controls - we want manual rotation on hover only */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}
