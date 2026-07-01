"use client";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";

export function ManageReservations({ data, refresh }: { data: any[]; refresh: () => void }) {
  async function handleApprove(id: string) {
    await supabase.from("reservations").update({ status: "approved" }).eq("id", id);
    refresh();
  }

  async function handleReject(id: string) {
    await supabase.from("reservations").delete().eq("id", id);
    refresh();
  }

  return (
    <div class="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="bg-navy text-white text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th class="px-6 py-3.5">Equipamento</th>
            <th class="px-6 py-3.5">Solicitante</th>
            <th class="px-6 py-3.5">Instituição / Vínculo</th>
            <th class="px-6 py-3.5">Data / Horário</th>
            <th class="px-6 py-3.5">Status</th>
            <th class="px-6 py-3.5 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr><td colSpan={6} class="text-center py-8 text-gray-400">Nenhuma solicitação pendente no banco de dados.</td></tr>
          ) : data.map((res) => (
            <tr key={res.id} class="hover:bg-gray-50/80">
              <td class="px-6 py-4 font-bold text-navy">{res.equipment?.name}</td>
              <td class="px-6 py-4 text-gray-700 font-medium">{res.requester_name} <span class="block text-xs text-gray-400">{res.role}</span></td>
              <td class="px-6 py-4 text-gray-500">{res.institution}</td>
              <td class="px-6 py-4 text-gray-600 font-medium">
                {res.date}
                <span class="block text-xs text-green font-bold">{res.start_time.substring(0,5)}h - {res.end_time.substring(0,5)}h</span>
              </td>
              <td class="px-6 py-4">
                <span class={`px-2 py-0.5 text-xs font-bold rounded-full ${res.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {res.status === 'approved' ? 'Aprovado' : 'Pendente'}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex gap-2 justify-center">
                  {res.status === "pending" && (
                    <Button variant="secondary" size="sm" onClick={()=>handleApprove(res.id)}>Aprovar</Button>
                  )}
                  <Button variant="danger" size="sm" onClick={()=>handleReject(res.id)}>Remover</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
