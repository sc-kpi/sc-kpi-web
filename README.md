# SC KPI Web

Frontend application for the Student Council at Igor Sikorsky Kyiv Polytechnic Institute.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.x | App Router, Turbopack, React 19 |
| TypeScript | 5.x | Strict mode |
| TailwindCSS | 4 | Utility-first CSS |
| shadcn/ui | latest | Component library (Zinc, new-york style) |
| Biome | 2.x | Linter + formatter |
| next-intl | latest | i18n (Ukrainian default + English) |
| TanStack Query | v5 | Server state / data fetching |
| Vitest | latest | Unit / component tests |
| Playwright | latest | E2E tests |
| pnpm | 10.x | Package manager |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 10

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Run Biome linter with auto-fix |
| `pnpm format` | Format code with Biome |
| `pnpm check` | Run Biome CI (lint + format check) |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run unit tests |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:coverage` | Run unit tests with coverage |
| `pnpm test:e2e` | Run E2E tests with Playwright |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # TailwindCSS 4 + shadcn theme
│   ├── layout.tsx          # Root layout
│   └── [locale]/           # Locale-based routing
│       ├── layout.tsx      # Locale layout (providers)
│       ├── page.tsx        # Home page
│       ├── (public)/       # Public routes
│       ├── (auth)/         # Auth routes
│       ├── (dashboard)/    # Protected routes
│       └── admin/          # Admin routes
├── features/               # Domain modules
│   ├── auth/               # Authentication
│   ├── user/               # User management
│   ├── engagements/        # Clubs & Projects
│   ├── council/            # Departments
│   ├── documents/          # Documents
│   └── notifications/      # Notifications
├── shared/
│   ├── ui/                 # shadcn/ui components
│   ├── components/         # App-wide components
│   ├── hooks/              # Shared hooks
│   └── types/              # Shared types
├── lib/                    # Utilities
│   ├── api-client.ts       # Typed fetch wrapper
│   ├── query-client.ts     # TanStack Query config
│   ├── utils.ts            # cn() helper
│   └── constants.ts        # API route constants
├── i18n/                   # Internationalization
│   ├── routing.ts          # Locale routing config
│   ├── request.ts          # Server request config
│   └── navigation.ts       # Localized navigation
└── middleware.ts            # Auth + i18n middleware
```

## Docker

```bash
# Build and run
docker compose up --build

# Or build only
docker compose build
```

The web application runs on port 3000 and connects to the API via the `sc-kpi-network` Docker network.

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure `pnpm check` and `pnpm typecheck` pass
4. Run tests: `pnpm test`
5. Submit a pull request to `develop`
