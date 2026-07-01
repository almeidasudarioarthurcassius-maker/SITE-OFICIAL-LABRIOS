import React from "react";
import { supabase } from "@/lib/supabase";
import { 
  Activity, 
  Layers, 
  FlaskConical, 
  MapPin, 
  Mail, 
  User, 
  Calendar, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  Download, 
  FileText 
} from "lucide-react";

export const revalidate = 0; // Garante que a página sempre busque dados frescos no banco

export default async function HomePage() {
  // Chamadas ao banco com tipagem flexível (any) anexada para evitar inferência de "never" pelo compilador
  const { data: teamMembers } = await supabase.from("team").select("*") as { data: any[] | null };
  const { data: equipments } = await supabase.from("equipments").select("*") as { data: any[] | null };
  const { data: agenda } = await supabase.from("reservations").select("*, equipment:equipments(name)").eq("status", "approved").order("date") as { data: any[] | null };

  // Separação segura dos membros do laboratório com base nas categorias
  const coreTeam = teamMembers?.filter((m: any) => m.category === "team") || [];
  const committeeMembers = teamMembers?.filter((m: any) => m.category !== "team") || [];

  return (
    <div className="min-h-screen bg-white text-gray-800 scroll-smooth">
      {/* 1. TOP BAR INSTITUCIONAL */}
      <div className="bg-[#002244] text-white text-[11px] py-2 px-4 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-medium tracking-wide">
          <div className="flex items-center gap-4">
            <span>UNIVERSIDADE DO ESTADO DO AMAZONAS — UEA</span>
            <span className="text-white/40">|</span>
            <span>MESTRADO PROFISSIONAL PROFÁGUA</span>
          </div>
          <div>
            <span>CAMPUS: CENTRO DE ESTUDOS SUPERIORES DE PARINTINS (CESP)</span>
          </div>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <a href="#" className="flex flex-col">
            <span className="text-xl font-black text-[#003366] tracking-tight flex items-center gap-1.5">
              LABRIOS <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">Portal</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-0.5 max-w-[280px] md:max-w-none leading-tight">
              Laboratório de Análise de Água do Baixo Amazonas
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-600">
            <a href="#sobre" className="hover:text-[#003366] transition-colors">O Laboratório</a>
            <a href="#atuacao" className="hover:text-[#003366] transition-colors">Áreas</a>
            <a href="#equipamentos" className="hover:text-[#003366] transition-colors">Equipamentos</a>
            <a href="#equipe" className="hover:text-[#003366] transition-colors">Equipe</a>
            <a href="#agenda" className="hover:text-[#003366] transition-colors">Agenda</a>
            <a href="#regimento" className="hover:text-[#003366] transition-colors">Documentos</a>
          </nav>
          <div className="flex items-center gap-3">
            <a 
              href="/login" 
              className="text-xs font-bold text-[#003366] hover:bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 transition-all"
            >
              Área Restrita
            </a>
            <a 
              href="#agendar" 
              className="text-xs font-bold bg-[#2E7D32] text-white px-4 py-2.5 rounded-xl shadow-md shadow-green-700/10 hover:bg-[#43A047] transition-all"
            >
              Solicitar Reserva
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO INSTITUCIONAL */}
      <section className="relative bg-gradient-to-br from-[#002244] via-[#003366] to-[#004488] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(102,187,106,0.15),transparent_45%)]"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wide border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></span>
              Apoio Técnico ao ProfÁgua / UEA
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Pesquisa Avançada e Monitoramento da Qualidade da Água na Amazônia.
            </h1>
            <p className="text-base text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              O LABRIOS/CESP atua com análises físico-químicas e microbiológicas essenciais, servindo de suporte estratégico para projetos de pesquisa, dissertações de mestrado e soluções sustentáveis em recursos hídricos.
            </p>
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#sobre" className="bg-[#66BB6A] hover:bg-[#43A047] text-[#002244] font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2">
                Conhecer Atuação <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#regimento" className="bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition-all flex items-center gap-2">
                <FileText className="w-4 h-4" /> Baixar Regimento
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-2xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#66BB6A] rounded-2xl flex items-center justify-center text-[#002244] shadow-lg">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black mt-2 mb-4">Informações de Contato</h3>
              <div className="space-y-4 text-sm text-white/80">
                <div className="flex gap-3">
                  <User className="w-5 h-5 shrink-0 text-[#66BB6A]" />
                  <div>
                    <p className="font-bold text-white">Coordenador Responsável</p>
                    <p className="text-xs text-white/70">Prof. Dr. Rafael Jovito Souza</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-[#66BB6A]" />
                  <div>
                    <p className="font-bold text-white">E-mail de Contato</p>
                    <p className="text-xs text-white/70">rjovito@uea.edu.br</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-[#66BB6A]" />
                  <div>
                    <p className="font-bold text-white">Localização Física</p>
                    <p className="text-xs text-white/70 leading-normal">
                      Bloco 3 - Prédio Francisco de Assis Serrão Dinelly<br />
                      Rua Odovaldo Novo s/n, Djard Vieira<br />
                      CEP: 69152-470 — Parintins / AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO SOBRE & INFRAESTRUTURA */}
      <section id="sobre" className="py-16 max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center border-b border-gray-100">
        <div className="space-y-6">
          <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">Apresentação Institucional</div>
          <h2 className="text-3xl font-black text-[#003366] tracking-tight">Compromisso Científico com Recursos Hídricos</h2>
          <p className="text-gray-600 leading-relaxed font-medium text-sm">
            O Laboratório de Análise de Água do Baixo Amazonas (LABRIOS) é um pilar de pesquisa avançada do Centro de Estudos Superiores de Parintins (CESP/UEA). Vinculado diretamente ao programa de pós-graduação ProfÁgua, atuamos como um núcleo integrador de excelência acadêmica e desenvolvimento científico regional.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex gap-3">
              <Activity className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#003366]">Análise de Água</h4>
                <p className="text-xs text-gray-500 mt-0.5">Parâmetros físicos, químicos e biológicos rigorosos.</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex gap-3">
              <Layers className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#003366]">Suporte Acadêmico</h4>
                <p className="text-xs text-gray-500 mt-0.5">Infraestrutura completa para dissertações e artigos.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/60 rounded-3xl p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-black text-[#003366] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2E7D32]" /> Atividades Principais
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
            <li className="flex items-start gap-2">✓ Atividades integradas de pesquisa, development científico e inovação tecnológica.</li>
            <li className="flex items-start gap-2">✓ Formação contínua de recursos humanos altamente qualificados.</li>
            <li className="flex items-start gap-2">✓ Execução de análises físico-químicas básicas e de coliformes termotolerantes.</li>
            <li className="flex items-start gap-2">✓ Amostragem e levantamento técnico em corpos hídricos no Baixo Amazonas.</li>
          </ul>
        </div>
      </section>

      {/* 5. ÁREAS DE ATUAÇÃO */}
      <section id="atuacao" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mx-auto">Diretrizes de Pesquisa</div>
            <h2 className="text-3xl font-black text-[#003366] tracking-tight">Áreas de Atuação Estratégica</h2>
            <p className="text-sm text-gray-500">Mapeamento de competências e focos de investigação técnica do laboratório.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Planejamento e Qualidade Ambiental", c: "Investigação sistemática e monitoramento dos índices de qualidade das matrizes ambientais na calha do Baixo Amazonas." },
              { t: "Recursos Hídricos e Saneamento", c: "Pesquisas voltadas a tecnologias apropriadas, gestão integrada e melhorias nos ecossistemas de saneamento." },
              { t: "Pesquisa e Desenvolvimento", c: "Inovação aplicada na geração de dados analíticos para mitigar impactos e subsidiar políticas de regulação hídrica." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#003366]/5 flex items-center justify-center text-[#003366] font-bold text-sm">0{idx+1}</div>
                  <h3 className="font-extrabold text-[#003366] text-base">{item.t}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EQUIPAMENTOS DISPONÍVEIS */}
      <section id="equipamentos" className="py-16 max-w-7xl mx-auto px-4 md:px-6 space-y-12 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">Patrimônio Científico</div>
            <h2 className="text-3xl font-black text-[#003366] tracking-tight">Infraestrutura e Equipamentos</h2>
            <p className="text-sm text-gray-500">Tecnologia analítica de ponta disponível para o suporte técnico das pesquisas corporativas.</p>
          </div>
        </div>

        {equipments && equipments.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipments.map((eq: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  {eq.image_url ? (
                    <img src={eq.image_url} alt={eq.name} className="w-full h-36 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                  ) : (
                    <div className="w-full h-36 bg-gray-50 rounded-xl flex items-center justify-center text-[#003366]/40 border border-gray-100"><FlaskConical className="w-8 h-8" /></div>
                  )}
                  <h4 className="font-extrabold text-[#003366] text-sm tracking-tight leading-snug">{eq.name}</h4>
                  {eq.specification && <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{eq.specification}</p>}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px]">
                  <span className={`font-bold px-2 py-0.5 rounded-md ${eq.status === "disponivel" ? "bg-green-50 text-[#2E7D32]" : "bg-red-50 text-red-600"}`}>
                    {eq.status === "disponivel" ? "Disponível" : "Manutenção"}
                  </span>
                  {eq.patrimony && <span className="text-gray-400 font-mono">Pat: {eq.patrimony}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-2xl text-xs text-gray-400 border border-gray-100">Nenhum equipamento listado publicamente no momento.</div>
        )}
      </section>

      {/* 7. EQUIPE E MEMBROS */}
      <section id="equipe" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mx-auto">Corpo Técnico</div>
            <h2 className="text-3xl font-black text-[#003366] tracking-tight">Pesquisadores e Colaboradores</h2>
            <p className="text-sm text-gray-500">A excelência do LABRIOS é mantida por profissionais dedicados à ciência.</p>
          </div>

          <div className="space-y-8">
            {/* Núcleo Permanente */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-[#003366] flex items-center gap-2 border-l-4 border-[#2E7D32] pl-3">Equipe de Execução</h3>
              {coreTeam.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coreTeam.map((m: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center text-gray-400"><Users className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#003366]">{m.name}</h4>
                        {m.role && <p className="text-xs text-gray-500 mt-0.5 font-medium">{m.role}</p>}
                        {m.email && <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{m.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 bg-white p-4 rounded-xl border border-gray-100 text-center">Nenhum executor cadastrado.</p>
              )}
            </div>

            {/* Comitê ou Outros Membros */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-[#003366] flex items-center gap-2 border-l-4 border-gray-400 pl-3">Membros do Comitê / Colaboradores</h3>
              {committeeMembers.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {committeeMembers.map((m: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center text-gray-400"><Users className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#003366]">{m.name}</h4>
                        {m.role && <p className="text-xs text-gray-500 mt-0.5 font-medium">{m.role}</p>}
                        {m.email && <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{m.email}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 bg-white p-4 rounded-xl border border-gray-100 text-center">Nenhum membro do comitê cadastrado.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALENDÁRIO DE RESERVAS (AGENDA PÚBLICA) */}
      <section id="agenda" className="py-16 max-w-7xl mx-auto px-4 md:px-6 space-y-12 border-b border-gray-100">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mx-auto">Cronograma Operacional</div>
          <h2 className="text-3xl font-black text-[#003366] tracking-tight">Agenda de Reservas de Equipamentos</h2>
          <p className="text-sm text-gray-500">Acompanhe as datas reservadas para uso dos dispositivos técnicos do laboratório.</p>
        </div>

        {agenda && agenda.length > 0 ? (
          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Equipamento</th>
                    <th className="px-6 py-4">Pesquisador / Solicitante</th>
                    <th className="px-6 py-4">Turno</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700 text-xs">
                  {agenda.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#003366] whitespace-nowrap flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">{item.equipment?.name || "Equipamento Geral"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.requester_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md font-bold text-gray-600 uppercase tracking-wide text-[10px]">
                          {item.period || "Integral"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto p-8 text-center bg-gray-50 rounded-2xl text-xs text-gray-400 border border-gray-100">
            Nenhuma reserva ativa ou agendada encontrada no sistema.
          </div>
        )}
      </section>

      {/* 9. DOCUMENTOS INSTITUCIONAIS (REGIMENTO) */}
      <section id="regimento" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider mx-auto">Transparência e Regulação</div>
          <h2 className="text-3xl font-black text-[#003366] tracking-tight">Regimento Interno e Normas de Uso</h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto font-medium leading-relaxed">
            Consulte as diretrizes regulatórias e normas de biossegurança do LABRIOS para garantir o uso correto, ético e seguro de toda a nossa infraestrutura física e analítica.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button className="bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Baixar Regimento Técnico (PDF)
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
              <FileText className="w-4 h-4" /> Normas de Biossegurança
            </button>
          </div>
        </div>
      </section>

      {/* 10. RODAPÉ INSTITUCIONAL */}
      <footer className="bg-[#002244] text-white pt-12 pb-6 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8 pb-10 border-b border-white/10 text-sm font-medium text-white/70">
          <div className="space-y-4">
            <h4 className="text-white font-black text-base tracking-tight">LABRIOS / UEA</h4>
            <p className="text-xs leading-relaxed text-white/60">
              Laboratório de Análise de Água do Baixo Amazonas vinculado ao Mestrado Profissional em Gestão e Regulação de Recursos Hídricos (ProfÁgua) no Centro de Estudos Superiores de Parintins (CESP).
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm tracking-wide uppercase">Links Úteis</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="https://uea.edu.br" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Universidade do Estado do Amazonas</a></li>
              <li><a href="https://www.ana.gov.br/profagua" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portal Oficial ProfÁgua (CAPES)</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-black text-sm tracking-wide uppercase">Suporte Técnico</h4>
            <p className="text-xs leading-relaxed text-white/60">
              Para dúvidas operacionais ou problemas de agendamento de bancadas, entre em contato através do e-mail corporativo da coordenação.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-white/40 font-medium gap-4">
          <p>© {new Date().getFullYear()} LABRIOS / CESP — Todos os direitos reservados.</p>
          <p className="tracking-wide text-center md:text-right">
            Créditos de Produção: <span className="text-white/60 font-bold uppercase">Laboratório de Tecnologia da Informação do ProfÁgua — LTIP</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
