import React, { useEffect, useRef } from 'react';

const CanvasAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            if (canvas && canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };

        // Initial resize/wait for layout
        setTimeout(resize, 0);
        window.addEventListener('resize', resize);

        let points = [
            { x: 50, y: 50 }, { x: 150, y: 30 }, { x: 200, y: 100 },
            { x: 120, y: 120 }, { x: 40, y: 90 }
        ];
        let center = { x: 100, y: 70, angle: 0, rX: 40, rY: 30 };

        const render = () => {
            if (!canvas) return;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);
            center.angle += 0.02;
            center.x = 100 + Math.cos(center.angle) * center.rX;
            center.y = 70 + Math.sin(center.angle) * center.rY;

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < points.length; i++) {
                let next = points[(i + 1) % points.length];
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(center.x, center.y);
                ctx.stroke();
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            points.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.beginPath();
            ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="canvas-container" style={{ width: '100%', height: '120px', marginBottom: '16px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default CanvasAnimation;
