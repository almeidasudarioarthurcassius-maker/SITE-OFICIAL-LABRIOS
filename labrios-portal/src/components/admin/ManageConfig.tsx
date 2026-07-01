"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";

export function ManageConfig() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleUploadSimulation() {
    setStatus("Simulando persistência do PDF no Supabase Storage...");
    setTimeout(() => {
      setStatus("✅ Regimento Interno (PDF) atualizado e indexado com sucesso!");
    }, 1500);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-xl">
      <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider mb-2">
        Gerenciamento do Regimento Interno
      </h3>
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        Envie ou atualize o arquivo em formato PDF do Regimento Interno. O arquivo será armazenado na Storage do Supabase e ficará disponível para download público.
      </p>
      
      <div 
        onClick={handleUploadSimulation} 
        className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-[#003366] hover:bg-gray-50 transition-all"
      >
        <div className="text-3xl mb-2">📁</div>
        <p className="text-sm font-bold text-[#003366]">Clique para selecionar ou arrastar o arquivo PDF</p>
        <p className="text-xs text-gray-400 mt-1">Apenas arquivos compilados .pdf são aceitos</p>
      </div>

      {status && (
        <p className="mt-4 text-xs font-semibold text-[#003366] bg-gray-50 border border-gray-200 p-3 rounded-lg text-center">
          {status}
        </p>
      )}
    </div>
  );
}
