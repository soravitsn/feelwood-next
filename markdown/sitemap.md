feelwood/
├── sanity/                   # Sanity Studio
│   ├── schemaTypes/
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── blog.ts
│   │   ├── project.ts
│   │   └── promotion.ts
│   ├── sanity.config.ts
│   └── sanity.cli.ts
│
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   └── lib/
│       ├── sanity.client.ts
│       └── sanity.queries.ts
│
├── .env.local
├── package.json
└── tsconfig.json
