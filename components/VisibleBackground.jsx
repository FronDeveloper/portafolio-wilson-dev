"use client";

import { useEffect, useRef } from "react";

export default function VisibleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 4 + 2;
        // Colores visibles: dorado, blanco, gris claro
        const colors = ["#C2B280", "#E8D5A3", "#FFFFFF", "#A09060"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote en bordes con efecto suave
        if (this.x < 0) {
          this.x = 0;
          this.vx *= -0.9;
        }
        if (this.x > canvas.width) {
          this.x = canvas.width;
          this.vx *= -0.9;
        }
        if (this.y < 0) {
          this.y = 0;
          this.vy *= -0.9;
        }
        if (this.y > canvas.height) {
          this.y = canvas.height;
          this.vy *= -0.9;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        // Brillo alrededor
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Dibujar líneas entre partículas cercanas
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 180;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / maxDistance) * 0.6;
            ctx.strokeStyle = `rgba(194, 178, 128, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawConnections();
      
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ 
        pointerEvents: "none",
        display: "block"
      }}
    />
  );
}