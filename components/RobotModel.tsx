import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface RobotModelProps {
  paddleSpeed: number; // Rad/s
}

export const RobotModel: React.FC<RobotModelProps> = ({ paddleSpeed }) => {
  const leftPaddleRef = useRef<Group>(null);
  const rightPaddleRef = useRef<Group>(null);
  const conveyorCleatsRef = useRef<Group>(null);

  useFrame((state, delta) => {
    // 1. Paddle Animation
    if (leftPaddleRef.current && rightPaddleRef.current) {
      leftPaddleRef.current.rotation.x -= paddleSpeed * delta;
      rightPaddleRef.current.rotation.x -= paddleSpeed * delta;
    }

    // 2. Conveyor Belt Animation
    // Move the cleats up the ramp to simulate a moving belt
    if (conveyorCleatsRef.current && paddleSpeed > 0) {
        const speed = 1.5; // Belt speed
        const loopLimit = 1.2; // Top boundary
        const resetPos = -1.2; // Bottom boundary

        conveyorCleatsRef.current.children.forEach((cleat) => {
            cleat.position.y += delta * speed;
            if (cleat.position.y > loopLimit) {
                cleat.position.y = resetPos;
            }
        });
    }
  });

  const styrofoamColor = "#f0f0f0";
  const woodColor = "#d2b48c";
  const beltColor = "#1f2937"; // Dark grey rubber
  const cleatColor = "#4b5563"; // Lighter grey plastic/metal
  const sensorColor = "#3b82f6";
  const solarColor = "#111827";

  return (
    <group>
      {/* Main Body - Styrofoam Cooler */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 2]} />
        <meshStandardMaterial color={styrofoamColor} roughness={0.9} />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.1, 2.1]} />
        <meshStandardMaterial color={styrofoamColor} roughness={0.9} />
      </mesh>

      {/* Solar Panel */}
      <mesh position={[0, 1.11, 0.2]} rotation={[-Math.PI / 64, 0, 0]}>
        <boxGeometry args={[1.2, 0.02, 1.2]} />
        <meshStandardMaterial color={solarColor} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Ultrasonic Sensor Head */}
      <group position={[0, 1.15, -0.9]}>
         {/* Sensor box mount */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.2]} />
            <meshStandardMaterial color={styrofoamColor} />
        </mesh>
        {/* Left Eye */}
        <mesh position={[-0.15, 0, -0.11]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[-0.15, 0, -0.14]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial color="silver" />
        </mesh>
        {/* Right Eye */}
        <mesh position={[0.15, 0, -0.11]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05]} />
            <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.15, 0, -0.14]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02]} />
            <meshStandardMaterial color="silver" />
        </mesh>
      </group>

      {/* Conveyor Belt Mechanism (Replacing Net) */}
      <group position={[0, 0.45, -1.4]} rotation={[Math.PI / 3.5, 0, 0]}>
         {/* Side Rails */}
         <mesh position={[-0.6, 0, 0]}>
             <boxGeometry args={[0.08, 2.4, 0.1]} />
             <meshStandardMaterial color={woodColor} />
         </mesh>
         <mesh position={[0.6, 0, 0]}>
             <boxGeometry args={[0.08, 2.4, 0.1]} />
             <meshStandardMaterial color={woodColor} />
         </mesh>
         
         {/* Rubber Belt */}
         <mesh position={[0, 0, -0.02]}>
             <boxGeometry args={[1.1, 2.4, 0.05]} />
             <meshStandardMaterial color={beltColor} roughness={0.8} />
         </mesh>
         
         {/* Moving Cleats */}
         <group ref={conveyorCleatsRef}>
            {[-1.0, -0.3, 0.4, 1.1].map((y, i) => (
                <mesh key={i} position={[0, y, 0.03]}>
                    <boxGeometry args={[1.0, 0.05, 0.05]} />
                    <meshStandardMaterial color={cleatColor} />
                </mesh>
            ))}
         </group>
      </group>
      
      {/* Intake Guide Wings (The Gap Guide) */}
      <group position={[0, -0.1, -2.1]}>
           <mesh position={[-0.8, 0, 0]} rotation={[0, -Math.PI/5, 0]}>
              <boxGeometry args={[0.8, 0.4, 0.05]} />
              <meshStandardMaterial color={styrofoamColor} />
           </mesh>
           <mesh position={[0.8, 0, 0]} rotation={[0, Math.PI/5, 0]}>
              <boxGeometry args={[0.8, 0.4, 0.05]} />
              <meshStandardMaterial color={styrofoamColor} />
           </mesh>
      </group>

      {/* Left Paddle Wheel */}
      <group ref={leftPaddleRef} position={[-0.85, 0.4, 0]}>
         <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={woodColor} />
         </mesh>
         {[0, 45, 90, 135].map((angle) => (
             <mesh key={angle} rotation={[angle * Math.PI / 180, 0, 0]}>
                 <boxGeometry args={[0.1, 1.2, 0.05]} />
                 <meshStandardMaterial color={woodColor} />
             </mesh>
         ))}
      </group>

      {/* Right Paddle Wheel */}
      <group ref={rightPaddleRef} position={[0.85, 0.4, 0]}>
         <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={woodColor} />
         </mesh>
         {[0, 45, 90, 135].map((angle) => (
             <mesh key={angle} rotation={[angle * Math.PI / 180, 0, 0]}>
                 <boxGeometry args={[0.1, 1.2, 0.05]} />
                 <meshStandardMaterial color={woodColor} />
             </mesh>
         ))}
      </group>
    </group>
  );
};