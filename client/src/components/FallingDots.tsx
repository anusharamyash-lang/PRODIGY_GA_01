import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
  shimmer: number;
  shimmerSpeed: number;
}

const COLORS = [
  "0, 200, 255",   // cyan
  "56, 189, 248",  // sky blue
  "96, 165, 250",  // blue
  "147, 197, 253", // light blue
  "255, 255, 255", // white
  "186, 230, 253", // pale cyan
  "34, 211, 238",  // bright cyan
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

    const createDot = (): Dot => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.8 + 0.1,
      opacitySpeed: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shimmer: Math.random(),
      shimmerSpeed: Math.random() * 0.02 + 0.005,
    });

    dotsRef.current = Array.from({ length: 120 }, createDot);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dotsRef.current.forEach((dot) => {
        dot.y += dot.speed;
        dot.shimmer += dot.shimmerSpeed;

        const glowOpacity = dot.opacity * (0.6 + 0.4 * Math.sin(dot.shimmer * Math.PI * 2));

        if (dot.y > canvas.height) {
          dot.y = -5;
          dot.x = Math.random() * canvas.width;
        }

        dot.opacity += dot.opacitySpeed;
        if (dot.opacity > 0.95 || dot.opacity < 0.05) {
          dot.opacitySpeed *= -1;
        }

        // Draw glowing dot
        const gradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dot.size * 3
        );
        gradient.addColorStop(0, `rgba(${dot.color}, ${glowOpacity})`);
        gradient.addColorStop(0.4, `rgba(${dot.color}, ${glowOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${dot.color}, 0)`);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw bright core
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${glowOpacity * 0.9})`;
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
      style={{ opacity: 0.85 }}
    />
  );
}
