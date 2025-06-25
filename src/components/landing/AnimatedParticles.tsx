
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const AnimatedParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null = null;
    
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) return;
    } catch (error) {
      console.error('Canvas context error:', error);
      return;
    }

    const resizeCanvas = () => {
      try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } catch (error) {
        console.error('Canvas resize error:', error);
      }
    };

    const createParticles = () => {
      try {
        const particles: Particle[] = [];
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
          });
        }
        particlesRef.current = particles;
      } catch (error) {
        console.error('Particle creation error:', error);
      }
    };

    const drawParticles = () => {
      if (!ctx) return;
      
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const particles = particlesRef.current;
        const mouse = mouseRef.current;

        // Draw connections
        ctx.strokeStyle = 'rgba(0, 200, 81, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw particles
        particles.forEach((particle) => {
          // Mouse interaction
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            particle.x += dx * 0.01;
            particle.y += dy * 0.01;
          }

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
          if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 200, 81, ${particle.opacity})`;
          ctx.fill();
        });
      } catch (error) {
        console.error('Drawing error:', error);
      }
    };

    const animate = () => {
      try {
        drawParticles();
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error:', error);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      try {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      } catch (error) {
        console.error('Mouse move error:', error);
      }
    };

    const handleResize = () => {
      try {
        resizeCanvas();
        createParticles();
      } catch (error) {
        console.error('Resize handler error:', error);
      }
    };

    // Initialize
    try {
      resizeCanvas();
      createParticles();
      animate();

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('Initialization error:', error);
    }

    return () => {
      try {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default AnimatedParticles;
