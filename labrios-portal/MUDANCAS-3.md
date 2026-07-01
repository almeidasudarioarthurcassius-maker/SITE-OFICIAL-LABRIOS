# 🔧 Atualização 3 — Parcerias clicáveis + horários customizáveis

## O que mudou

### 1. Parcerias com link clicável
No painel `/admin/configuracoes`, a seção **Parcerias** agora tem dois campos por
parceiro: **Nome** e **Link do site** (opcional). Quando o link é preenchido, o
nome aparece no rodapé do site como um botão clicável (com seta ↗) que abre o
site da instituição em nova aba. Sem link, continua aparecendo como antes —
só o nome, sem interação.

### 2. Horário de funcionamento customizável
Antes era fixo: "Segunda a Sexta" + "Sábado". Agora, em
`/admin/configuracoes`, você adiciona quantas linhas de horário quiser,
cada uma com **Dias** livres (ex: "Terça e Quinta", "Segunda, Quarta e Sexta")
e o **Horário** correspondente. Pode remover linhas com o botão 🗑️.

### Migração automática — não precisa fazer nada no banco
O painel já detecta o formato antigo (parcerias como texto simples, horário
fixo semana/sábado) e converte sozinho na primeira vez que você abrir
`/admin/configuracoes`. Basta acessar a página, ajustar o que quiser e
clicar em **"Salvar Todas as Configurações"**.

Se preferir migrar direto no banco antes de usar o painel, rode
`supabase-migration-4.sql` — mas é opcional.

---

## Arquivos alterados

```
components/Footer.tsx                 ← parcerias clicáveis + horários em lista
app/admin/configuracoes/page.tsx       ← editor de parcerias (nome+link) e horários (dias+horário)
app/globals.css                        ← estilo do botão de parceria clicável
supabase-migration-4.sql               ← migração opcional direto no banco
```
