import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  originalRadius: number;
  hue: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseTrailRef = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const radius = Math.random() * 2 + 1;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: radius,
        originalRadius: radius,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 200 // Blue to purple range
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const updateParticles = () => {
      const currentTime = Date.now();
      
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx = -particle.vx;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy = -particle.vy;
        }
        
        // Enhanced mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          const attraction = force * 0.002;
          
          // Attract particles to mouse
          particle.vx += dx * attraction;
          particle.vy += dy * attraction;
          
          // Increase size and brightness when close to mouse
          particle.radius = particle.originalRadius * (1 + force * 2);
          particle.opacity = Math.min(1, particle.opacity + force * 0.5);
          
          // Shift color based on distance
          particle.hue = 200 + (260 - 200) * force;
        } else {
          // Gradually return to original state
          particle.radius = particle.originalRadius;
          particle.opacity = Math.max(0.2, particle.opacity - 0.01);
          particle.hue = 200 + Math.random() * 60;
        }
        
        // Mouse trail interaction
        mouseTrailRef.current.forEach(trailPoint => {
          const trailDx = trailPoint.x - particle.x;
          const trailDy = trailPoint.y - particle.y;
          const trailDistance = Math.sqrt(trailDx * trailDx + trailDy * trailDy);
          const age = currentTime - trailPoint.timestamp;
          
          if (trailDistance < 100 && age < 1000) {
            const trailForce = (100 - trailDistance) / 100 * (1 - age / 1000);
            particle.vx += trailDx * trailForce * 0.001;
            particle.vy += trailDy * trailForce * 0.001;
          }
        });
      });
      
      // Clean up old mouse trail points
      mouseTrailRef.current = mouseTrailRef.current.filter(
        point => currentTime - point.timestamp < 1000
      );
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mouse trail
      if (mouseTrailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(mouseTrailRef.current[0].x, mouseTrailRef.current[0].y);
        
        for (let i = 1; i < mouseTrailRef.current.length; i++) {
          const point = mouseTrailRef.current[i];
          const age = Date.now() - point.timestamp;
          const alpha = Math.max(0, 1 - age / 1000);
          
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `hsla(220, 100%, 70%, ${alpha * 0.3})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      // Draw particles with enhanced colors
      particlesRef.current.forEach(particle => {
        // Add glow effect
        ctx.shadowColor = `hsl(${particle.hue}, 80%, 60%)`;
        ctx.shadowBlur = particle.radius * 3;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });
      
      // Draw enhanced connections
      particlesRef.current.forEach((particle, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = 0.15 * (1 - distance / 120);
            const avgHue = (particle.hue + otherParticle.hue) / 2;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${avgHue}, 70%, 50%, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
      
      // Draw mouse cursor glow
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.fill();
      }
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Add to mouse trail
      mouseTrailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      
      // Keep trail length manageable
      if (mouseTrailRef.current.length > 10) {
        mouseTrailRef.current.shift();
      }
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
