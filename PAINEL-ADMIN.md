# Painel administrativo (`/admin`)

O site deixou de ter texto e imagem fixos no código: tudo que aparece na landing
page vem de um documento JSON guardado no Supabase e editável em `/admin`.
O cliente não precisa de GitHub, VS Code nem de qualquer contato com o código.

---

## 1. Como o cliente usa

1. Acessa `https://www.lelrental.com.br/admin`.
2. Entra com e-mail e senha (link “Esqueci minha senha” envia e-mail de troca).
3. Escolhe uma seção no menu lateral (Identidade, Topo, Quem somos, Equipamentos,
   Valores, O que oferecemos, Áreas, Galeria, Depoimentos, Contato).
4. Edita textos, troca fotos (upload direto do computador **ou do celular**),
   adiciona/remove/reordena itens de lista.
5. Clica em **Prévia** para ver o site com as alterações antes de publicar.
6. Clica em **Salvar** — o site público passa a mostrar o novo conteúdo na hora.

Enquanto houver alteração não salva, o painel guarda um rascunho no navegador:
se a aba for recarregada ou o celular travar, o trabalho não se perde.

### Marcações de texto

Dois atalhos funcionam em títulos e textos:

| Você digita | Resultado no site |
| --- | --- |
| `**operar**` | palavra em degradê azul da marca |
| `{{micro-ônibus}}` | o trecho nunca quebra no meio da linha |

---

## 2. Serviços externos

| Serviço | Para quê | Plano |
| --- | --- | --- |
| **Supabase** | banco (conteúdo), login do painel e armazenamento das imagens | free |
| **Vercel** | hospedagem do site (já em uso) | o atual |

Projeto Supabase criado para este site:

- Nome: `lel-rental-cms`
- Região: `sa-east-1` (São Paulo)
- URL: `https://gcnyxrofbanyfxichyms.supabase.co`

Nenhuma dependência npm nova foi adicionada — a conversa com o Supabase é feita
com `fetch`, o que mantém o `bun.lock` intacto e funciona em runtime edge.

---

## 3. Variáveis de ambiente

Cadastre as três na Vercel em **Project Settings → Environment Variables**,
marcando *Production*, *Preview* e *Development* — e também no `.env` local
(veja `.env.example`):

| Variável | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://gcnyxrofbanyfxichyms.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | chave `anon` / `publishable` do projeto |
| `VITE_SITE_SLUG` | `lel-rental` |

As três são públicas por natureza (vão para o navegador). Quem protege os dados
é o Row Level Security do banco, não o segredo da chave. **A chave
`service_role` não é usada em lugar nenhum e não deve ser colocada aqui.**

> Depois de alterar variáveis na Vercel é preciso um novo deploy: elas são
> lidas no momento do build.

---

## 4. Primeiro acesso (criar o login do cliente)

1. Painel do Supabase → **Authentication → Users → Add user**.
2. Informe o e-mail do cliente e uma senha provisória; marque
   *Auto Confirm User*.
3. Pronto: existe um gatilho no banco que torna **a primeira conta criada**
   dona do site automaticamente. O cliente já consegue entrar em `/admin`.
4. Peça para ele trocar a senha pelo link “Esqueci minha senha”.

Para confirmar que o vínculo foi criado, rode no SQL Editor:

```sql
select u.email, m.role, s.slug
  from public.site_members m
  join auth.users u on u.id = m.user_id
  join public.sites s on s.id = m.site_id;
```

Deve aparecer uma linha com `role = owner`. Se vier vazio (o gatilho não rodou
por algum motivo), use o comando de vínculo manual da próxima seção trocando
`'editor'` por `'owner'`.

Para liberar uma segunda pessoa (a partir da segunda conta o vínculo **não** é
automático), rode no SQL Editor:

```sql
insert into public.site_members (site_id, user_id, role)
select s.id, u.id, 'editor'
  from public.sites s, auth.users u
 where s.slug = 'lel-rental'
   and u.email = 'pessoa@empresa.com';
```

### Recomendado

Em **Authentication → Providers → Email**, desligue *Enable sign ups*. Sem isso
qualquer pessoa pode criar uma conta — ela não conseguiria editar nada (não seria
membro do site), mas é lixo desnecessário na base.

---

## 5. Segurança

Quem manda é o Row Level Security do Postgres, não o front-end:

- **Leitura de `sites`**: liberada para todo mundo — é o conteúdo público do site.
- **Escrita em `sites`**: só para quem está logado **e** consta em
  `site_members` daquele site. Um cliente nunca grava no site de outro.
- **Storage (`site-media`)**: leitura pública; gravação só dentro da pasta
  `<site_id>/…`, e só para membros daquele site. Limite de 10 MB e apenas
  formatos de imagem.
- Não existe policy de INSERT/DELETE em `sites`: criar ou apagar um site é
  tarefa administrativa, feita pelo painel do Supabase.
- `/admin` está marcado como `noindex` e bloqueado no `robots.txt`.

Verificação feita: um PATCH anônimo em `/rest/v1/sites` retorna sucesso mas
altera **zero linhas** — o conteúdo permanece intacto.

---

## 6. Estrutura do código

```
src/lib/site/
  content.ts        tipos + DEFAULT_CONTENT (o conteúdo entregue hoje)
  merge.ts          mescla banco sobre defaults, helpers de caminho
  supabase.ts       cliente fetch (REST, Auth, Storage)
  auth.ts           sessão do painel (login, refresh, logout, senha)
  api.ts            ler/salvar conteúdo e subir imagens
  admin-schema.ts   descrição declarativa do painel
  icons.ts          ícones disponíveis para os cards

src/components/site/
  Landing.tsx       a landing page inteira, alimentada por SiteContent
  RichText.tsx      marcações ** ** e {{ }}
  SiteLogo.tsx      logo + nome da marca

src/components/admin/
  fields.tsx        renderiza cada tipo de campo (texto, imagem, lista, ícone…)
  context.tsx       contexto de upload
  useAdminSession.ts

src/routes/
  index.tsx         site público (carrega o conteúdo no SSR)
  admin.tsx         layout do painel
  admin.index.tsx   editor
  admin.login.tsx   login
  admin.preview.tsx prévia do rascunho
  admin.senha.tsx   definir nova senha (link do e-mail)
```

O conteúdo é carregado no **servidor** (loader da rota `/`), então o HTML já sai
pronto para o Google — não há tela em branco nem perda de SEO.

Se o Supabase estiver fora do ar ou sem configuração, o site renderiza o
`DEFAULT_CONTENT` normalmente. Nunca quebra.

### Adicionar um campo novo

Três passos, sem mexer em componente de formulário:

1. `src/lib/site/content.ts` — adicione o campo no tipo e no `DEFAULT_CONTENT`.
2. `src/lib/site/admin-schema.ts` — adicione uma linha na seção desejada.
3. `src/components/site/Landing.tsx` — use o campo onde ele deve aparecer.

Conteúdo já salvo continua funcionando: o merge preenche o campo novo com o
default automaticamente.

---

## 7. Banco de dados

```
public.sites           id, slug, name, content (jsonb), created_at, updated_at
public.site_members    site_id, user_id, role ('owner' | 'editor')
storage bucket         site-media  (público para leitura, 10 MB, só imagens)
```

O modelo já é multi-cliente: para atender um segundo cliente basta inserir outra
linha em `sites` (com outro `slug`), apontar o `VITE_SITE_SLUG` do projeto dele e
cadastrar os membros. As policies já isolam um do outro.
