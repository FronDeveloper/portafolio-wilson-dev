"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo de partículas.
 * - Se pausa cuando la pestaña está oculta.
 * - Respeta `prefers-reduced-motion` (dibuja un solo cuadro estático).
 * - Densidad y DPR limitados para no castigar móviles.
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const COLORS = ["#C2B280", "#D4C5A0", "#B8A870"];
    const CONNECTION_DISTANCE = 140;
    const MAX_DPR = 1.5;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    let running = false;
    let resizeTimer;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3.5 + 1.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) {
          this.vx *= -1;
          this.x = Math.max(0, Math.min(width, this.x));
        }
        if (this.y < 0 || this.y > height) {
          this.vy *= -1;
          this.y = Math.max(0, Math.min(height, this.y));
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        // Brillo sutil alrededor (se dibuja una sola vez)
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    const particleCount = () => {
      if (width < 640) return 18;
      if (width < 1024) return 32;
      return Math.min(60, Math.round((width * height) / 26000));
    };

    const initParticles = () => {
      particles = [];
      const total = particleCount();
      for (let i = 0; i < total; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(194, 178, 128, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const drawFrame = (animate) => {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        if (animate) particle.update();
        particle.draw();
      }
      drawConnections();
    };

    const frame = () => {
      if (!running) return;
      drawFrame(true);
      animationId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceQuery.matches || document.hidden) return;
      running = true;
      animationId = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles();
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        if (reduceQuery.matches) {
          stop();
          drawFrame(false);
        }
      }, 150);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const handleReduceMotion = () => {
      stop();
      if (reduceQuery.matches) {
        drawFrame(false);
      } else {
        start();
      }
    };

    resizeCanvas();

    if (reduceQuery.matches) {
      drawFrame(false);
    } else {
      start();
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceQuery.addEventListener("change", handleReduceMotion);

    return () => {
      clearTimeout(resizeTimer);
      stop();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceQuery.removeEventListener("change", handleReduceMotion);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-full"
      style={{
        pointerEvents: "none",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}
