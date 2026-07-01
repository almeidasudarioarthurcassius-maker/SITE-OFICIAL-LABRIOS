"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";

export function ManageEquipments({ data, refresh }: { data: any[]; refresh: () => void }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [quantity, setQuantity] = useState(1);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if(!name || !brand || !model) return;
    const { error } = await supabase.from("equipments").insert([{ name, brand, model, purpose, quantity, image_url: null }]);
    if(!error) {
      setName(""); setBrand(""); setModel(""); setPurpose(""); setQuantity(1);
      refresh();
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("equipments").delete().eq("id", id);
    refresh();
  }

  return (
    <div class="space-y-6">
      <form onSubmit={handleAdd} class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 class="text-sm font-bold text-navy uppercase tracking-wider mb-2">Cadastrar Novo Equipamento</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="text" placeholder="Nome do Equipamento" value={name} onChange={e=>setName(e.target.value)} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="text" placeholder="Marca" value={brand} onChange={e=>setBrand(e.target.value)} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="text" placeholder="Modelo" value={model} onChange={e=>setModel(e.target.value)} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input type="text" placeholder="Finalidade Analítica" value={purpose} onChange={e=>setPurpose(e.target.value)} class="w-full sm:col-span-3 px-4 py-2 border border-gray-200 rounded-lg text-sm" />
          <input type="number" min="1" placeholder="Qtd" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <Button type="submit" variant="secondary">Salvar Equipamento</Button>
      </form>

      <div class="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full border-collapse text-left text-sm">
          <thead class="bg-navy text-white text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th class="px-6 py-3.5">Nome</th>
              <th class="px-6 py-3.5">Marca / Modelo</th>
              <th class="px-6 py-3.5">Quantidade</th>
              <th class="px-6 py-3.5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {data.map((eq) => (
              <tr key={eq.id} class="hover:bg-gray-50/80">
                <td class="px-6 py-4 font-bold text-navy">{eq.name}</td>
                <td class="px-6 py-4 text-gray-600">{eq.brand} ({eq.model})</td>
                <td class="px-6 py-4 font-medium">{eq.quantity} un.</td>
                <td class="px-6 py-4 text-center">
                  <Button variant="danger" size="sm" onClick={()=>handleDelete(eq.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}