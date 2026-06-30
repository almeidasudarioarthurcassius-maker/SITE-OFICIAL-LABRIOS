import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
}

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  const bg = variant === 'success' ? 'var(--green)' : variant === 'danger' ? '#C62828' : 'var(--navy)';
  return (
    <button
      style={{
        background: bg, color: 'white', border: 'none', padding: '10px 18px',
        borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', fontSize: '14px', ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}