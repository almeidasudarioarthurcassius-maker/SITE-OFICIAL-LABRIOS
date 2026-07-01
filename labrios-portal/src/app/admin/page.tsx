"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { DashboardStats } from "../../components/admin/DashboardStats";
import { ManageEquipments } from "../../components/admin/ManageEquipments";
import { ManageTeam } from "../../components/admin/ManageTeam";
import { ManageReservations } from "../../components/admin/ManageReservations";
import { ManageConfig } from "../../components/admin/ManageConfig";

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  
  // Estados para armazenar as contagens do painel geral
  const [counts, setCounts] = useState({ equipments: 0, team: 0, reservations: 0 });
  
  // Estados para armazenar as listas de dados requisitadas pelos componentes filhos
  const [equipments, setEquipments] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  
  const router = useRouter();

  // Função centralizada para carregar todos os dados do banco do Supabase
  async function loadData() {
    try {
      const [eqData, tmData, resData] = await Promise.all([
        supabase.from("equipments").select("*").order("created_at", { ascending: false }),
        supabase.from("team").select("*").order("name", { ascending: true }),
        supabase.from("reservations").select("*").order("date", { ascending: false })
      ]);

      const loadedEquipments = eqData.data || [];
      const loadedTeam = tmData.data || [];
      const loadedReservations = resData.data || [];

      setEquipments(loadedEquipments);
      setTeam(loadedTeam);
      setReservations(loadedReservations);

      setCounts({
        equipments: loadedEquipments.length,
        team: loadedTeam.length,
        reservations: loadedReservations.length
      });
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        await loadData();
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <AdminSidebar currentTab={tab} setTab={setTab} onLogout={handleLogout} />
      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {tab === "dashboard" && <DashboardStats counts={counts} />}
        {tab === "equipments" && <ManageEquipments data={equipments} refresh={loadData} />}
        {tab === "team" && <ManageTeam data={team} refresh={loadData} />}
        {tab === "reservations" && <ManageReservations data={reservations} refresh={loadData} />}
        
        {/* Chamadas limpas sem propriedades incompatíveis para respeitar a tipagem estrita */}
        {tab === "rules" && <ManageConfig />}
        {tab === "config" && <ManageConfig />}
      </main>
    </div>
  );
}
