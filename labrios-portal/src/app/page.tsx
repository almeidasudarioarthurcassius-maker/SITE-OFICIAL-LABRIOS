import React from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { QuickAccess } from "@/components/QuickAccess";
import { EquipmentsSection } from "@/components/public/EquipmentsSection";
import { TeamSection } from "@/components/public/TeamSection";
import { CommitteeSection } from "@/components/public/CommitteeSection";
import { RulesSection } from "@/components/public/RulesSection";
import { PublicAgenda } from "@/components/public/PublicAgenda";

export const revalidate = 0; // Garante dados em tempo real

export default async function Home() {
  const { data: equipments } = await supabase.from("equipments").select("*").order("name");
  const { data: teamMembers } = await supabase.from("team").select("*").order("name");
  const { data: rules } = await supabase.from("rules").select("*").order("created_at");
  const { data: agenda } = await supabase.from("reservations").select("*, equipment:equipments(name)").eq("status", "approved").order("date");

  const coreTeam = teamMembers?.filter(m => m.category === "team") || [];
  const committeeMembers = teamMembers?.filter(m => m.category !== "team") || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />
        <QuickAccess />
        <TeamSection data={coreTeam} />
        <RulesSection data={rules || []} />
        <EquipmentsSection data={equipments || []} />
        <PublicAgenda data={agenda as any || []} />
        <CommitteeSection data={committeeMembers} />
      </main>

      <footer class="bg-navy-dark text-white/85 pt-16 pb-6">
        <div class="max-w-[1280px] w-full mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <h4 class="text-white text-sm font-bold border-b-2 border-green inline-block pb-1.5 mb-4 uppercase tracking-wider">LABRIOS / CESP</h4>
              <p class="text-xs text-white/70 leading-relaxed">
                Bloco 3 - Prédio Francisco de Assis Serrão Dinelly<br />
                Mestrado Profissional ProfÁgua — UEA<br />
                Rua Odovaldo Novo s/n, Djard Vieira<br />
                CEP: 69152-470 — Parintins / AM
              </p>
            </div>
            <div>
              <h4 class="text-white text-sm font-bold border-b-2 border-green inline-block pb-1.5 mb-4 uppercase tracking-wider">Área de Atuação</h4>
              <p class="text-xs text-white/70 leading-relaxed">
                Planejamento e Qualidade Ambiental. Atividades de pesquisa, desenvolvimento e amostragem estruturada de parâmetros físicos, químicos e microbiológicos da água.
              </p>
            </div>
            <div>
              <h4 class="text-white text-sm font-bold border-b-2 border-green inline-block pb-1.5 mb-4 uppercase tracking-wider">Contatos do Responsável</h4>
              <p class="text-xs text-white/70 leading-relaxed">
                <strong>Responsável:</strong> Rafael Jovito Souza<br />
                <strong>E-mail institucional:</strong> rjovito@uea.edu.br<br />
                <strong>Unidade:</strong> Centro de Estudos Superiores de Parintins
              </p>
            </div>
          </div>
          <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 gap-4">
            <p>&copy; {new Date().getFullYear()} LABRIOS / CESP. Todos os direitos reservados.</p>
            <p>Créditos de Produção: <span class="text-white/70 font-semibold">LABORATÓRIO DE TECNOLOGIA DA INFORMAÇÃO DO PROFÁGUA – LTIP</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}