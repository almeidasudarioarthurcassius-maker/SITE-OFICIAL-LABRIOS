import * as React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-navy text-white font-semibold text-xs uppercase tracking-wider">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-4 font-semibold">{children}</th>;
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-gray-700 vertical-middle">{children}</td>;
}