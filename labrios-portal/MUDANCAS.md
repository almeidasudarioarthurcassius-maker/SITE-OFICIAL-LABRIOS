# 🔧 Atualização — Login, Logo, Configurações, Slides e Storage

## ⚠️ PASSO OBRIGATÓRIO: rode o novo SQL

Vá em **Supabase → SQL Editor → New query**, cole o conteúdo de
`supabase-migration-2.sql` e clique em **Run**.

Esse script resolve:
- ✅ **"Bucket not found"** → cria o bucket `ltip-public` (resolve upload de PDF e imagens)
- ✅ Cria a tabela `configuracoes_site` (Sobre, Contato, Logo, Parcerias, Slides)
- ✅ Cria a tabela `admin_users` + função de login seguro com senha criptografada

---

## 🔐 Login com usuário e senha

O script já cria um usuário padrão:

```
E-mail: coordenador@ltip.edu.br
Senha:  TrocarSenha123
```

**Troque essa senha imediatamente.** No SQL Editor, rode:

```sql
UPDATE admin_users
SET senha_hash = crypt('SuaNovaSenhaForte', gen_salt('bf'))
WHERE email = 'coordenador@ltip.edu.br';
```

Para cadastrar o técnico também:

```sql
INSERT INTO admin_users (email, senha_hash, nome)
VALUES ('tecnico@ltip.edu.br', crypt('SenhaDoTecnico', gen_salt('bf')), 'Técnico LTIP');
```

Agora o login em `/admin/login` exige e-mail e senha reais — nada de
preenchimento automático. A sessão dura 8 horas e há botão **"Sair"** no
painel admin.

---

## 🖼️ Como colocar a logo oficial

1. Acesse `/admin/configuracoes`
2. Na seção **"Logo do Laboratório"**, clique para selecionar o arquivo PNG
3. Clique em **"Salvar Todas as Configurações"**

A logo aparece automaticamente no cabeçalho do site inteiro.

---

## 📍 Como editar Sobre, Endereço, Horário e Parcerias

Acesse `/admin/configuracoes` e edite:
- **Sobre**: título, descrição, missão, visão, regras de uso
- **Contato**: endereço real, CEP, cidade, telefone, e-mail, horários
- **Parcerias**: lista de instituições parceiras (separadas por vírgula)

Tudo isso já estava fixo no código — agora vem do banco e você edita
quando quiser, sem precisar de outro deploy.

---

## 🎞️ Como cadastrar imagens no banner inicial (slider)

Acesse `/admin/banner`:
- Edite os slides existentes ou clique em **"Adicionar Novo Slide"**
- Faça upload da imagem do curso/evento
- Preencha tag, título, descrição e o botão de ação
- Clique em **"Salvar Slides"**

As imagens novas aparecem automaticamente na rotação da home.

---

## 🐛 Correções incluídas

| Problema relatado | Correção |
|---|---|
| Upload de PDF: "Bucket not found" | Bucket `ltip-public` criado no SQL |
| Foto do membro cadastrado não aparece | Mesma causa — bucket inexistente impedia o upload silenciosamente em alguns casos; agora funciona |
| Botão "Visualizar" no inventário não fazia nada | Agora abre um modal com imagem, descrição, especificações e patrimônio |
| Login automático/sem credenciais reais | Login agora exige e-mail + senha validados no servidor (tabela `admin_users`) |
| Responsividade | Menu hambúrguer funcional no mobile, grids se ajustam em telas pequenas, formulários e tabelas mais compactos em telas <768px |

---

## Arquivos novos/alterados nesta atualização

```
middleware.ts                         ← protege /admin exigindo login
app/api/login/route.ts                ← valida login no servidor
app/admin/login/page.tsx              ← tela de login real
app/admin/configuracoes/page.tsx      ← editor de Sobre/Contato/Logo/Parcerias
app/admin/banner/page.tsx             ← editor de slides com upload de imagem
app/admin/layout.tsx                  ← + botão Sair, + itens de menu novos
app/layout.tsx                        ← busca logo/contato/parcerias do banco
app/page.tsx                          ← slides e Sobre dinâmicos
components/Navbar.tsx                 ← logo dinâmica + menu mobile funcional
components/Footer.tsx                ← contato/parcerias dinâmicos
components/HeroSlider.tsx             ← recebe slides via prop
components/InventoryTable.tsx         ← modal de detalhes no botão "Detalhes"
app/globals.css                       ← responsividade + menu mobile
supabase-migration-2.sql              ← bucket, configuracoes_site, admin_users
```
