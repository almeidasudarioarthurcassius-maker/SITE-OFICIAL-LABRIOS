import React from "react";
import { User } from "lucide-react";

interface Member {
  id: string; name: string; role: string; lattes_url: string; image_url: string | null;
}

export function TeamSection({ data }: { data: Member[] }) {
  return (
    <section id="equipe" class="py-20 bg-gray-50">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <span class="text-xs font-bold tracking-widest text-green uppercase block mb-2">Corpo Científico</span>
        <h2 class="text-3xl font-extrabold text-navy mb-3">Pesquisadores e Equipe</h2>
        <div class="w-12 h-1 bg-green rounded-sm mb-10" />

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((m) => (
            <div key={m.id} class="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-all">
              <div class="w-20 h-20 rounded-full bg-navy text-white mx-auto mb-4 flex items-center justify-center font-black text-2xl overflow-hidden border-2 border-gray-100">
                {m.image_url ? <img src={m.image_url} alt={m.name} class="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
              </div>
              <h3 class="text-base font-bold text-navy mb-1">{m.name}</h3>
              <p class="text-xs text-gray-500 mb-4">{m.role}</p>
              <a href={m.lattes_url} target="_blank" rel="noreferrer" class="inline-flex items-center gap-1 px-4 py-1.5 border border-navy text-navy rounded-full text-xs font-bold hover:bg-navy hover:text-white transition-all">
                Currículo Lattes
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}