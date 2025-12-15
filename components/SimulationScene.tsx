import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotModel } from './RobotModel';
import { Trash } from './Trash';
import { SimulationState, TrashItem } from '../types';
import { Group, Vector3 } from 'three';

interface Props {
  gameState: SimulationState;
  trashItems: TrashItem[];
  onCollectTrash: (id: string) => void;
  setBattery: React.Dispatch<React.SetStateAction<number>>;
}

export const SimulationScene: React.FC<Props> = ({ gameState, trashItems, onCollectTrash, setBattery }) => {
  const robotRef = useRef<Group>(null);
  const [robotPos, setRobotPos] = useState<Vector3>(new Vector3(0, 0, 0));
  const [robotRot, setRobotRot] = useState(0); // Y rotation in radians
  const [targetRot, setTargetRot] = useState(0);
  const speed = 3.5; // units per second
  
  // Bounds for the "pond"
  const BOUNDS = 20;

  useFrame((state, delta) => {
    if (gameState !== 'running' || !robotRef.current) return;

    // 1. Movement Logic
    // Smoothly rotate towards target
    const currentRot = robotRot;
    let newRot = currentRot;
    
    if (Math.abs(targetRot - currentRot) > 0.01) {
       newRot = currentRot + (targetRot - currentRot) * delta * 2;
    } else {
       newRot = targetRot;
    }

    // Calculate forward vector
    const dx = Math.sin(newRot) * speed * delta;
    const dz = Math.cos(newRot) * speed * delta;

    // New Position
    let nextX = robotPos.x - dx; // -sin for forward in 3D usually depending on model orientation. 
    // Our model faces -Z. So forward is -Z. 
    // If rot is 0, we want to go -Z.
    // dx = sin(0) = 0. dz = cos(0) = 1.
    // pos.z -= dz (goes negative). Correct.
    let nextZ = robotPos.z - dz;

    // 2. Obstacle Avoidance (Simple Boundary Check)
    // If we hit a wall, pick a new random direction
    if (Math.abs(nextX) > BOUNDS || Math.abs(nextZ) > BOUNDS) {
        // Simple "bounce" logic: Rotate 90-180 degrees
        const turn = Math.PI / 2 + Math.random() * Math.PI; 
        setTargetRot(prev => prev + turn);
        // Clamp to avoid sticking
        if (nextX > BOUNDS) nextX = BOUNDS - 0.5;
        if (nextX < -BOUNDS) nextX = -BOUNDS + 0.5;
        if (nextZ > BOUNDS) nextZ = BOUNDS - 0.5;
        if (nextZ < -BOUNDS) nextZ = -BOUNDS + 0.5;
    }

    setRobotRot(newRot);
    setRobotPos(new Vector3(nextX, 0, nextZ));

    // Update Ref
    robotRef.current.position.set(nextX, 0, nextZ);
    robotRef.current.rotation.y = newRot;

    // 3. Collision Detection (Trash Collection)
    // The Conveyor Intake is at the front. Local position roughly [0, 0, -2.2].
    // We transform this to world space.
    const netOffset = new Vector3(0, 0, -2.2).applyAxisAngle(new Vector3(0, 1, 0), newRot);
    const netWorldPos = new Vector3(nextX, 0, nextZ).add(netOffset);

    trashItems.forEach(item => {
      if (!item.collected) {
        const itemPos = new Vector3(...item.position);
        // Increased collection radius slightly due to wider wings
        if (itemPos.distanceTo(netWorldPos) < 1.8) { 
            onCollectTrash(item.id);
        }
      }
    });

    // 4. Battery Drain
    setBattery(prev => Math.max(0, prev - delta * 0.5)); // 200 seconds to drain
  });

  return (
    <group>
      {/* Water Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.1} opacity={0.8} transparent />
      </mesh>
      
      {/* Grid Helper for scale reference */}
      <gridHelper args={[100, 50, 0x111111, 0x053e6b]} position={[0, -0.4, 0]} />

      {/* The Robot */}
      <group ref={robotRef} position={[0, 0, 0]}>
        <RobotModel paddleSpeed={gameState === 'running' ? 5 : 0} />
      </group>

      {/* Trash Items */}
      {trashItems.map(item => (
        !item.collected && (
          <Trash key={item.id} position={item.position} />
        )
      ))}
    </group>
  );
};