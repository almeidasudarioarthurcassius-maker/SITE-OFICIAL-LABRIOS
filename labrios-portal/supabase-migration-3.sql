-- ============================================================
-- LTIP — Migração 3: Dados reais (endereço + usuários)
-- Execute DEPOIS de já ter rodado supabase-migration.sql
-- e supabase-migration-2.sql
-- ============================================================

-- 1. ENDEREÇO REAL (atualiza o que está em "contato")
UPDATE configuracoes_site
SET valor = jsonb_set(valor, '{endereco_linha1}', '"Bloco 3 - Prédio Francisco de Assis Serrão Dinelly"')
WHERE chave = 'contato';

UPDATE configuracoes_site
SET valor = jsonb_set(valor, '{endereco_linha2}', '"Mestrado Profissional ProfÁgua, Rua Odovaldo Novo, s/n, Djard Vieira"')
WHERE chave = 'contato';

UPDATE configuracoes_site
SET valor = jsonb_set(valor, '{cep}', '"69152-470"')
WHERE chave = 'contato';

UPDATE configuracoes_site
SET valor = jsonb_set(valor, '{cidade}', '"Manaus – AM"')
WHERE chave = 'contato';

-- Se quiser, ajuste também telefone e e-mail reais (troque os valores abaixo):
-- UPDATE configuracoes_site SET valor = jsonb_set(valor, '{telefone}', '"(92) 0000-0000"') WHERE chave = 'contato';
-- UPDATE configuracoes_site SET valor = jsonb_set(valor, '{email}', '"ltip@uea.edu.br"') WHERE chave = 'contato';

-- 2. USUÁRIOS REAIS DO PAINEL ADMIN

-- Remove o usuário de exemplo criado na migração anterior (se existir)
DELETE FROM admin_users WHERE email = 'coordenador@ltip.edu.br';

-- Técnico do laboratório (e-mail e senha definidos por você)
INSERT INTO admin_users (email, senha_hash, nome)
VALUES (
  'acas.mat25@uea.edu.br',
  crypt('ltip2025acas', gen_salt('bf')),
  'Técnico do Laboratório'
)
ON CONFLICT (email) DO UPDATE
  SET senha_hash = crypt('ltip2025acas', gen_salt('bf'));

-- Coordenador (defina a senha dele — troque 'DefinaUmaSenhaForte' antes de rodar)
INSERT INTO admin_users (email, senha_hash, nome)
VALUES (
  'mrendeiro@uea.edu.br',
  crypt('DefinaUmaSenhaForte', gen_salt('bf')),
  'Coordenador'
)
ON CONFLICT (email) DO UPDATE
  SET senha_hash = crypt('DefinaUmaSenhaForte', gen_salt('bf'));

-- Confirme que os usuários foram criados corretamente:
SELECT id, email, nome, created_at FROM admin_users;
