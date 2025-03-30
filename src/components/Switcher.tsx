"use client";

import React, { useRef, useEffect, useState } from 'react';
import '../styles/Switcher.css';

interface SwitcherOption {
  value: string;
  label: string;
}

interface SwitcherProps {
  options: SwitcherOption[];
  value: string;
  onChange: (value: string) => void;
}

const Switcher: React.FC<SwitcherProps> = ({ options, value, onChange }) => {
  const [switcherRect, setSwitcherRect] = useState({ left: 0, width: 0 });
  const switcherRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeButton = switcherRefs.current.find(
      (ref) => ref?.classList.contains('active')
    );
    if (activeButton) {
      setSwitcherRect({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [value]);

  return (
    <div className="switcher">
      <div 
        className="switcher-background" 
        style={{ 
          left: switcherRect.left,
          width: switcherRect.width 
        }} 
      />
      {options.map((option, index) => (
        <button 
          key={option.value}
          ref={(el) => { switcherRefs.current[index] = el }}
          className={`switcher-item ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Switcher;
