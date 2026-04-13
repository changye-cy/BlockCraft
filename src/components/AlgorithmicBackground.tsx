import { useEffect, useRef, useState } from 'react';

const AlgorithmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for interactive effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Algorithmic art parameters (highly optimized for performance)
    const params = {
      seed: 12345,
      particleCount: 20, // Further reduced from 50 to 20
      noiseScale: 0.01,
      noiseSpeed: 0.0015,
      particleSize: 1, // Reduced from 2 to 1
      trailLength: 10, // Further reduced from 30 to 10
      mouseInfluence: 50
    };

    // Simple seeded random function
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Particles array with enhanced properties
    const particles: { 
      x: number; 
      y: number; 
      angle: number; 
      speed: number; 
      history: { x: number; y: number }[];
      color: string;
      size: number;
    }[] = [];

    // Brand colors (hardcoded to avoid performance issues)
    const brandColors = {
      orange: '#d97757', // --color-orange
      blue: '#6a9bcc', // --color-blue
      green: '#788c5d' // --color-green
    };

    // Initialize particles with brand colors
    for (let i = 0; i < params.particleCount; i++) {
      const colorIndex = i % 3;
      let color;
      switch (colorIndex) {
        case 0:
          color = brandColors.orange;
          break;
        case 1:
          color = brandColors.blue;
          break;
        case 2:
          color = brandColors.green;
          break;
        default:
          color = brandColors.blue;
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
        history: [],
        color: color,
        size: params.particleSize + Math.random() * 2
      });
    }

    // Perlin noise function (simplified)
    const noise = (x: number, y: number, z: number) => {
      // Simple noise implementation for demonstration
      const hash = (x: number) => {
        x = ((x >> 16) ^ x) * 0x45d9f3b;
        x = ((x >> 16) ^ x) * 0x45d9f3b;
        x = (x >> 16) ^ x;
        return x;
      };

      const fractional = (x: number) => x - Math.floor(x);
      const interpolate = (a: number, b: number, t: number) => a + (b - a) * t;

      const intX = Math.floor(x);
      const intY = Math.floor(y);
      const intZ = Math.floor(z);

      const fracX = fractional(x);
      const fracY = fractional(y);
      const fracZ = fractional(z);

      const value000 = hash(intX + hash(intY + hash(intZ)));
      const value001 = hash(intX + hash(intY + hash(intZ + 1)));
      const value010 = hash(intX + hash(intY + 1 + hash(intZ)));
      const value011 = hash(intX + hash(intY + 1 + hash(intZ + 1)));
      const value100 = hash(intX + 1 + hash(intY + hash(intZ)));
      const value101 = hash(intX + 1 + hash(intY + hash(intZ + 1)));
      const value110 = hash(intX + 1 + hash(intY + 1 + hash(intZ)));
      const value111 = hash(intX + 1 + hash(intY + 1 + hash(intZ + 1)));

      const interpolatedX00 = interpolate(value000, value100, fracX);
      const interpolatedX01 = interpolate(value001, value101, fracX);
      const interpolatedX10 = interpolate(value010, value110, fracX);
      const interpolatedX11 = interpolate(value011, value111, fracX);

      const interpolatedY0 = interpolate(interpolatedX00, interpolatedX10, fracY);
      const interpolatedY1 = interpolate(interpolatedX01, interpolatedX11, fracY);

      return interpolate(interpolatedY0, interpolatedY1, fracZ);
    };

    let frame = 0;
    let lastAnimationTime = 0;
    const animationInterval = 16; // ~60fps

    const animate = (timestamp: number) => {
      // Throttle animation to ~60fps
      if (timestamp - lastAnimationTime < animationInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastAnimationTime = timestamp;

      // Clear canvas with semi-transparent background to create trails
      ctx.fillStyle = 'rgba(250, 249, 245, 0.1)'; // Using brand light color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate mouse influence once per frame
      const mouseX = mousePosition.x;
      const mouseY = mousePosition.y;

      particles.forEach(particle => {
        // Calculate distance to mouse
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add mouse influence
        if (distance < params.mouseInfluence) {
          const force = (params.mouseInfluence - distance) / params.mouseInfluence;
          particle.x += (dx / distance) * force * 2;
          particle.y += (dy / distance) * force * 2;
        }

        // Update particle position based on noise
        const noiseValue = noise(
          particle.x * params.noiseScale,
          particle.y * params.noiseScale,
          frame * params.noiseSpeed
        );

        particle.angle = noiseValue * Math.PI * 2;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update history
        particle.history.push({ x: particle.x, y: particle.y });
        if (particle.history.length > params.trailLength) {
          particle.history.shift();
        }

        // Draw particle head only (simplified further)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      frame++;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mousePosition]);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default AlgorithmicBackground;