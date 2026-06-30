import React from 'react';

export function Table({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        {children}
      </table>
    </div>
  );
}