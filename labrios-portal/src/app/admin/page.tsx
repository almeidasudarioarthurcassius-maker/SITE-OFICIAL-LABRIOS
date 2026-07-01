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
  const [counts, setCounts] = useState({ equipments: 0, team: 0, reservations: 0 });
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        // Busca contagens reais do Supabase para alimentar as estatísticas do Dashboard
        try {
          const [eqCount, tmCount, resCount] = await Promise.all([
            supabase.from("equipments").select("*", { count: "exact", head: true }),
            supabase.from("team").select("*", { count: "exact", head: true }),
            supabase.from("reservations").select("*", { count: "exact", head: true })
          ]);

          setCounts({
            equipments: eqCount.count || 0,
            team: tmCount.count || 0,
            reservations: resCount.count || 0
          });
        } catch (error) {
          console.error("Erro ao carregar estatísticas:", error);
        }
        
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
        {tab === "equipments" && <ManageEquipments />}
        {tab === "team" && <ManageTeam />}
        {tab === "reservations" && <ManageReservations />}
        {tab === "rules" && <ManageConfig section="rules" />}
        {tab === "config" && <ManageConfig section="regimento" />}
      </main>
    </div>
  );
}
