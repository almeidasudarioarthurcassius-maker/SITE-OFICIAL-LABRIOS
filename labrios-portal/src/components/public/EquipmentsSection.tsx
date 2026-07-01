"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

interface Equipment {
  id: string; name: string; brand: string; model: string; purpose: string; image_url: string | null; quantity: number;
}

export function EquipmentsSection({ data }: { data: Equipment[] }) {
  const [selected, setSelected] = useState<Equipment | null>(null);

  return (
    <section id="equipamentos" class="py-20 bg-white">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <span class="text-xs font-bold tracking-widest text-green uppercase block mb-2">Estrutura Científica</span>
        <h2 class="text-3xl font-extrabold text-navy mb-3">Equipamentos Disponíveis</h2>
        <div class="w-12 h-1 bg-green rounded-sm mb-10" />

        <div class="w-full overflow-x-auto rounded-xl border border-gray-200">
          <table class="w-full border-collapse text-left text-sm">
            <thead class="bg-navy text-white text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th class="px-6 py-4">Equipamento</th>
                <th class="px-6 py-4">Marca / Modelo</th>
                <th class="px-6 py-4">Finalidade Analítica</th>
                <th class="px-6 py-4 text-center">Disponível</th>
                <th class="px-6 py-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              {data.map((eq) => (
                <tr key={eq.id} class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-bold text-navy">{eq.name}</td>
                  <td class="px-6 py-4 text-gray-600">{eq.brand} <span class="block text-xs text-gray-400">{eq.model}</span></td>
                  <td class="px-6 py-4 text-gray-500 max-w-xs truncate">{eq.purpose}</td>
                  <td class="px-6 py-4 text-center font-semibold text-gray-700">{eq.quantity} un.</td>
                  <td class="px-6 py-4 text-center">
                    <Button variant="outline" size="sm" onClick={() => setSelected(eq)}>Reservar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog isOpen={!!selected} onClose={() => setSelected(null)} title={`Reserva - ${selected?.name}`}>
        <p class="text-sm text-gray-600 mb-4">
          Conforme instruído em nossa especificação regulamentar, as coletas de dados cadastrais e as agendas de reservas oficiais devem ser processadas externamente através do formulário institucional unificado.
        </p>
        <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center mb-6">
          <p class="text-xs text-gray-400 font-semibold uppercase mb-1">Link de Agendamento</p>
          <a href="https://forms.google.com" target="_blank" rel="noreferrer" class="text-green hover:underline font-bold text-sm break-all">
            Abrir Formulário Externo de Reservas (Google Forms)
          </a>
        </div>
        <div class="flex justify-end">
          <Button variant="primary" onClick={() => setSelected(null)}>Fechar</Button>
        </div>
      </Dialog>
    </section>
  );
}