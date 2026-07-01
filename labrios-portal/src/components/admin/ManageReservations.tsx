"use client";
import React from "react";
import { supabase } from "@/lib/supabase";

export function ManageReservations({ data, refresh }: { data: any[]; refresh: () => void }) {
  async function handleApprove(id: string) {
    // Forçando o cast para 'any' para evitar que o TypeScript infira o tipo como 'never'
    const client = supabase.from("reservations") as any;
    await client.update({ status: "approved" }).eq("id", id);
    refresh();
  }

  async function handleReject(id: string) {
    // Forçando o cast para 'any' para evitar que o TypeScript infira o tipo como 'never'
    const client = supabase.from("reservations") as any;
    await client.delete().eq("id", id);
    refresh();
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[#003366] text-white text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-6 py-3.5">Equipamento</th>
            <th className="px-6 py-3.5">Solicitante</th>
            <th className="px-6 py-3.5">Instituição / Vínculo</th>
            <th className="px-6 py-3.5">Data / Horário</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                Nenhuma solicitação pendente no banco de dados.
              </td>
            </tr>
          ) : (
            data.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4 font-bold text-[#003366]">{res.equipment?.name}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {res.requester_name} <span className="block text-xs text-gray-400">{res.role}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{res.institution}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {res.date}
                  <span className="block text-xs text-[#2E7D32] font-bold">
                    {res.start_time?.substring(0, 5)}h - {res.end_time?.substring(0, 5)}h
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${res.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {res.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    {res.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleApprove(res.id)}
                        className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all px-3 py-1.5 rounded text-xs font-semibold"
                      >
                        Aprovar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleReject(res.id)}
                      className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all px-3 py-1.5 rounded text-xs font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
