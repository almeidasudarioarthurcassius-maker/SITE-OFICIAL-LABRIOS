"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { ManageEquipments } from "@/components/admin/ManageEquipments";
import { ManageTeam } from "@/components/admin/ManageTeam";
import { ManageReservations } from "@/components/admin/ManageReservations";
import { ManageConfig } from "@/components/admin/ManageConfig";

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState("dashboard");

  const [equipments, setEquipments] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [rulesCount, setRulesCount] = useState(0);

  useEffect(() => {
    const session = localStorage.getItem("labrios-admin-session");
    if (!session) {
      router.push("/login");
    } else {
      setAuthorized(true);
      fetchAdminData();
    }
  }, [router]);

  async function fetchAdminData() {
    const { data: eq } = await supabase.from("equipments").select("*");
    const { data: tm } = await supabase.from("team").select("*");
    const { data: res } = await supabase.from("reservations").select("*, equipment:equipments(name)");
    const { count: rl } = await supabase.from("rules").select("*", { count: "exact", head: true });

    setEquipments(eq || []);
    setTeam(tm || []);
    setReservations(res || []);
    setRulesCount(rl || 0);
  }

  function handleLogout() {
    localStorage.removeItem("labrios-admin-session");
    router.push("/login");
  }

  if (!authorized) return null;

  return (
    <div class="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <AdminSidebar currentTab={tab} setTab={setTab} onLogout={handleLogout} />
      
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <div class="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
          <h1 class="text-xl font-extrabold text-navy uppercase tracking-wider">
            {tab === "dashboard" && "Visão Geral do Sistema"}
            {tab === "equipments" && "Gerenciamento de Equipamentos"}
            {tab === "team" && "Controle de Membros e Comitês"}
            {tab === "reservations" && "Homologação de Reservas"}
            {tab === "rules" && "Diretrizes e Regras Operacionais"}
            {tab === "config" && "Upload de Documentos"}
          </h1>
        </div>

        {tab === "dashboard" && (
          <div>
            <DashboardStats counts={{ equipments: equipments.length, team: team.length, reservations: reservations.length, rules: rulesCount }} />
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-sm font-bold text-navy uppercase tracking-wider mb-2">Boas-vindas ao Painel do Coordenador</h3>
              <p class="text-xs text-gray-500 leading-relaxed">
                Utilize o menu lateral para gerenciar as rotinas científicas do LABRIOS/CESP. Alterações de equipamentos, comitês ou homologações de agendas efetuadas aqui refletirão instantaneamente no portal público.
              </p>
            </div>
          </div>
        )}

        {tab === "equipments" && <ManageEquipments data={equipments} refresh={fetchAdminData} />}
        {tab === "team" && <ManageTeam data={team} refresh={fetchAdminData} />}
        {tab === "reservations" && <ManageReservations data={reservations} refresh={fetchAdminData} />}
        {tab === "rules" && (
          <p class="text-xs text-gray-400 border border-dashed p-6 rounded-xl text-center bg-white">
            Interface padrão de inserção de texto CRUD simplificado para regras operacionais.
          </p>
        )}
        {tab === "config" && <ManageConfig />}
      </main>
    </div>
  );
}