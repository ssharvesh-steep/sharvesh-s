import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export const Trash: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Bobbing effect
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2 + position[0]) * 0.1;
      // Rotation
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
    }
  });

  const colors = ["#ef4444", "#3b82f6", "#eab308", "#10b981"];
  const randomColor = colors[Math.floor(Math.abs(position[0] * 100)) % colors.length];

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {/* A simple crushed bottle shape or random box */}
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={randomColor} />
    </mesh>
  );
};