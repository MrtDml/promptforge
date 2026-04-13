/**
 * Next.js 14 Frontend Generator
 * Generates a complete, production-ready Next.js dashboard for the backend API.
 */

import { ParsedEntity } from '../../parser/dto/parse-prompt.dto';

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toDisplayName(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').trim();
}

export interface FrontendFile {
  path: string;
  content: string;
}

export function generateFrontendFiles(
  appName: string,
  entities: ParsedEntity[],
  hasAuth: boolean,
): FrontendFile[] {
  const files: FrontendFile[] = [];
  const kebabApp = toKebabCase(appName).toLowerCase();

  // package.json
  files.push({
    path: 'frontend/package.json',
    content: JSON.stringify(
      {
        name: `${kebabApp}-frontend`,
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
        dependencies: {
          next: '^14.2.0',
          react: '^18.3.0',
          'react-dom': '^18.3.0',
          axios: '^1.7.0',
          'lucide-react': '^0.436.0',
        },
        devDependencies: {
          typescript: '^5.5.0',
          '@types/node': '^22.0.0',
          '@types/react': '^18.3.0',
          '@types/react-dom': '^18.3.0',
          tailwindcss: '^3.4.0',
          postcss: '^8.4.0',
          autoprefixer: '^10.4.0',
          eslint: '^8.57.0',
          'eslint-config-next': '^14.2.0',
        },
      },
      null,
      2,
    ),
  });

  // next.config.mjs
  files.push({
    path: 'frontend/next.config.mjs',
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
`,
  });

  // tailwind.config.ts
  files.push({
    path: 'frontend/tailwind.config.ts',
    content: `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`,
  });

  // postcss.config.mjs
  files.push({
    path: 'frontend/postcss.config.mjs',
    content: `const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`,
  });

  // tsconfig.json
  files.push({
    path: 'frontend/tsconfig.json',
    content: JSON.stringify(
      {
        compilerOptions: {
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      },
      null,
      2,
    ),
  });

  // .env.example
  files.push({
    path: 'frontend/.env.example',
    content: `# Copy to .env.local and fill in values
NEXT_PUBLIC_API_URL=http://localhost:3000
`,
  });

  // .gitignore
  files.push({
    path: 'frontend/.gitignore',
    content: `.next/
node_modules/
.env.local
.env*.local
out/
build/
`,
  });

  // app/globals.css
  files.push({
    path: 'frontend/app/globals.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0f172a;
  --foreground: #f1f5f9;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: system-ui, sans-serif;
}
`,
  });

  // lib/api.ts
  files.push({
    path: 'frontend/lib/api.ts',
    content: `import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
`,
  });

  // lib/auth.ts
  files.push({
    path: 'frontend/lib/auth.ts',
    content: `export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setUser(user: any): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
`,
  });

  // app/layout.tsx
  files.push({
    path: 'frontend/app/layout.tsx',
    content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${appName}',
  description: 'Generated by PromptForge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  });

  // app/page.tsx (root redirect)
  files.push({
    path: 'frontend/app/page.tsx',
    content: `import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
}
`,
  });

  // app/(auth)/login/page.tsx
  if (hasAuth) {
    files.push({
      path: 'frontend/app/(auth)/login/page.tsx',
      content: `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.data?.access_token ?? res.data.access_token);
      setUser(res.data.data?.user ?? res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">${appName}</h1>
        <p className="text-slate-400 text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          No account?{' '}
          <a href="/register" className="text-indigo-400 hover:text-indigo-300">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
`,
    });

    // app/(auth)/register/page.tsx
    files.push({
      path: 'frontend/app/(auth)/register/page.tsx',
      content: `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.data?.access_token ?? res.data.access_token);
      setUser(res.data.data?.user ?? res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-slate-400 text-sm mb-6">Get started with ${appName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
`,
    });
  }

  // app/dashboard/layout.tsx
  files.push({
    path: 'frontend/app/dashboard/layout.tsx',
    content: `'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';
import Link from 'next/link';

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  ${entities
    .map(
      (e) =>
        `{ label: '${toDisplayName(toPascalCase(e.name))}', href: '/dashboard/${toKebabCase(toPascalCase(e.name))}s' }`,
    )
    .join(',\n  ')},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login');
  }, [router]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-slate-800 bg-slate-900">
        <div className="p-4 border-b border-slate-800">
          <Link href="/dashboard" className="font-bold text-lg text-white">
            ${appName}
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
`,
  });

  // app/dashboard/page.tsx
  files.push({
    path: 'frontend/app/dashboard/page.tsx',
    content: `'use client';

import Link from 'next/link';

const sections = [
  ${entities
    .map(
      (e) =>
        `{ title: '${toDisplayName(toPascalCase(e.name))}s', href: '/dashboard/${toKebabCase(toPascalCase(e.name))}s', description: 'Manage ${toDisplayName(toPascalCase(e.name)).toLowerCase()} records' }`,
    )
    .join(',\n  ')},
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-2">${appName}</h1>
      <p className="text-slate-400 mb-8">Welcome to your dashboard.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors group"
          >
            <h2 className="font-semibold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">
              {section.title}
            </h2>
            <p className="text-slate-400 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
`,
  });

  // Per-entity CRUD pages
  for (const entity of entities) {
    const pascal = toPascalCase(entity.name);
    const kebab = toKebabCase(pascal);
    const display = toDisplayName(pascal);
    const stringFields = entity.fields.filter(
      (f) => !['id', 'createdAt', 'updatedAt'].includes(f.name) && f.type === 'string',
    );
    const titleField = stringFields[0]?.name ?? 'id';

    files.push({
      path: `frontend/app/dashboard/${kebab}s/page.tsx`,
      content: `'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface ${pascal} {
  id: string;
  ${entity.fields
    .filter((f) => !['createdAt', 'updatedAt'].includes(f.name))
    .map(
      (f) =>
        `${f.name}${f.required ? '' : '?'}: ${f.type === 'number' ? 'number' : f.type === 'boolean' ? 'boolean' : 'string'};`,
    )
    .join('\n  ')}
  createdAt?: string;
}

export default function ${pascal}ListPage() {
  const [items, setItems] = useState<${pascal}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  async function fetchItems() {
    try {
      const res = await api.get('/${kebab}s?page=1&limit=50');
      const data = res.data.data ?? res.data;
      setItems(Array.isArray(data) ? data : data.items ?? data.data ?? []);
    } catch {
      setError('Failed to load ${display.toLowerCase()}s');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await api.post('/${kebab}s', { ${titleField}: newName });
      setNewName('');
      await fetchItems();
    } catch {
      setError('Failed to create ${display.toLowerCase()}');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(\`/${kebab}s/\${id}\`);
      await fetchItems();
    } catch {
      setError('Failed to delete');
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">${display}s</h1>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New ${display.toLowerCase()} name..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {creating ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          No ${display.toLowerCase()}s yet. Create one above.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <p className="text-white font-medium text-sm">
                  {String(item.${titleField} ?? item.id)}
                </p>
                {item.createdAt && (
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-300 text-xs transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`,
    });
  }

  // Frontend README
  files.push({
    path: 'frontend/README.md',
    content: `# ${appName} — Frontend

> Generated by [PromptForge](https://promptforgeai.dev)

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **API:** Axios (auto-attaches JWT)
- **Auth:** JWT stored in localStorage

## Quick start

\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL to your backend URL
npm run dev
\`\`\`

Open [http://localhost:3001](http://localhost:3001).

## Pages

| Route | Description |
|-------|-------------|
| \`/login\` | Sign in |
| \`/register\` | Create account |
| \`/dashboard\` | Overview |
${entities.map((e) => `| \`/dashboard/${toKebabCase(toPascalCase(e.name))}s\` | ${toDisplayName(toPascalCase(e.name))} management |`).join('\n')}

## Environment

| Variable | Description |
|----------|-------------|
| \`NEXT_PUBLIC_API_URL\` | Backend API base URL (e.g. http://localhost:3000) |

---

*Scaffolded by PromptForge. Happy building!*
`,
  });

  return files;
}
