export type SimulationState = 'idle' | 'running';

export interface TrashItem {
  id: string;
  position: [number, number, number];
  collected: boolean;
}

export interface RobotProps {
  position: [number, number, number];
  rotation: [number, number, number];
  paddleSpeed: number;
}