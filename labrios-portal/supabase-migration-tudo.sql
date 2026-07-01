-- ============================================================
-- LTIP — Script único e seguro (resolve "relation does not exist")
-- Pode ser rodado quantas vezes precisar — não duplica nada.
-- ============================================================

-- 1. BUCKET DE STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('ltip-public', 'ltip-public', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "leitura_publica_bucket" ON storage.objects;
CREATE POLICY "leitura_publica_bucket"
  ON storage.objects FOR SELECT USING (bucket_id = 'ltip-public');

DROP POLICY IF EXISTS "upload_publico_bucket" ON storage.objects;
CREATE POLICY "upload_publico_bucket"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ltip-public');

DROP POLICY IF EXISTS "update_publico_bucket" ON storage.objects;
CREATE POLICY "update_publico_bucket"
  ON storage.objects FOR UPDATE USING (bucket_id = 'ltip-public');

DROP POLICY IF EXISTS "delete_publico_bucket" ON storage.objects;
CREATE POLICY "delete_publico_bucket"
  ON storage.objects FOR DELETE USING (bucket_id = 'ltip-public');

-- 2. TABELA: configuracoes_site
CREATE TABLE IF NOT EXISTS configuracoes_site (
  chave  TEXT PRIMARY KEY,
  valor  JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE configuracoes_site ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leitura_publica_config" ON configuracoes_site;
CREATE POLICY "leitura_publica_config"
  ON configuracoes_site FOR SELECT USING (true);

DROP POLICY IF EXISTS "escrita_publica_config" ON configuracoes_site;
CREATE POLICY "escrita_publica_config"
  ON configuracoes_site FOR ALL USING (true) WITH CHECK (true);

-- Conteúdo inicial — só insere se ainda não existir
INSERT INTO configuracoes_site (chave, valor) VALUES
('sobre', '{
  "titulo": "Sobre o LTIP",
  "descricao": "Laboratório de referência em pesquisa tecnológica e inovação, fomentando a produção científica e o desenvolvimento regional.",
  "missao": "Promover a pesquisa, o ensino e a extensão em tecnologia e inovação, oferecendo suporte técnico e infraestrutura de qualidade à comunidade acadêmica e ao setor produtivo.",
  "visao": "Ser reconhecido como um laboratório de excelência nacional em inovação tecnológica, contribuindo de forma significativa para o desenvolvimento científico e socioeconômico regional.",
  "regras": "O uso dos equipamentos requer agendamento prévio. É obrigatório o uso de EPI quando aplicável."
}'),
('contato', '{
  "endereco_linha1": "Bloco 3 - Prédio Francisco de Assis Serrão Dinelly",
  "endereco_linha2": "Mestrado Profissional ProfÁgua, Rua Odovaldo Novo, s/n, Djard Vieira",
  "cep": "69152-470",
  "cidade": "Manaus – AM",
  "telefone": "(92) 3000-0000",
  "email": "ltip@uea.edu.br",
  "horario_semana": "08h00 – 18h00",
  "horario_sabado": "08h00 – 12h00",
  "observacao": "Atendimento fora do horário mediante agendamento prévio"
}'),
('logo', '{"url": null}'),
('parcerias', '["CNPq", "FAPEAM", "CAPES", "FINEP", "MCTI"]'),
('slides', '[
  {"tag":"Inovação & Pesquisa","title":"Tecnologia a Serviço da Ciência","desc":"O LTIP oferece infraestrutura de ponta para pesquisadores e estudantes desenvolverem projetos de alto impacto.","img":"https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80","ctaLabel":"Agendar Equipamento →","ctaHref":"/#agendamento"},
  {"tag":"Equipamentos","title":"Infraestrutura Completa e Atualizada","desc":"Acesse nosso inventário de equipamentos disponíveis e verifique a disponibilidade em tempo real.","img":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=80","ctaLabel":"Ver Inventário →","ctaHref":"/#inventario"},
  {"tag":"Documentação","title":"Repositório de Relatórios e Regimentos","desc":"Acesse todos os documentos institucionais, regimentos e relatórios mensais do laboratório.","img":"https://images.unsplash.com/photo-1562408590-e32931084e23?w=1400&q=80","ctaLabel":"Acessar Documentos →","ctaHref":"/documentos"}
]')
ON CONFLICT (chave) DO NOTHING;

-- Garante que o endereço fique correto mesmo se a linha já existia antes com dados fictícios
UPDATE configuracoes_site
SET valor = valor
  || '{"endereco_linha1":"Bloco 3 - Prédio Francisco de Assis Serrão Dinelly"}'::jsonb
  || '{"endereco_linha2":"Mestrado Profissional ProfÁgua, Rua Odovaldo Novo, s/n, Djard Vieira"}'::jsonb
  || '{"cep":"69152-470"}'::jsonb
  || '{"cidade":"Manaus – AM"}'::jsonb
WHERE chave = 'contato';

-- 3. TABELA: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  nome       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sem_acesso_direto" ON admin_users;
CREATE POLICY "sem_acesso_direto" ON admin_users FOR SELECT USING (false);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION verificar_login(p_email TEXT, p_senha TEXT)
RETURNS TABLE(ok BOOLEAN, nome TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT TRUE, a.nome
  FROM admin_users a
  WHERE a.email = p_email
    AND a.senha_hash = crypt(p_senha, a.senha_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove usuário de exemplo, se existir
DELETE FROM admin_users WHERE email = 'coordenador@ltip.edu.br';

-- Técnico do laboratório
INSERT INTO admin_users (email, senha_hash, nome)
VALUES (
  'acas.mat25@uea.edu.br',
  crypt('ltip2025acas', gen_salt('bf')),
  'Técnico do Laboratório'
)
ON CONFLICT (email) DO UPDATE
  SET senha_hash = crypt('ltip2025acas', gen_salt('bf'));

-- Coordenador — TROQUE 'DefinaUmaSenhaForte' pela senha real antes de rodar
INSERT INTO admin_users (email, senha_hash, nome)
VALUES (
  'mrendeiro@uea.edu.br',
  crypt('DefinaUmaSenhaForte', gen_salt('bf')),
  'Coordenador'
)
ON CONFLICT (email) DO UPDATE
  SET senha_hash = crypt('DefinaUmaSenhaForte', gen_salt('bf'));

-- 4. Confirmação final — confira o resultado abaixo
SELECT 'Tabelas criadas:' AS info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

SELECT 'Usuários admin:' AS info;
SELECT id, email, nome FROM admin_users;

SELECT 'Configurações:' AS info;
SELECT chave FROM configuracoes_site;
