import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Page not found.</p>
      <Link 
        to="/" 
        style={{ 
          background: 'var(--accent-indigo)', 
          color: '#fff', 
          padding: '0.6rem 1.2rem', 
          borderRadius: '8px', 
          textDecoration: 'none' 
        }}
      >
        Return Home
      </Link>
    </div>
  );
}