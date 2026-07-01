"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";

export function ManageTeam({ data, refresh }: { data: any[]; refresh: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [lattes, setLattes] = useState("");
  const [category, setCategory] = useState<"team" | "management" | "users">("team");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if(!name || !role) return;
    const { error } = await supabase.from("team").insert([{ name, role, lattes_url: lattes, category, image_url: null }]);
    if(!error) {
      setName(""); setRole(""); setLattes(""); setCategory("team");
      refresh();
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("team").delete().eq("id", id);
    refresh();
  }

  return (
    <div class="space-y-6">
      <form onSubmit={handleAdd} class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-navy uppercase tracking-wider mb-2">Adicionar Membro / Comitê</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome Completo" value={name} onChange={e=>setName(e.target.value)} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="text" placeholder="Função / Atribuição" value={role} onChange={e=>setRole(e.target.value)} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="url" placeholder="URL do Currículo Lattes" value={lattes} onChange={e=>setLattes(e.target.value)} class="w-full sm:col-span-2 px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <select value={category} onChange={e=>setCategory(e.target.value as any)} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="team">Equipe Geral</option>
            <option value="management">Comitê Gestor</option>
            <option value="users">Comitê de Usuários</option>
          </select>
        </div>
        <Button type="submit" variant="secondary">Adicionar Membro</Button>
      </form>

      <div class="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full border-collapse text-left text-sm">
          <thead class="bg-navy text-white text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th class="px-6 py-3.5">Nome</th>
              <th class="px-6 py-3.5">Função</th>
              <th class="px-6 py-3.5">Vínculo</th>
              <th class="px-6 py-3.5 text-center">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {data.map((m) => (
              <tr key={m.id} class="hover:bg-gray-50/80">
                <td class="px-6 py-4 font-bold text-navy">{m.name}</td>
                <td class="px-6 py-4 text-gray-600">{m.role}</td>
                <td class="px-6 py-4">
                  <span class={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    m.category === 'management' ? 'bg-purple-100 text-purple-700' : m.category === 'users' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {m.category === 'management' ? 'Gestor' : m.category === 'users' ? 'Usuário' : 'Equipe'}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <Button variant="danger" size="sm" onClick={()=>handleDelete(m.id)}>Remover</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}