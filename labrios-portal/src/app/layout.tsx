import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "LABRIOS — Laboratório de Análise de Água do Baixo Amazonas",
  description: "Portal institucional do Laboratório LABRIOS vinculado ao ProfÁgua/UEA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" class="scroll-smooth">
      <body class="bg-white text-gray-800 antialiased font-sans m-0 p-0">
        {children}
      </body>
    </html>
  );
}