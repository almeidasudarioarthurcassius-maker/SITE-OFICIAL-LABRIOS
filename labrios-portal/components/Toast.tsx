'use client';
// components/Toast.tsx
import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  onDone?: () => void;
};

export default function Toast({ message, type = 'error', onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible || !message) return null;

  return (
    <div className={`toast show ${type === 'success' ? 'success' : ''}`} role="alert">
      {type === 'success' ? '✅ ' : '⚠️ '}
      {message}
    </div>
  );
}
