'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  interactive?: boolean;
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function BackgroundGradientAnimation({
  gradientBackgroundStart = 'rgb(90, 14, 140)',
  gradientBackgroundEnd = 'rgb(10, 18, 70)',
  firstColor = '40, 100, 220',
  secondColor = '180, 80, 210',
  thirdColor = '100, 180, 220',
  fourthColor = '170, 70, 90',
  fifthColor = '150, 150, 70',
  pointerColor = '130, 100, 210',
  size = '80%',
  blendingValue = 'hard-light',
  interactive = true,
  children,
  className,
  containerClassName,
}: BackgroundGradientAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Set CSS custom properties on the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--gradient-background-start', gradientBackgroundStart);
    el.style.setProperty('--gradient-background-end', gradientBackgroundEnd);
    el.style.setProperty('--first-color', firstColor);
    el.style.setProperty('--second-color', secondColor);
    el.style.setProperty('--third-color', thirdColor);
    el.style.setProperty('--fourth-color', fourthColor);
    el.style.setProperty('--fifth-color', fifthColor);
    el.style.setProperty('--pointer-color', pointerColor);
    el.style.setProperty('--size', size);
    el.style.setProperty('--blending-value', blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  // Mouse-tracking pointer blob with rAF lerp
  useEffect(() => {
    if (!interactive || reduced) return;
    const pointerEl = pointerRef.current;
    if (!pointerEl) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let rafId: number;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      pointerEl!.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      rafId = requestAnimationFrame(move);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = pointerEl!.getBoundingClientRect();
      tgX = e.clientX - rect.left;
      tgY = e.clientY - rect.top;
    }

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(move);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [interactive, reduced]);

  // Static gradient fallback for reduced motion
  if (reduced) {
    return (
      <div
        className={cn('relative overflow-hidden', containerClassName)}
        style={{
          background: `linear-gradient(135deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
        }}
      >
        <div className={cn('relative z-10', className)}>{children}</div>
      </div>
    );
  }

  const blobBase: React.CSSProperties = {
    position: 'absolute',
    left: 'calc(50% - var(--size) / 2)',
    top: 'calc(50% - var(--size) / 2)',
    width: 'var(--size)',
    height: 'var(--size)',
    borderRadius: '50%',
    mixBlendMode: blendingValue as React.CSSProperties['mixBlendMode'],
  };

  const blob = (
    color: string,
    animation: string,
    transformOrigin: string
  ): React.CSSProperties => ({
    ...blobBase,
    background: `radial-gradient(circle at center, rgba(${color}, 0.5) 0, rgba(${color}, 0) 50%) no-repeat`,
    transformOrigin,
    animation,
  });

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', containerClassName)}>
      {/* SVG blur filter */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gradient background */}
      <div
        className="gradient-bg-animate absolute inset-0"
        style={{
          background: `linear-gradient(40deg, var(--gradient-background-start), var(--gradient-background-end))`,
        }}
      >
        <div className="absolute inset-0" style={{ filter: 'url(#blurMe) blur(40px)' }}>
          <div
            style={blob('var(--first-color)', 'moveVertical 50s ease infinite', 'center center')}
          />
          <div
            style={blob(
              'var(--second-color)',
              'moveInCircle 35s reverse infinite',
              'calc(50% - 400px)'
            )}
          />
          <div
            style={blob(
              'var(--third-color)',
              'moveInCircle 60s linear infinite',
              'calc(50% + 400px)'
            )}
          />
          <div
            style={blob(
              'var(--fourth-color)',
              'moveHorizontal 60s ease infinite',
              'calc(50% - 200px)'
            )}
          />
          <div
            style={blob(
              'var(--fifth-color)',
              'moveInCircle 35s ease infinite',
              'calc(50% - 800px) calc(50% + 800px)'
            )}
          />
          {interactive && (
            <div
              ref={pointerRef}
              style={{
                position: 'absolute',
                left: '-50%',
                top: '-50%',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                opacity: 0.4,
                mixBlendMode: blendingValue as React.CSSProperties['mixBlendMode'],
                background: `radial-gradient(circle at center, rgba(var(--pointer-color), 0.5) 0, rgba(var(--pointer-color), 0) 50%) no-repeat`,
              }}
            />
          )}
        </div>
      </div>

      {/* Content overlay */}
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}
