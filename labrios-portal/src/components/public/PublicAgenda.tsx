import React from "react";
import { CalendarDays } from "lucide-react";

interface Reservation {
  id: string; date: string; start_time: string; end_time: string; requester_name: string; institution: string; equipment: { name: string };
}

export function PublicAgenda({ data }: { data: Reservation[] }) {
  return (
    <section id="agenda" class="py-20 bg-white">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <span class="text-xs font-bold tracking-widest text-green uppercase block mb-2">Transparência Temporal</span>
        <h2 class="text-3xl font-extrabold text-navy mb-3">Agenda e Reservas Aprovadas</h2>
        <div class="w-12 h-1 bg-green rounded-sm mb-10" />

        {data.length === 0 ? (
          <div class="text-center py-12 border border-dashed border-gray-200 rounded-xl">
            <p class="text-sm text-gray-400">Nenhuma alocação ou reserva homologada para os próximos dias.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((res) => (
              <div key={res.id} class="bg-gray-50 border border-gray-200 rounded-xl p-5 flex gap-4 items-start">
                <div class="bg-navy text-white text-center rounded-lg p-2.5 shrink-0 font-bold min-w-[64px]">
                  <CalendarDays className="w-4 h-4 mx-auto mb-1 text-green-accent" />
                  <span class="block text-[11px] uppercase font-semibold text-white/70">Data</span>
                  <span class="text-xs">{new Date(res.date + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-navy truncate">{res.equipment?.name}</h4>
                  <p class="text-xs font-semibold text-green mt-0.5">{res.start_time.substring(0,5)}h às {res.end_time.substring(0,5)}h</p>
                  <div class="mt-3 pt-2 border-t border-gray-200/60 text-[11px] text-gray-500 leading-tight">
                    <span class="block font-medium text-gray-700 truncate">Resp: {res.requester_name}</span>
                    <span class="block text-gray-400 truncate mt-0.5">{res.institution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}