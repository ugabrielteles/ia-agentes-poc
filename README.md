# 💰 Sistema de Gestão Financeira

Sistema completo de gestão financeira pessoal e empresarial com suporte a **agentes de IA** do GitHub Copilot para automatizar tarefas de desenvolvimento.

## 🚀 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js 20+, NestJS 10+, TypeScript |
| Frontend | Angular 19+, Angular Material, RxJS |
| Banco de Dados | MongoDB 7 |
| Infraestrutura | Docker, Docker Compose |
| Autenticação | JWT (JSON Web Tokens) |
| Validação | class-validator, class-transformer |

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   Angular   │───▶│   NestJS    │───▶│   MongoDB   │ │
│  │  (porta     │    │  (porta     │    │  (porta     │ │
│  │   4200)     │    │   3000)     │    │  27017)     │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Módulos do Backend

| Módulo | Descrição |
|--------|-----------|
| `auth` | Autenticação JWT + registro |
| `users` | Gestão de usuários e roles |
| `transactions` | CRUD de transações financeiras |
| `categories` | Categorias de transações |
| `menu-config` | **Configuração dinâmica de menus** |
| `reports` | Relatórios e dashboard financeiro |

### Sistema de Roles

| Role | Descrição | Permissões |
|------|-----------|------------|
| `admin` | Administrador | Acesso total |
| `user` | Usuário pessoal | Suas próprias transações |
| `company` | Empresa | Transações empresariais |

---

## ⚡ Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) 24+
- [Docker Compose](https://docs.docker.com/compose/) 2+

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/ia-agentes-poc.git
cd ia-agentes-poc
```

### 2. Configurar variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env

# Edite o arquivo backend/.env com suas configurações
# (especialmente o JWT_SECRET em produção)
```

### 3. Subir o ambiente completo

```bash
docker-compose up
```

O sistema estará disponível em:
- **Frontend:** http://localhost:4200
- **API Backend:** http://localhost:3000/api
- **MongoDB:** localhost:27017

### 4. Desenvolvimento local (sem Docker)

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (em outro terminal)
cd frontend
npm install
npm start
```

---

## 📡 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login com e-mail e senha |
| POST | `/api/auth/register` | Registrar novo usuário |
| GET | `/api/auth/profile` | Perfil do usuário autenticado |

### Usuários (Admin apenas)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Listar todos os usuários |
| POST | `/api/users` | Criar usuário |
| GET | `/api/users/:id` | Buscar usuário |
| PATCH | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Remover usuário |

### Transações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/transactions` | Listar transações do usuário |
| POST | `/api/transactions` | Criar transação |
| GET | `/api/transactions/summary` | Resumo financeiro |
| GET | `/api/transactions/:id` | Buscar transação |
| PATCH | `/api/transactions/:id` | Atualizar transação |
| DELETE | `/api/transactions/:id` | Remover transação |

### Categorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Listar categorias |
| POST | `/api/categories` | Criar categoria (admin) |
| PATCH | `/api/categories/:id` | Atualizar categoria (admin) |
| DELETE | `/api/categories/:id` | Remover categoria (admin) |

### Configuração de Menus
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/menu-config` | Todos os menus (admin) |
| POST | `/api/menu-config` | Criar menu (admin) |
| GET | `/api/menu-config/my-menus` | Menus do usuário logado |
| PATCH | `/api/menu-config/reorder` | Reordenar menus (admin) |
| GET | `/api/menu-config/:id` | Buscar menu (admin) |
| PATCH | `/api/menu-config/:id` | Atualizar menu (admin) |
| DELETE | `/api/menu-config/:id` | Remover menu (admin) |

### Relatórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/reports/dashboard` | Dados do dashboard |
| GET | `/api/reports/monthly?year=2024` | Resumo mensal por ano |
| GET | `/api/reports/by-category` | Relatório por categoria |

---

## 🎛️ Configuração de Menus via Admin

O sistema possui um módulo de **configuração dinâmica de menus** — nenhum menu é hardcoded no frontend.

### Como funciona

1. O administrador acessa `/admin/menu-config`
2. Cria menus com os campos: `label`, `icon` (Material Icons), `route`, `order`, `roles`, `permissions`
3. O frontend busca os menus via `/api/menu-config/my-menus` ao fazer login
4. A sidebar renderiza dinamicamente os menus filtrados pelo role do usuário

### Exemplo de configuração de menu

```json
{
  "label": "Transações",
  "icon": "receipt_long",
  "route": "/transactions",
  "order": 2,
  "isActive": true,
  "isVisible": true,
  "roles": ["admin", "user", "company"],
  "permissions": {
    "canCreate": true,
    "canEdit": true,
    "canDelete": false,
    "canView": true
  }
}
```

### Reordenação por drag-and-drop

Na tela de configuração de menus, arraste os itens para reorganizar a ordem de exibição na sidebar. A nova ordem é persistida automaticamente no banco de dados.

---

## 🤖 Agentes de IA (GitHub Copilot)

O projeto inclui 5 agentes personalizados do GitHub Copilot em `.github/agents/`:

### `po-agent` — Product Owner
- Cria issues com critérios de aceitação em BDD (Dado/Quando/Então)
- Prioriza o backlog usando matriz Impacto vs Esforço
- Define user stories para o sistema financeiro
- **Nunca modifica código de produção diretamente**

**Como usar:**
```
@po-agent Crie uma issue para adicionar filtro por período nas transações
```

### `ux-agent` — UX/UI Designer
- Documenta specs de interface com design tokens
- Define padrões de acessibilidade WCAG 2.1
- Especifica componentes Angular Material
- Cria fluxos de usuário para telas financeiras

**Como usar:**
```
@ux-agent Documente a especificação da tela de dashboard financeiro
```

### `qa-agent` — Quality Assurance
- Escreve testes unitários (Jest/NestJS, Karma/Jasmine/Angular)
- Cria testes e2e com Cypress
- Segue o padrão AAA (Arrange/Act/Assert)
- Garante cobertura mínima de 80%

**Como usar:**
```
@qa-agent Escreva testes para o TransactionsService
```

### `dev-agent` — Desenvolvedor Full-Stack
- Implementa features seguindo os padrões do projeto
- Usa Conventional Commits
- Respeita specs do UX agent
- Cria PRs bem documentados

**Como usar:**
```
@dev-agent Implemente o filtro por categoria nas transações
```

### `db-agent` — Especialista em Banco de Dados
- Cria e otimiza schemas Mongoose (MongoDB) e entities TypeORM (SQL)
- Gera migrations e índices para performance
- Escreve queries otimizadas para bancos relacionais e não relacionais
- Aplica boas práticas de modelagem para o domínio financeiro

**Como usar:**
```
@db-agent Crie um índice composto para otimizar a busca de transações por usuário e data
```

---

## 📁 Estrutura de Pastas

```
ia-agentes-poc/
├── README.md
├── docker-compose.yml
├── .github/
│   └── agents/
│       ├── po-agent.md       # Agente Product Owner
│       ├── ux-agent.md       # Agente UX/UI
│       ├── qa-agent.md       # Agente QA
│       ├── dev-agent.md      # Agente Desenvolvedor
│       └── db-agent.md       # Agente Banco de Dados
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── modules/
│       │   ├── auth/           # JWT auth
│       │   ├── users/          # Gestão de usuários
│       │   ├── transactions/   # Transações financeiras
│       │   ├── categories/     # Categorias
│       │   ├── menu-config/    # ★ Menus dinâmicos
│       │   └── reports/        # Relatórios
│       └── common/
│           ├── guards/         # JwtAuthGuard, RolesGuard
│           ├── decorators/     # @Roles()
│           └── filters/        # HttpExceptionFilter
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── angular.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── main.ts
        ├── environments/
        │   ├── environment.ts
        │   └── environment.prod.ts
        └── app/
            ├── app.module.ts
            ├── app-routing.module.ts
            ├── app.component.ts
            ├── core/
            │   ├── services/   # auth, menu, api
            │   ├── guards/     # auth, admin
            │   ├── interceptors/ # auth
            │   └── models/     # user, transaction, category, menu-config
            ├── shared/
            │   └── components/
            │       ├── sidebar/  # ★ Sidebar dinâmica
            │       └── navbar/
            └── pages/
                ├── login/
                ├── dashboard/
                ├── transactions/
                ├── categories/
                ├── reports/
                └── admin/
                    ├── users/
                    └── menu-config/  # ★ Gestão de menus
```

---

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env`)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@localhost:27017/financeiro?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
```

> ⚠️ **IMPORTANTE:** Sempre altere `JWT_SECRET` para um valor seguro em produção!

---

## 🧪 Testes

```bash
# Backend - testes unitários
cd backend
npm run test

# Backend - com cobertura (mínimo 80%)
npm run test:cov

# Frontend - testes unitários
cd frontend
npm test

# Frontend - modo CI (headless)
npm run test:ci
```

---

## 📝 Conventional Commits

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(transactions): adicionar filtro por categoria
fix(auth): corrigir validação de token expirado
docs(readme): atualizar documentação dos endpoints
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

---

## 📄 Licença

MIT
