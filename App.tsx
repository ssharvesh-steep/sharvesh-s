import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sky } from '@react-three/drei';
import { SimulationScene } from './components/SimulationScene';
import { RobotOverlay } from './components/RobotOverlay';
import { AIChatPanel } from './components/AIChatPanel';
import { SimulationState } from './types';
import { TrashItem } from './types';

export default function App() {
  const [gameState, setGameState] = useState<SimulationState>('idle');
  const [score, setScore] = useState(0);
  const [battery, setBattery] = useState(100);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize trash items
  useEffect(() => {
    const items: TrashItem[] = [];
    for (let i = 0; i < 20; i++) {
      items.push({
        id: i.toString(),
        position: [
          (Math.random() - 0.5) * 40,
          0,
          (Math.random() - 0.5) * 40
        ],
        collected: false
      });
    }
    setTrashItems(items);
  }, []);

  const handleStart = () => setGameState('running');
  const handleStop = () => setGameState('idle');
  const handleReset = () => {
    setGameState('idle');
    setScore(0);
    setBattery(100);
    setTrashItems(prev => prev.map(item => ({ ...item, collected: false })));
  };

  const handleCollectTrash = (id: string) => {
    setTrashItems(prev => {
      const newItems = [...prev];
      const idx = newItems.findIndex(i => i.id === id);
      if (idx !== -1 && !newItems[idx].collected) {
        newItems[idx].collected = true;
        setScore(s => s + 1);
        return newItems;
      }
      return prev;
    });
  };

  return (
    <div className="relative w-full h-full bg-slate-900">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 60 }}>
          <color attach="background" args={['#87CEEB']} />
          <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          <SimulationScene 
            gameState={gameState}
            trashItems={trashItems}
            onCollectTrash={handleCollectTrash}
            setBattery={setBattery}
          />
          
          <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <RobotOverlay 
        gameState={gameState} 
        score={score} 
        battery={battery}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Chat Panel */}
      {isChatOpen && (
        <AIChatPanel onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}