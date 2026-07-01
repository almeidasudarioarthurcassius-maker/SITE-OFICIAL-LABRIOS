"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export function ManageTeam({ data, refresh }: { data: any[]; refresh: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [lattes, setLattes] = useState("");
  const [category, setCategory] = useState<"team" | "management" | "users">("team");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !role) return;

    // Correção do TypeScript utilizando asserção de tipo para evitar erro de tabela como 'never'
    const client = supabase.from("team") as any;
    const { error } = await client.insert([
      { name, role, lattes_url: lattes, category, image_url: null }
    ]);

    if (!error) {
      setName(""); setRole(""); setLattes(""); setCategory("team");
      refresh();
    }
  }

  async function handleDelete(id: string) {
    // Correção do TypeScript utilizando asserção de tipo para evitar erro de tabela como 'never'
    const client = supabase.from("team") as any;
    await client.delete().eq("id", id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#003366] uppercase tracking-wider mb-2">Adicionar Membro / Comitê</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="text" placeholder="Função / Atribuição" value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="url" placeholder="URL do Currículo Lattes" value={lattes} onChange={e => setLattes(e.target.value)} className="w-full sm:col-span-2 px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="team">Equipe Geral</option>
            <option value="management">Comitê Gestor</option>
            <option value="users">Comitê de Usuários</option>
          </select>
        </div>
        <button 
          type="submit"
          className="bg-[#003366] text-white hover:bg-[#002244] transition-all px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
        >
          Adicionar Membro
        </button>
      </form>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#003366] text-white text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-3.5">Nome</th>
              <th className="px-6 py-3.5">Função</th>
              <th className="px-6 py-3.5">Vínculo</th>
              <th className="px-6 py-3.5 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4 font-bold text-[#003366]">{m.name}</td>
                <td className="px-6 py-4 text-gray-600">{m.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    m.category === 'management' ? 'bg-purple-100 text-purple-700' : m.category === 'users' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {m.category === 'management' ? 'Gestor' : m.category === 'users' ? 'Usuário' : 'Equipe'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
