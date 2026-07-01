-- ============================================================
-- LTIP — Migração 5: Solicitações de Reserva (Agendamento)
-- Execute no SQL Editor do Supabase.
-- Cria a tabela onde ficam registradas as solicitações enviadas
-- pelo formulário "Solicitar Reserva" do site, para que o
-- administrador possa visualizar, aprovar ou negar pelo painel.
-- ============================================================

CREATE TABLE IF NOT EXISTS solicitacoes (
  id            BIGSERIAL PRIMARY KEY,
  nome          TEXT NOT NULL,
  email         TEXT NOT NULL,
  equipamento   TEXT NOT NULL,
  data_inicio   DATE,
  data_fim      DATE,
  finalidade    TEXT,
  status        TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'negado')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE solicitacoes ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode enviar uma solicitação (INSERT) através do formulário público.
DROP POLICY IF EXISTS "envio_publico_solicitacoes" ON solicitacoes;
CREATE POLICY "envio_publico_solicitacoes"
  ON solicitacoes FOR INSERT WITH CHECK (true);

-- Leitura e atualização de status (aprovar/negar) — feitas a partir do painel admin,
-- que usa login próprio (tabela admin_users) e não o sistema de Auth do Supabase,
-- por isso a política segue o mesmo padrão já usado nas demais tabelas do projeto.
DROP POLICY IF EXISTS "leitura_solicitacoes" ON solicitacoes;
CREATE POLICY "leitura_solicitacoes"
  ON solicitacoes FOR SELECT USING (true);

DROP POLICY IF EXISTS "atualizacao_solicitacoes" ON solicitacoes;
CREATE POLICY "atualizacao_solicitacoes"
  ON solicitacoes FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "exclusao_solicitacoes" ON solicitacoes;
CREATE POLICY "exclusao_solicitacoes"
  ON solicitacoes FOR DELETE USING (true);

-- Índice para ordenar/filtrar rapidamente por status e data
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes (status, created_at DESC);
