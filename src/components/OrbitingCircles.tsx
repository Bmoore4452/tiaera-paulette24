import React from 'react';

type OrbitingCirclesProps = {
  className?: string;
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  /** Horizontal anchor of the orbit center (CSS length/percentage). Default '50%'. */
  originX?: string;
  /** Vertical anchor of the orbit center (CSS length/percentage). Default '50%'. */
  originY?: string;
};

export default function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 40,
  speed = 1,
  originX = '50%',
  originY = '50%',
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  const items = React.Children.toArray(children);

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-bone/10"
            strokeWidth="1"
            cx={originX}
            cy={originY}
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {items.map((child, index) => {
        const angle = (360 / items.length) * index;
        return (
          <div
            key={index}
            style={
              {
                '--duration': calculatedDuration,
                '--radius': radius,
                '--angle': angle,
                left: originX,
                top: originY,
                width: iconSize,
                height: iconSize,
                animationDirection: reverse ? 'reverse' : 'normal',
              } as React.CSSProperties
            }
            className={[
              'animate-orbit absolute flex transform-gpu items-center justify-center rounded-full',
              className ?? '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
