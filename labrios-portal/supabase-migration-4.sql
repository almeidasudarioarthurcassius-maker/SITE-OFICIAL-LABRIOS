-- ============================================================
-- LTIP — Migração 4: novo formato de parcerias e horários
-- Pode ser rodado quantas vezes precisar.
-- ============================================================

-- 1. Parcerias: de array de strings para array de {nome, link}
UPDATE configuracoes_site
SET valor = (
  SELECT jsonb_agg(jsonb_build_object('nome', elem, 'link', ''))
  FROM jsonb_array_elements_text(valor) AS elem
)
WHERE chave = 'parcerias'
  AND jsonb_typeof(valor) = 'array'
  AND jsonb_typeof(valor->0) = 'string';

-- 2. Horários: de horario_semana/horario_sabado para array "horarios"
UPDATE configuracoes_site
SET valor = (valor - 'horario_semana' - 'horario_sabado') || jsonb_build_object(
  'horarios',
  jsonb_build_array(
    jsonb_build_object('dias', 'Segunda a Sexta', 'horario', COALESCE(valor->>'horario_semana', '08h00 – 18h00')),
    jsonb_build_object('dias', 'Sábado', 'horario', COALESCE(valor->>'horario_sabado', '08h00 – 12h00'))
  )
)
WHERE chave = 'contato'
  AND valor->'horarios' IS NULL;

-- Confirme o resultado:
SELECT chave, valor FROM configuracoes_site WHERE chave IN ('parcerias', 'contato');
