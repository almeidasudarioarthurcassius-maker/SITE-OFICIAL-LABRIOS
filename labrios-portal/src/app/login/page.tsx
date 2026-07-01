"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email === "rjovito@uea.edu.br" && password === "jovito2026") {
      localStorage.setItem("labrios-admin-session", "true");
      router.push("/admin");
    } else {
      setError("Credenciais administrativas incorretas ou inválidas.");
    }
  }

  return (
    <div class="min-h-screen bg-navy-dark flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 class="text-2xl font-black text-navy mb-1 text-center">Acesso Restrito</h2>
        <p class="text-xs text-gray-500 mb-6 text-center">Insira suas credenciais corporativas unificadas</p>

        <form onSubmit={handleLogin} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail Corporativo</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-navy" placeholder="usuario@uea.edu.br" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Senha de Acesso</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-navy" placeholder="••••••••" />
          </div>

          {error && <p class="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg text-center">{error}</p>}

          <Button type="submit" class="w-full py-2.5 mt-2">Autenticar e Entrar</Button>
        </form>
      </div>
    </div>
  );
}