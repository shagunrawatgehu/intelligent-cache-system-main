import React from 'react';
import { Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Cpu size={20} />
        </div>
        <span>CachePredict OS</span>
      </div>
    </nav>
  );
}