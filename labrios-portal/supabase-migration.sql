-- ============================================================
-- LTIP Portal — Supabase SQL Migration
-- Execute este script no SQL Editor do painel Supabase
-- ============================================================

-- ── 1. Tabela: equipe ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS equipe (
  id          BIGSERIAL PRIMARY KEY,
  nome        TEXT NOT NULL,
  cargo       TEXT,
  imagem_url  TEXT,
  lattes_url  TEXT,
  ordem       INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Tabela: inventario ─────────────────────────────────
CREATE TYPE IF NOT EXISTS status_equip AS ENUM ('disponivel', 'reservado', 'manutencao');

CREATE TABLE IF NOT EXISTS inventario (
  id                BIGSERIAL PRIMARY KEY,
  nome_equipamento  TEXT NOT NULL,
  quantidade        INTEGER NOT NULL DEFAULT 1,
  imagem_url        TEXT,
  funcionalidade    TEXT,
  status            status_equip NOT NULL DEFAULT 'disponivel',
  tombo             TEXT,
  especificacoes    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Tabela: documentos ─────────────────────────────────
CREATE TABLE IF NOT EXISTS documentos (
  id           BIGSERIAL PRIMARY KEY,
  titulo       TEXT NOT NULL,
  arquivo_url  TEXT NOT NULL,
  categoria    TEXT,
  data_upload  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. RLS (Row Level Security) ───────────────────────────
-- Leitura pública (anon) em todas as tabelas
ALTER TABLE equipe      ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario  ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública — equipe"
  ON equipe FOR SELECT USING (true);

CREATE POLICY "Leitura pública — inventario"
  ON inventario FOR SELECT USING (true);

CREATE POLICY "Leitura pública — documentos"
  ON documentos FOR SELECT USING (true);

-- Escrita apenas autenticada (admin)
-- Para simplificar neste protótipo usamos service_role no backend.
-- Em produção, crie roles de admin com Supabase Auth e adicione políticas INSERT/UPDATE/DELETE aqui.

-- ── 5. Storage: bucket ltip-public ───────────────────────
-- Crie via Dashboard: Storage → New Bucket → nome: ltip-public → Public: ON
-- OU execute:
INSERT INTO storage.buckets (id, name, public)
VALUES ('ltip-public', 'ltip-public', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: leitura pública do bucket
CREATE POLICY "Leitura pública bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ltip-public');

-- Policy: upload autenticado (service role bypassa RLS, portanto esta cobre usuários auth normais se quiser)
CREATE POLICY "Upload autenticado bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ltip-public');

-- ── 6. Dados iniciais (opcional — remova se não precisar) ──
INSERT INTO equipe (nome, cargo, lattes_url, ordem) VALUES
  ('Dr. Roberto Mendes',       'Coordenador',             'http://lattes.cnpq.br/', 1),
  ('Profa. Ana Carolina Lima',  'Pesquisadora Principal',   'http://lattes.cnpq.br/', 2),
  ('Carlos Eduardo Silva',      'Técnico de TI',            NULL,                      3),
  ('Beatriz Fernandes',         'Pesquisadora',             NULL,                      4),
  ('Lucas Martins',             'Bolsista Doutorado',       NULL,                      5),
  ('Juliana Costa',             'Bolsista Mestrado',        NULL,                      6)
ON CONFLICT DO NOTHING;

INSERT INTO inventario (nome_equipamento, quantidade, status, tombo, especificacoes, funcionalidade) VALUES
  ('Workstation Dell Precision', 1, 'disponivel', 'LTIP-2023-001', 'Intel Xeon W,128GB RAM,RTX A5000',
   'Processamento de alta performance para simulações e modelos computacionais de recursos hídricos.'),
  ('Servidor HP ProLiant DL380', 1, 'reservado',  'LTIP-2022-003', '2× Xeon Gold,256GB ECC,12TB RAID',
   'Servidor de dados central para armazenamento e processamento de grandes volumes de dados.'),
  ('MacBook Pro 16" M3 Pro',     1, 'disponivel', 'LTIP-2024-007', 'Apple M3 Pro,36GB RAM,1TB SSD',
   'Desenvolvimento de software, análise de dados e produção científica em campo.'),
  ('Impressora 3D Ultimaker S3', 1, 'manutencao', 'LTIP-2021-002', 'Dupla extrusão,PLA/ABS/TPU',
   'Prototipagem rápida de componentes físicos e modelos para estudos de bacias hidrográficas.'),
  ('Kit Sensores IoT',           3, 'disponivel', 'LTIP-2023-012', 'RPi 4B 8GB,40+ sensores,LoRa',
   'Monitoramento ambiental em campo: pluviometria, umidade, temperatura e nível de rios.')
ON CONFLICT DO NOTHING;
