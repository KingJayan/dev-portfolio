import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { particleConfigs, type ParticleConfig } from '@/lib/particleConfig';

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

interface ParticleBackgroundProps {
  config?: ParticleConfig;
}

export default function ParticleBackground({ config }: ParticleBackgroundProps) {
  const [location] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseTrailRef = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);
  
  // Determine which config to use based on location
  const activeConfig = config || (location === '/' ? particleConfigs.home : particleConfigs.other);

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
      const radius = Math.random() * (activeConfig.maxRadius - activeConfig.baseRadius) + activeConfig.baseRadius;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: radius,
        originalRadius: radius,
        opacity: Math.random() * (activeConfig.maxOpacity - activeConfig.baseOpacity) + activeConfig.baseOpacity,
        hue: Math.random() * (activeConfig.colors.maxHue - activeConfig.colors.minHue) + activeConfig.colors.minHue
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(activeConfig.particleCount, Math.floor((canvas.width * canvas.height) / 8000));
      
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
        
        if (distance < activeConfig.mouseInfluenceRadius) {
          const force = (activeConfig.mouseInfluenceRadius - distance) / activeConfig.mouseInfluenceRadius;
          const attraction = force * activeConfig.attractionStrength;
          
          // Attract particles to mouse
          particle.vx += dx * attraction;
          particle.vy += dy * attraction;
          
          // Increase size and brightness when close to mouse
          particle.radius = particle.originalRadius * (1 + force * 2);
          particle.opacity = Math.min(activeConfig.maxOpacity, particle.opacity + force * 0.5);
          
          // Shift color based on distance
          particle.hue = activeConfig.colors.minHue + (activeConfig.colors.maxHue - activeConfig.colors.minHue) * force;
        } else {
          // Gradually return to original state
          particle.radius = particle.originalRadius;
          particle.opacity = Math.max(activeConfig.baseOpacity, particle.opacity - 0.01);
          particle.hue = activeConfig.colors.minHue + Math.random() * (activeConfig.colors.maxHue - activeConfig.colors.minHue);
        }
        
        // Mouse trail interaction
        if (activeConfig.trail.enabled) {
          mouseTrailRef.current.forEach(trailPoint => {
            const trailDx = trailPoint.x - particle.x;
            const trailDy = trailPoint.y - particle.y;
            const trailDistance = Math.sqrt(trailDx * trailDx + trailDy * trailDy);
            const age = currentTime - trailPoint.timestamp;
            
            if (trailDistance < 100 && age < activeConfig.trail.fadeTime) {
              const trailForce = (100 - trailDistance) / 100 * (1 - age / activeConfig.trail.fadeTime);
              particle.vx += trailDx * trailForce * 0.001;
              particle.vy += trailDy * trailForce * 0.001;
            }
          });
        }
      });
      
      // Clean up old mouse trail points
      mouseTrailRef.current = mouseTrailRef.current.filter(
        point => currentTime - point.timestamp < activeConfig.trail.fadeTime
      );
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mouse trail
      if (activeConfig.trail.enabled && mouseTrailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(mouseTrailRef.current[0].x, mouseTrailRef.current[0].y);
        
        for (let i = 1; i < mouseTrailRef.current.length; i++) {
          const point = mouseTrailRef.current[i];
          const age = Date.now() - point.timestamp;
          const alpha = Math.max(0, 1 - age / activeConfig.trail.fadeTime);
          
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `hsla(${activeConfig.colors.minHue}, ${activeConfig.colors.saturation}%, ${activeConfig.colors.lightness}%, ${alpha * 0.3})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      // Draw particles with enhanced colors
      particlesRef.current.forEach(particle => {
        // Add glow effect
        if (activeConfig.glow.enabled) {
          ctx.shadowColor = `hsl(${particle.hue}, ${activeConfig.colors.saturation}%, ${activeConfig.colors.lightness}%)`;
          ctx.shadowBlur = particle.radius * activeConfig.glow.intensity;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, ${activeConfig.colors.saturation}%, ${activeConfig.colors.lightness}%, ${particle.opacity})`;
        ctx.fill();
        
        // Reset shadow
        if (activeConfig.glow.enabled) {
          ctx.shadowBlur = 0;
        }
      });
      
      // Draw enhanced connections
      particlesRef.current.forEach((particle, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < activeConfig.connectionDistance) {
            const opacity = 0.15 * (1 - distance / activeConfig.connectionDistance);
            const avgHue = (particle.hue + otherParticle.hue) / 2;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${avgHue}, ${activeConfig.colors.saturation}%, ${activeConfig.colors.lightness}%, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
      
      // Draw mouse cursor glow
      if (activeConfig.mouseGlow.enabled && mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, activeConfig.mouseGlow.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${activeConfig.colors.minHue}, ${activeConfig.colors.saturation}%, ${activeConfig.colors.lightness}%, ${activeConfig.mouseGlow.opacity})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, activeConfig.mouseGlow.radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${activeConfig.colors.minHue}, ${activeConfig.colors.saturation}%, ${activeConfig.colors.lightness}%, ${activeConfig.mouseGlow.opacity * 2})`;
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
      
      // Add to mouse trail if enabled
      if (activeConfig.trail.enabled) {
        mouseTrailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
        
        // Keep trail length manageable
        if (mouseTrailRef.current.length > activeConfig.trail.maxPoints) {
          mouseTrailRef.current.shift();
        }
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
  }, [location, activeConfig]);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
