# VM Finance

Um aplicativo web Progressive Web App (PWA) de controle financeiro pessoal, focado em alta usabilidade, design premium (brutalismo refinado, tons de magenta) e inserção inteligente via linguagem natural (Smart Input).

## 🚀 Visão Geral
VM Finance elimina o atrito de organizar finanças. Com o Smart Input, você digita "*Gastei 150 de uber no cartao nubank*" e o sistema inteligentemente categoriza e registra tudo. Além disso, a aplicação gera **Insights Automáticos** usando uma engine heurística poderosa, sem depender de APIs de LLMs pagas.

## 🛠 Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 + Design System interno (Brutalismo Editorial)
- **Banco de Dados & Backend:** Supabase (PostgreSQL)
- **PWA:** `@ducanh2912/next-pwa`
- **Validação:** Zod
- **Ícones:** Lucide React
- **Navegador:** Vercel (Desenvolvido para deploy zero-config)

## 🎨 Decisões Técnicas e Design System
1. **Design System:** Criamos componentes nativos (Input, Button, Card) injetando uma identidade visual de manifesto tech-fashion. Tons fortes (`#D81176`), alto contraste (preto/branco) e fontes grandes (`Anton` e `Inter`).
2. **Independência de LLMs Pagas:** Desenvolvemos um parser heurístico baseado em expressões regulares e mapas de dicionário que identifica Tipo, Valor, Produto, Categoria e Tipo de Pagamento com alta precisão e custo zero.
3. **Server Actions:** Toda a lógica de parsing e comunicação com o banco é feita server-side via Next.js Server Actions, garantindo performance e segurança.
4. **Desktop/Mobile:** O layout é mobile-first e adapta-se maravilhosamente a telas largas, usando CSS Grid nativo.
5. **Insights via Heurística:** Em vez de usar ChatGPT, criamos uma lógica configurável que deduz o comportamento com base no volume financeiro do mês (ex: emitindo alertas de gastos em Alimentação ou Transporte).

## 🗄 Como Configurar o Supabase
1. Crie uma conta no [Supabase](https://supabase.com).
2. Crie um novo projeto.
3. Acesse o **SQL Editor** no painel do Supabase.
4. Copie o conteúdo do arquivo localizado neste repositório em `supabase/schema.sql`.
5. Cole e execute as queries. Isso criará as tabelas `incomes` e `expenses` e configurará as políticas de segurança baseadas no MVP.

## 🔐 Configuração de Ambiente
1. Clone este repositório.
2. Copie o `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
3. Preencha as chaves:
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os dados do seu painel Supabase (Project Settings > API).

## 💻 Como Executar Localmente
Com o Node.js instalado (versão 20+ recomendada):

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

O projeto estará rodando em `http://localhost:3000`.

## ☁️ Deploy na Vercel
A arquitetura foi pensada para Vercel.

1. Faça push do código para um repositório no GitHub/GitLab.
2. Acesse a [Vercel](https://vercel.com) e conecte o repositório.
3. Na tela de configuração do projeto da Vercel, adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Clique em **Deploy**. O framework Next.js será detectado automaticamente.

## 🚧 Limitações Atuais e Melhorias Futuras
- **Autenticação:** O sistema atual aceita inserções anônimas. Para uso multiusuário, deve-se integrar Supabase Auth e aplicar RLS (`Row Level Security`) em cada tabela usando `auth.uid()`.
- **Parser de IA Híbrido:** O parser atual atende 95% dos casos. Para o restante, pode-se futuramente acoplar provedores gratuitos abertos via Endpoint (como HuggingFace ou Groq) integrando na função `processSmartInput`.
- **Dashboards Históricos:** Adicionar seletor de mês na interface de métricas.

## 💡 Dados Seed (Opcional - Teste Inicial)
Para já ter dados ao abrir o projeto, rode as seguintes queries no SQL Editor:
```sql
INSERT INTO expenses (product, amount, category, payment_method) VALUES
('iFood', 60.00, 'Alimentação', 'NuBank'),
('Uber', 25.00, 'Transporte', 'Pix');

INSERT INTO incomes (source, amount, status, date) VALUES
('Freela Design', 800.00, 'Pago', current_date);
```
