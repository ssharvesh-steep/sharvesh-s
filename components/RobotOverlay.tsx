import React from 'react';
import { Play, Square, RotateCcw, Battery, MessageSquareText, Cpu, Info } from 'lucide-react';
import { SimulationState } from '../types';

interface Props {
  gameState: SimulationState;
  score: number;
  battery: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onToggleChat: () => void;
}

export const RobotOverlay: React.FC<Props> = ({ 
  gameState, score, battery, onStart, onStop, onReset, onToggleChat 
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl text-white border border-slate-700 shadow-xl pointer-events-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="text-blue-400" /> EcoBot Sim
          </h1>
          <p className="text-slate-400 text-sm">Autonomous Surface Cleaning Unit</p>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
               <p className="text-slate-500 uppercase text-xs font-bold">Trash Collected</p>
               <p className="text-2xl font-mono text-green-400">{score} kg</p>
            </div>
            <div>
               <p className="text-slate-500 uppercase text-xs font-bold">Status</p>
               <p className={`text-2xl font-mono ${gameState === 'running' ? 'text-blue-400' : 'text-yellow-400'}`}>
                 {gameState === 'running' ? 'ACTIVE' : 'STANDBY'}
               </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
         <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl text-white border border-slate-700 shadow-xl max-w-xs pointer-events-auto hidden md:block">
            <h3 className="font-bold border-b border-slate-700 pb-2 mb-2 flex items-center gap-2">
                <Info size={16} /> Component Diagnostics
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between">
                    <span>Main Body:</span> <span className="text-white">Polystyrene Foam</span>
                </li>
                <li className="flex justify-between">
                    <span>Propulsion:</span> <span className="text-white">Dual Paddle (5V DC)</span>
                </li>
                <li className="flex justify-between">
                    <span>Sensors:</span> <span className="text-white">HC-SR04 Ultrasonic</span>
                </li>
                <li className="flex justify-between">
                    <span>Collection:</span> <span className="text-white">Passive Flow Net</span>
                </li>
            </ul>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl flex gap-4 items-center">
          {gameState === 'idle' ? (
            <button 
              onClick={onStart}
              className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg flex items-center gap-2 transition-all"
            >
              <Play size={20} fill="currentColor" /> Start Mission
            </button>
          ) : (
            <button 
              onClick={onStop}
              className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-lg flex items-center gap-2 transition-all"
            >
              <Square size={20} fill="currentColor" /> Stop
            </button>
          )}
          
          <button 
            onClick={onReset}
            className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-all"
            title="Reset Simulation"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex gap-4 items-center">
            {/* Battery Indicator */}
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white flex items-center gap-3">
                <Battery size={24} className={battery < 20 ? 'text-red-500' : 'text-green-500'} />
                <div>
                    <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${battery < 20 ? 'bg-red-500' : 'bg-green-500'} transition-all duration-500`} 
                            style={{ width: `${battery}%` }}
                        />
                    </div>
                    <p className="text-xs text-center mt-1 text-slate-400">{Math.round(battery)}% Power</p>
                </div>
            </div>

            {/* Chat Toggle */}
            <button 
                onClick={onToggleChat}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-xl transition-all animate-bounce-slow"
            >
                <MessageSquareText size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};