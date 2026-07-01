"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(false);

    if (!email || !password) {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg("Credenciais inválidas. Verifique os dados e tente novamente.");
        setLoading(false);
      } else if (data?.session) {
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocorreu um erro inesperado ao tentar conectar.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#002244] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-black text-[#003366] mb-1 text-center">Acesso Restrito</h2>
        <p className="text-xs text-gray-500 mb-6 text-center">Insira suas credenciais corporativas unificadas</p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200 text-center animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">E-mail Institucional</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@uea.edu.br"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Senha de Acesso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] transition-all text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E7D32] text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-green-700/20 hover:bg-[#43A047] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs font-semibold text-gray-500 hover:text-[#003366] transition-all"
          >
            ← Voltar para o Portal Público
          </button>
        </div>
      </div>
    </div>
  );
}
