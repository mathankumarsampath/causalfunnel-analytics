import React, { useRef, useEffect } from 'react';

const HeatmapCanvas = ({ clicks, width = 1000, height = 800 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !clicks.length) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Group clicks by proximity to create "heat" density
    const radius = 25;
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // blue
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    clicks.forEach((click) => {
      ctx.save();
      ctx.translate(click.x, click.y);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sharp center point
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(click.x, click.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [clicks]);

  return (
    <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-inner overflow-auto max-h-[600px]">
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
      <div 
        className="relative mx-auto bg-white/5 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default HeatmapCanvas;
