# 🔧 Atualização 2 — Dados reais, logo e fundo branco

## ⚠️ Rode o novo SQL (depois dos dois anteriores)

`supabase-migration-3.sql` — atualiza:
- ✅ Endereço real: Bloco 3 - Prédio Francisco de Assis Serrão Dinelly, Mestrado Profissional ProfÁgua, Rua Odovaldo Novo, s/n, Djard Vieira, CEP 69152-470
- ✅ Usuário **Técnico**: `acas.mat25@uea.edu.br` / senha `ltip2025acas`
- ✅ Usuário **Coordenador**: `mrendeiro@uea.edu.br` — **defina a senha dele** antes de rodar (procure `DefinaUmaSenhaForte` no arquivo e troque)

Depois de rodar, confira no resultado da última linha (`SELECT * FROM admin_users`) se os dois e-mails aparecem.

---

## 🖼️ Sobre a logo

Você está certo: a gota tem áreas brancas/claras que ficavam "sumindo" no fundo azul-marinho do cabeçalho. Corrigi isso de duas formas:

1. **Coloquei um fundo branco arredondado por trás da logo no cabeçalho** (já no código, `app/globals.css` → `.navbar-logo`). Agora qualquer logo com partes claras/transparentes fica visível.
2. **Incluí a logo oficial que você enviou** diretamente em `public/images/logo-ltip.png` — ela já aparece como aposta padrão até você subir uma pelo painel.

**Como usar a logo oficial:**
- Opção A (mais simples): não faça nada — o arquivo já está em `public/images/logo-ltip.png` e será usado como logo padrão.
- Opção B (recomendada): acesse `/admin/configuracoes` e faça upload do mesmo arquivo PNG pelo painel. Isso salva no Supabase Storage e fica editável sem precisar de novo deploy.

---

## 🤝 Parcerias e logos das instituições

Você mencionou que vai adicionar parcerias com link e logo de cada instituição. A versão atual do campo "Parcerias" só suporta texto simples (nome do parceiro). Para suportar **logo + link clicável** por parceiro, é preciso uma pequena extensão de estrutura — me avise quando tiver os nomes/links/logos das instituições e eu já preparo:
- Campo de upload de logo por parceiro no `/admin/configuracoes`
- Card clicável no rodapé abrindo o site da instituição em nova aba

---

## 🎞️ Banners

Conforme você comentou, os banners serão cadastrados pelo próprio site quando estiver no ar — isso já está pronto em `/admin/banner`, nenhuma ação extra necessária.

---

## Arquivos desta atualização

```
supabase-migration-3.sql     ← endereço real + usuários reais
app/globals.css              ← fundo branco na logo do navbar
components/Navbar.tsx        ← logo um pouco maior, ajustada ao novo fundo
public/images/logo-ltip.png  ← logo oficial já incluída no projeto
```
