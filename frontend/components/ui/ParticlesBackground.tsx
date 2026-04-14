'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  targetSize: number;
  opacity: number;
  opacityDir: number;
  color: string;
  shape: 'circle' | 'star';
}

const COLORS = ['#ffffff', '#ffd700', '#ff69b4', '#87ceeb'];
const PARTICLE_COUNT = 80;
const MAX_LINK_DISTANCE = 150;
const GRAB_DISTANCE = 140;
const BASE_SPEED = 2;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  const spikes = 5;
  const inner = r * 0.45;
  let angle = -Math.PI / 2;
  const step = Math.PI / spikes;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? r : inner;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    angle += step;
  }
  ctx.closePath();
}

function makeParticle(w: number, h: number): Particle {
  const speed = rand(0.3, BASE_SPEED);
  const angle = rand(0, Math.PI * 2);
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: rand(1, 5),
    targetSize: rand(0.5, 5),
    opacity: rand(0.1, 0.6),
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() > 0.5 ? 'circle' : 'star',
  };
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(canvas.width, canvas.height),
    );

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 4; i++) {
        const p = makeParticle(canvas.width, canvas.height);
        p.x = e.clientX;
        p.y = e.clientY;
        particles.current.push(p);
      }
      if (particles.current.length > PARTICLE_COUNT + 80) {
        particles.current.splice(0, 4);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    const tick = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const ps = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // ── Update & draw particles ──────────────────────────────────────────
      for (const p of ps) {
        // Mouse attract (grab mode)
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < GRAB_DISTANCE && d > 0) {
          const force = (1 - d / GRAB_DISTANCE) * 0.04;
          p.vx += dx * force * 0.05;
          p.vy += dy * force * 0.05;
        }

        // Clamp speed
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > BASE_SPEED * 2) {
          p.vx = (p.vx / spd) * BASE_SPEED * 2;
          p.vy = (p.vy / spd) * BASE_SPEED * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Animate opacity
        p.opacity += p.opacityDir * 0.004;
        if (p.opacity >= 0.6) { p.opacity = 0.6; p.opacityDir = -1; }
        if (p.opacity <= 0.1) { p.opacity = 0.1; p.opacityDir = 1; }

        // Animate size toward target
        const diff = p.targetSize - p.size;
        p.size += diff * 0.005;
        if (Math.abs(diff) < 0.05) p.targetSize = rand(0.5, 5);

        // Draw
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Draw connecting lines ────────────────────────────────────────────
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist >= MAX_LINK_DISTANCE) continue;

          let alpha = 0.2 * (1 - dist / MAX_LINK_DISTANCE);

          // Boost opacity when near mouse (grab highlight)
          const mi = Math.hypot(mx - ps[i].x, my - ps[i].y);
          if (mi < GRAB_DISTANCE) {
            alpha = Math.min(alpha + 0.3 * (1 - mi / GRAB_DISTANCE), 0.5);
          }

          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ps[i].x, ps[i].y);
          ctx.lineTo(ps[j].x, ps[j].y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
