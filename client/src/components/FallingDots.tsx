import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  twinkle: number;
  twinkleSpeed: number;
}

const COLORS = [
  "0, 220, 255",
  "100, 200, 255",
  "180, 230, 255",
  "255, 255, 255",
  "50, 180, 255",
];

export function FallingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const makeDot = (startAnywhere = false): Dot => ({
      x: Math.random() * (canvas.width || 800),
      y: startAnywhere ? Math.random() * (canvas.height || 100) : -4,
      size: Math.random() * 1.5 + 0.4,
      speed: Math.random() * 0.6 + 0.15,
      opacity: Math.random() * 0.7 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
    });

    dotsRef.current = Array.from({ length: 150 }, () => makeDot(true));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dotsRef.current.forEach((dot, i) => {
        dot.y += dot.speed;
        dot.twinkle += dot.twinkleSpeed;

        const alpha = dot.opacity * (0.5 + 0.5 * Math.sin(dot.twinkle));

        if (dot.y > canvas.height + 4) {
          dotsRef.current[i] = makeDot(false);
          return;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot.color}, ${alpha})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
