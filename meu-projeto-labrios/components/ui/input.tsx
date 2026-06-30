import React from 'react';

export function Input({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={{
        padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)',
        fontSize: '14px', width: '100%', outline: 'none', ...style
      }}
      {...props}
    />
  );
}