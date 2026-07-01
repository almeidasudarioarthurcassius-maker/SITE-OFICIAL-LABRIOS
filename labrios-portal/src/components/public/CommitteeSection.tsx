import React from "react";
import { UserCheck } from "lucide-react";

interface Member {
  id: string; name: string; role: string; lattes_url: string; image_url: string | null; category: string;
}

export function CommitteeSection({ data }: { data: Member[] }) {
  const management = data.filter(m => m.category === "management");
  const users = data.filter(m => m.category === "users");

  return (
    <section id="comites" class="py-20 bg-white">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <span class="text-xs font-bold tracking-widest text-green uppercase block mb-2">Conselhos Reguladores</span>
        <h2 class="text-3xl font-extrabold text-navy mb-3">Comitês Institucionais</h2>
        <div class="w-12 h-1 bg-green rounded-sm mb-12" />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 class="text-lg font-bold text-navy mb-6 pb-2 border-b-2 border-green inline-block">Comitê Gestor</h3>
            <div class="space-y-4">
              {management.length === 0 ? <p class="text-sm text-gray-400">Nenhum membro gestor listado.</p> : management.map(m => (
                <div key={m.id} class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div class="w-11 h-11 bg-navy rounded-full text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                    {m.image_url ? <img src={m.image_url} alt={m.name} class="w-full h-full object-cover" /> : <UserCheck className="w-5 h-5" />}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-navy truncate">{m.name}</h4>
                    <p class="text-xs text-gray-500 truncate">{m.role}</p>
                  </div>
                  <a href={m.lattes_url} target="_blank" rel="noreferrer" class="text-xs text-green hover:underline font-bold shrink-0">Lattes</a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-navy mb-6 pb-2 border-b-2 border-green inline-block">Comitê de Usuários</h3>
            <div class="space-y-4">
              {users.length === 0 ? <p class="text-sm text-gray-400">Nenhum membro de usuário listado.</p> : users.map(m => (
                <div key={m.id} class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div class="w-11 h-11 bg-navy rounded-full text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                    {m.image_url ? <img src={m.image_url} alt={m.name} class="w-full h-full object-cover" /> : <UserCheck className="w-5 h-5" />}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-navy truncate">{m.name}</h4>
                    <p class="text-xs text-gray-500 truncate">{m.role}</p>
                  </div>
                  <a href={m.lattes_url} target="_blank" rel="noreferrer" class="text-xs text-green hover:underline font-bold shrink-0">Lattes</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}