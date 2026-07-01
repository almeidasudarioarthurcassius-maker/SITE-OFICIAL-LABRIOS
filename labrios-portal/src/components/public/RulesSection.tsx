import React from "react";
import { Download, BookmarkCheck } from "lucide-react";

interface Rule { id: string; content: string; }

export function RulesSection({ data }: { data: Rule[] }) {
  return (
    <section id="regras" class="py-20 bg-gray-50">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <span class="text-xs font-bold tracking-widest text-green uppercase block mb-2">Normativas de Acesso</span>
        <h2 class="text-3xl font-extrabold text-navy mb-3">Como Utilizar o Laboratório</h2>
        <div class="w-12 h-1 bg-green rounded-sm mb-10" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div class="lg:col-span-2 space-y-4">
            {data.length === 0 ? (
              <p class="text-sm text-gray-500">As regras institucionais e diretrizes gerais estão em processo de catalogação pelo coordenador.</p>
            ) : data.map((r, i) => (
              <div key={r.id} class="bg-white p-5 rounded-xl border border-gray-200 flex gap-4 items-start shadow-sm">
                <div class="bg-green/10 text-green rounded-lg p-2 shrink-0">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <p class="text-sm text-gray-700 leading-relaxed pt-0.5">{r.content}</p>
              </div>
            ))}
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div class="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">PDF</div>
            <h3 class="text-base font-bold text-navy mb-1">Regimento Interno Oficial</h3>
            <p class="text-xs text-gray-500 mb-6">Consulte o documento normativo contendo todas as resoluções e atribuições do LABRIOS/CESP.</p>
            <a href="/api/download-regimento" target="_blank" class="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-dark text-white font-bold text-sm py-3 rounded-lg transition-all shadow-sm">
              <Download className="w-4 h-4" /> Baixar Regimento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}