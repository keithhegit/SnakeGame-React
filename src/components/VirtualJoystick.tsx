import React, { useEffect, useRef, useState } from 'react';
import { Direction } from '../types/game';

interface VirtualJoystickProps {
  onDirectionChange: (direction: Direction | null) => void;
  size?: number;
  gridBottom?: number;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onDirectionChange,
  size = 180,
  gridBottom = 0
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    isVisible: false,
    touchPosition: { x: 0, y: 0 },
    basePosition: { x: 0, y: 0 }
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (rect) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setState(prev => ({
        ...prev,
        basePosition: { x, y },
        touchPosition: { x, y },
        isVisible: true
      }));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!state.isVisible) return;

    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (rect) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // 计算与基准点的距离和角度
      const deltaX = x - state.basePosition.x;
      const deltaY = y - state.basePosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

      // 减小最大移动范围到size/5
      const maxDistance = size / 5;
      const newTouchPosition = { x, y };
      
      if (distance > maxDistance) {
        const ratio = maxDistance / distance;
        newTouchPosition.x = state.basePosition.x + deltaX * ratio;
        newTouchPosition.y = state.basePosition.y + deltaY * ratio;
      }

      setState(prev => ({
        ...prev,
        touchPosition: newTouchPosition
      }));

      // 减小死区范围到size/20，扩大方向判定角度
      let direction: Direction | null = null;
      if (distance > size / 20) {  // 更小的死区
        // 扩大判定角度并添加重叠区域
        if (angle > -50 && angle <= 50) direction = Direction.Right;
        else if (angle > 40 && angle <= 140) direction = Direction.Down;
        else if (angle > 130 || angle <= -130) direction = Direction.Left;
        else if (angle <= -40 || angle > 140) direction = Direction.Up;
      }
      onDirectionChange(direction);
    }
  };

  const handleTouchEnd = () => {
    setState(prev => ({
      ...prev,
      isVisible: false
    }));
    onDirectionChange(null);
  };

  return (
    <div
      ref={joystickRef}
      className={`relative touch-none select-none ${state.isVisible ? 'opacity-70' : 'opacity-40'}`}
      style={{
        width: size,
        height: size,
        transform: 'translateY(-50%)',
        zIndex: 1000
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 底盘 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="absolute top-0 left-0"
      >
        {/* 外圈 */}
        <circle
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke="#4169E1"
          strokeWidth="4"
          className="opacity-60"
        />
        
        {/* 方向指示器 */}
        <g className="opacity-70">
          <path d="M100,20 L90,40 H110 Z" fill="#4169E1" /> {/* 上 */}
          <path d="M180,100 L160,90 V110 Z" fill="#4169E1" /> {/* 右 */}
          <path d="M100,180 L110,160 H90 Z" fill="#4169E1" /> {/* 下 */}
          <path d="M20,100 L40,110 V90 Z" fill="#4169E1" /> {/* 左 */}
        </g>
      </svg>

      {/* 操控点 */}
      {state.isVisible && (
        <div
          className="absolute w-10 h-10 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-70"
          style={{
            left: state.touchPosition.x,
            top: state.touchPosition.y,
            transition: 'all 0.06s ease-out'
          }}
        />
      )}
    </div>
  );
}; 