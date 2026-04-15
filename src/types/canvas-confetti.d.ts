declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    colors?: string[];
    ticks?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    scalar?: number;
    shapes?: ('circle' | 'square' | 'star' | 'triangle')[];
    zIndex?: number;
    disableForReducedMotion?: boolean;
    useWorker?: boolean;
    resize?: boolean;
  }

  export interface ConfettiInstance {
   (opts?: Options): Promise<void> | void;
    reset(): void;
  }

  export default function confetti(opts?: Options): Promise<void> | void;
  export namespace confetti {
    export function create(canvas?: HTMLCanvasElement): ConfettiInstance;
  }
}
