# Bolão do Ciço Copa do Mundo 2026:

Sistema web responsivo para bolão da Copa do Mundo 2026, usando Next.js, TypeScript, Tailwind, Prisma e PostgreSQL no Neon.

## Funcionalidades

- Tela inicial com lista de apostas, seleção escolhida e valor.
- Soma total das apostas, com valor fixo de R$ 100,00.
- Tela de login obrigatoria para apostar e apagar apostas.
- Select com as 48 selecoes da Copa 2026 confirmadas pela FIFA.
- Prisma com PostgreSQL, pronto para usar a connection string do Neon.

## Login

- Usuario: `adm`
- Senha: `1234`

## Configuracao

1. Crie um banco PostgreSQL no Neon.
2. Copie `.env.example` para `.env`.
3. Cole sua connection string em `DATABASE_URL`.
4. Rode:

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Depois acesse `http://localhost:3000`.

## Fonte das selecoes

A lista foi criada a partir da pagina oficial da FIFA de equipes classificadas para a Copa do Mundo 2026.
