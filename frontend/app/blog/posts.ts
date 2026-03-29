export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: number; // minutes
  category: string;
  content: string; // HTML
}

export const posts: BlogPost[] = [
  {
    slug: "build-saas-with-ai-in-5-minutes",
    title: "How to Build a SaaS App with AI in Under 5 Minutes",
    description:
      "Stop spending weeks on boilerplate. Learn how AI code generation lets you go from idea to a production-ready NestJS + PostgreSQL backend in minutes.",
    date: "2026-03-15",
    readTime: 6,
    category: "Tutorial",
    content: `
<p>Building a SaaS application from scratch has always been painful. Before you write a single line of business logic, you spend days — sometimes weeks — on authentication, database schemas, API routing, Docker configuration, and documentation. Most of that work is identical across every project.</p>

<p>AI code generation is changing that. With PromptForge, you describe your idea in plain English and receive a complete, production-ready NestJS backend in under five minutes. Here's exactly how it works.</p>

<h2>Step 1: Describe Your Idea</h2>

<p>Start with a clear, concrete description. The more specific you are, the better the output. Instead of "make a project management tool," try:</p>

<blockquote>"A project management SaaS with user authentication, workspaces, projects, tasks with priorities and due dates, team member invitations, and a Kanban board view. Users can assign tasks to teammates and get notified when tasks are updated."</blockquote>

<p>PromptForge parses this into a structured schema — identifying entities (User, Workspace, Project, Task, Invitation), their relationships, and the features that need to be generated.</p>

<h2>Step 2: Review the Schema</h2>

<p>Before generating code, PromptForge shows you the parsed data model. You can verify that it understood your intent correctly:</p>

<ul>
  <li><strong>Entities</strong>: User, Workspace, Project, Task, Invitation</li>
  <li><strong>Relations</strong>: User → many Tasks (assigned), Workspace → many Projects</li>
  <li><strong>Features detected</strong>: auth, crud, api, notifications</li>
</ul>

<p>This step prevents surprises. If something is off, you refine the prompt and re-parse in seconds.</p>

<h2>Step 3: Generate</h2>

<p>Click Generate and wait roughly 30–60 seconds. PromptForge outputs a complete project scaffold:</p>

<ul>
  <li>NestJS modules for every entity (controllers, services, DTOs, validation)</li>
  <li>Prisma schema with all relationships and migrations</li>
  <li>JWT authentication with refresh tokens</li>
  <li>Swagger/OpenAPI documentation, auto-generated</li>
  <li>Docker Compose for local development</li>
  <li>Environment variable template (.env.example)</li>
</ul>

<h2>Step 4: Download and Run</h2>

<p>Download the ZIP, extract, and run:</p>

<pre><code>npm install
npx prisma migrate dev
npm run start:dev</code></pre>

<p>Your API is running. Import the Postman collection that was also generated, and you can hit every endpoint immediately.</p>

<h2>What You're Not Writing</h2>

<p>In a typical project, this boilerplate takes 3–5 days to write correctly — including setting up guards, pipes, interceptors, error handling, and tests. AI generation eliminates all of it. You start on day one writing the logic that actually differentiates your product.</p>

<h2>When AI Generation Makes Sense</h2>

<p>This approach works best for:</p>
<ul>
  <li>Validating a new product idea quickly before committing weeks of engineering</li>
  <li>Building an MVP for early customer feedback</li>
  <li>Starting a new service in a microservices architecture</li>
  <li>Freelancers who need to deliver projects faster</li>
</ul>

<p>It is not a replacement for a senior engineer's judgment on complex architectural decisions. But for the 80% of SaaS applications that follow well-established patterns, AI generation gives you a running start.</p>

<p>Try it for your next project at <a href="https://promptforgeai.dev">promptforgeai.dev</a>. The free plan gives you three full generations — enough to validate your idea.</p>
    `,
  },

  {
    slug: "nestjs-boilerplate-vs-generator",
    title: "NestJS Boilerplate vs AI Generator: Which Should You Use?",
    description:
      "Comparing the traditional NestJS boilerplate approach with AI-powered code generation. When to use each, and what the real trade-offs are.",
    date: "2026-03-08",
    readTime: 7,
    category: "Engineering",
    content: `
<p>When starting a new NestJS project, developers face a familiar decision: clone a boilerplate repository, or generate what you need from scratch. Now there's a third option: AI code generation. Let's look at all three honestly.</p>

<h2>The Traditional Boilerplate</h2>

<p>Boilerplates like <code>nestjs/typescript-starter</code> or community repositories like <code>nestjs-boilerplate</code> give you a running start with sensible defaults. Typical inclusions:</p>

<ul>
  <li>Module structure following NestJS conventions</li>
  <li>TypeORM or Prisma setup</li>
  <li>JWT authentication scaffolding</li>
  <li>Environment variable handling</li>
  <li>Basic testing setup</li>
</ul>

<p><strong>The problem:</strong> Boilerplates are generic. They don't know your entities, your business rules, or your feature set. After cloning, you spend hours deleting what you don't need and adding what you do. If the boilerplate uses TypeORM and you want Prisma, or uses class-validator but you prefer Zod, you're refactoring before you've written a line of business logic.</p>

<h2>Building From Scratch</h2>

<p>Some teams — particularly those with strong NestJS experience — prefer to build from scratch using the CLI:</p>

<pre><code>nest new my-app
nest generate module users
nest generate controller users
nest generate service users</code></pre>

<p>This gives full control. Every decision is deliberate. But for a mid-complexity SaaS with five or six entities, you're looking at two to three days of setup before the interesting work begins. And that's assuming you know exactly what you're building from the start.</p>

<h2>AI Code Generation</h2>

<p>AI generation sits between these approaches. You describe your application in natural language, and the generator creates a tailored scaffold — not generic, but not hand-crafted either.</p>

<p>The key difference from a boilerplate: the output matches your domain model. The generated Prisma schema has your entities and relations. The generated modules, controllers, and services match those entities. The Swagger documentation describes your actual API.</p>

<p><strong>What it does well:</strong></p>
<ul>
  <li>Zero configuration for standard patterns (CRUD, auth, relations)</li>
  <li>Consistent code structure across all modules</li>
  <li>Generates documentation alongside code</li>
  <li>No cleanup needed — you only get what you asked for</li>
</ul>

<p><strong>Limitations:</strong></p>
<ul>
  <li>Complex business logic still needs to be written manually</li>
  <li>Highly non-standard requirements may not fit the generator's patterns</li>
  <li>You need to understand the generated code to extend it effectively</li>
</ul>

<h2>The Right Choice</h2>

<p>The answer depends on your situation:</p>

<ul>
  <li><strong>Use a boilerplate</strong> if you have strong preferences about the setup and want full control from day one.</li>
  <li><strong>Build from scratch</strong> if the application has unusual architectural requirements or your team has deep NestJS expertise and time to spare.</li>
  <li><strong>Use AI generation</strong> if you're building a standard SaaS pattern, need to move fast, or want to validate an idea before investing in custom architecture.</li>
</ul>

<p>For most product teams and solo founders, AI generation wins on speed without sacrificing the quality of the output. The generated code follows NestJS best practices, uses Prisma (the current community standard for Node.js ORMs), and produces clean, readable code that experienced engineers can extend without friction.</p>
    `,
  },

  {
    slug: "prisma-schema-generator-guide",
    title: "Generating Prisma Schemas Automatically: A Practical Guide",
    description:
      "How to stop hand-writing Prisma schemas. Learn how AI schema generation works, what it gets right, and how to handle edge cases.",
    date: "2026-02-24",
    readTime: 5,
    category: "Tutorial",
    content: `
<p>Prisma has become the dominant ORM for Node.js and TypeScript projects — and for good reason. Its schema language is readable, its migration system is reliable, and Prisma Client gives you type-safe database access out of the box.</p>

<p>But writing Prisma schemas by hand for a new project with multiple entities, relations, and constraints is tedious. You need to get the relation syntax exactly right, remember to add indexes for foreign keys, and ensure your field types map correctly to the target database. AI generation can handle all of this.</p>

<h2>What a Generated Schema Looks Like</h2>

<p>For a SaaS application with users, teams, and projects, you might describe:</p>

<blockquote>"Users belong to one team. Teams have many projects. Projects have tasks that can be assigned to users."</blockquote>

<p>The generated schema:</p>

<pre><code>model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([teamId])
  @@map("users")
}

model Team {
  id        String    @id @default(cuid())
  name      String
  users     User[]
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("teams")
}

model Project {
  id        String   @id @default(cuid())
  name      String
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([teamId])
  @@map("projects")
}

model Task {
  id          String   @id @default(cuid())
  title       String
  completed   Boolean  @default(false)
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?    @relation(fields: [assigneeId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([projectId])
  @@index([assigneeId])
  @@map("tasks")
}</code></pre>

<p>Notice the details the generator handles automatically: CUID identifiers, timestamps on every model, index on every foreign key, cascade deletes where appropriate, nullable optional relations, and table name mapping.</p>

<h2>What to Review After Generation</h2>

<p>AI generation gets the structure right reliably. Review these areas manually:</p>

<ul>
  <li><strong>Cascade behavior</strong>: Check that <code>onDelete</code> rules match your data retention requirements.</li>
  <li><strong>Unique constraints</strong>: If certain field combinations need to be unique (e.g., one user per team), add <code>@@unique</code> manually.</li>
  <li><strong>Enum values</strong>: Generated enums use sensible defaults; customize the values to match your domain vocabulary.</li>
  <li><strong>Indexes</strong>: For high-traffic tables, consider adding indexes on fields you'll filter by frequently (e.g., <code>status</code>, <code>createdAt</code>).</li>
</ul>

<h2>Running Migrations</h2>

<p>Once you're satisfied with the schema, run migrations the standard Prisma way:</p>

<pre><code>npx prisma migrate dev --name init</code></pre>

<p>The generated Prisma schema is a valid, production-ready starting point. You'll extend it as requirements evolve — but you won't be writing the tedious foundation by hand.</p>
    `,
  },

  {
    slug: "promptforge-vs-lovable-bolt-v0",
    title: "PromptForge vs Lovable vs Bolt.new vs v0: Which AI Builder is Right for Backend Developers?",
    description:
      "An honest comparison of the major AI code generation tools. Which one should backend developers choose, and why the differences matter more than the marketing.",
    date: "2026-02-10",
    readTime: 8,
    category: "Comparison",
    content: `
<p>The AI code generation space is crowded. Lovable, Bolt.new, v0 by Vercel, and PromptForge all promise to turn your descriptions into working applications. But they make very different trade-offs, and choosing the wrong tool for your use case costs time rather than saving it.</p>

<h2>What Each Tool Focuses On</h2>

<p><strong>v0 by Vercel</strong> is a UI component generator. Describe a component, get React/Tailwind code. It is excellent at what it does — generating clean frontend components — but it doesn't touch your backend, database, or deployment. It's a specialist tool, not a full-stack builder.</p>

<p><strong>Lovable</strong> targets non-technical founders who want to build a complete application without writing any code. It generates full-stack apps with a visual interface and handles deployment. The trade-off: the output is a locked platform. You can't easily take the generated code, modify the architecture, and deploy it yourself. You're building on Lovable's infrastructure.</p>

<p><strong>Bolt.new</strong> runs a full development environment in the browser, letting you describe and iterate on applications interactively. It's impressive for rapid prototyping. The output is more customizable than Lovable's, but the focus is on browser-based iteration rather than producing deployment-ready backend code.</p>

<p><strong>PromptForge</strong> targets developers who need a production-ready backend, not a prototype. The output is standard NestJS code with Prisma, JWT authentication, Swagger documentation, and Docker — code you own completely, can deploy anywhere, and can extend with standard development tools.</p>

<h2>The Key Distinction: Code Ownership</h2>

<p>This is the most important differentiator. When you generate code with PromptForge, you receive a ZIP file containing your project. It's yours. Deploy it on Railway, Render, AWS, your own server — wherever you want. Modify it in your editor. Run it locally. Add it to version control. It behaves like code you wrote yourself.</p>

<p>Platforms like Lovable abstract this away. That's a feature for non-technical users, but it's a constraint for developers who need control over their infrastructure, dependencies, and deployment pipeline.</p>

<h2>Backend vs Frontend Focus</h2>

<table>
  <thead>
    <tr><th>Tool</th><th>Backend</th><th>Frontend</th><th>Database</th><th>Deploy</th></tr>
  </thead>
  <tbody>
    <tr><td>PromptForge</td><td>✅ NestJS</td><td>Optional</td><td>✅ Prisma + PG</td><td>Any</td></tr>
    <tr><td>Lovable</td><td>Limited</td><td>✅ React</td><td>Supabase</td><td>Lovable platform</td></tr>
    <tr><td>Bolt.new</td><td>Basic</td><td>✅ React</td><td>Basic</td><td>Manual</td></tr>
    <tr><td>v0</td><td>❌</td><td>✅ Components</td><td>❌</td><td>❌</td></tr>
  </tbody>
</table>

<h2>Which Should You Use?</h2>

<ul>
  <li><strong>You're a backend developer</strong> who needs a scaffold for a new API service → PromptForge</li>
  <li><strong>You're a non-technical founder</strong> who wants to launch an MVP without writing code → Lovable</li>
  <li><strong>You need a React component</strong> quickly → v0</li>
  <li><strong>You want to prototype and iterate</strong> visually in the browser → Bolt.new</li>
</ul>

<p>The tools serve different audiences. For developers who will deploy, maintain, and extend the code themselves, PromptForge produces output that fits naturally into a professional development workflow. For everyone else, Lovable and Bolt.new offer more hand-holding at the cost of control.</p>
    `,
  },

  {
    slug: "rest-api-authentication-nestjs-jwt",
    title: "REST API Authentication with NestJS and JWT: The Complete Setup",
    description:
      "A production-ready guide to implementing JWT authentication in NestJS — access tokens, refresh tokens, guards, and common pitfalls to avoid.",
    date: "2026-01-28",
    readTime: 9,
    category: "Engineering",
    content: `
<p>JWT authentication is one of those things that looks simple but has a dozen ways to go wrong. After implementing it across many NestJS services — and seeing what AI generators like PromptForge produce — here's the pattern that works reliably in production.</p>

<h2>The Core Architecture</h2>

<p>A production-ready JWT setup requires two tokens, not one:</p>

<ul>
  <li><strong>Access token</strong>: Short-lived (15 minutes to 1 hour). Sent with every API request. Stateless — no database lookup required to validate.</li>
  <li><strong>Refresh token</strong>: Long-lived (7–30 days). Used only to obtain a new access token. Should be stored securely (httpOnly cookie or secure storage).</li>
</ul>

<p>Most tutorials stop at the access token. That's fine for learning, but in production it means users get logged out every hour and have no way to silently re-authenticate.</p>

<h2>Setting Up Passport and JWT in NestJS</h2>

<pre><code>// auth.module.ts
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}</code></pre>

<h2>The JWT Strategy</h2>

<pre><code>// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; type: string }) {
    if (payload.type !== 'access') throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}</code></pre>

<p>Notice the <code>type</code> claim check. This prevents a refresh token from being used as an access token — a subtle but real security issue if you don't distinguish them.</p>

<h2>Generating Tokens</h2>

<pre><code>private generateAccessToken(userId: string, email: string): string {
  return this.jwtService.sign(
    { sub: userId, email, type: 'access' },
    { expiresIn: '1h' }
  );
}

private generateRefreshToken(userId: string, email: string): string {
  return this.jwtService.sign(
    { sub: userId, email, type: 'refresh' },
    { expiresIn: '30d' }
  );
}</code></pre>

<h2>The Refresh Endpoint</h2>

<pre><code>@Post('refresh')
async refresh(@Body() body: { refreshToken: string }) {
  const payload = this.jwtService.verify(body.refreshToken, {
    secret: this.config.get('JWT_SECRET'),
  });

  if (payload.type !== 'refresh') {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const user = await this.usersService.findById(payload.sub);
  if (!user?.isActive) throw new UnauthorizedException();

  return { token: this.generateAccessToken(user.id, user.email) };
}</code></pre>

<h2>Common Pitfalls</h2>

<p><strong>1. Using the same secret for access and refresh tokens.</strong> Fine for many applications, but if you want to revoke refresh tokens independently, use separate secrets.</p>

<p><strong>2. Not checking <code>isActive</code> on the refresh endpoint.</strong> If a user is banned but has a valid refresh token, they'll keep generating new access tokens indefinitely unless you check their status on each refresh.</p>

<p><strong>3. Storing refresh tokens in localStorage.</strong> Vulnerable to XSS. Use httpOnly cookies for the refresh token, and keep the access token in memory (or sessionStorage at minimum).</p>

<p><strong>4. Not handling token expiry on the client.</strong> Intercept 401 responses, call the refresh endpoint, and retry the original request. Without this, users get logged out silently whenever their access token expires.</p>

<h2>Generated vs Hand-Written</h2>

<p>PromptForge generates this full authentication setup automatically — including the refresh token flow, the JWT guard, the strategy, and the client-side interceptor — as part of every project. For most applications, the generated code handles these cases correctly out of the box. You only need to customize when your requirements diverge from the standard pattern.</p>
    `,
  },
  // ─── Post 6 ───────────────────────────────────────────────────────────────────
  {
    slug: "nestjs-vs-express-2026",
    title: "NestJS vs Express: Which Backend Framework to Use in 2026",
    description:
      "A practical comparison of NestJS and Express.js for building production APIs. We cover architecture, scalability, TypeScript support, and when to use each.",
    date: "2026-03-18",
    readTime: 8,
    category: "Comparison",
    content: `
<p>Choosing a backend framework for your next project? NestJS and Express are the two most popular Node.js options — but they serve very different needs. This guide cuts through the marketing and tells you exactly when to use each one.</p>

<h2>The Short Answer</h2>

<p><strong>Use NestJS</strong> when you're building a complex application that needs to scale — a SaaS product, an enterprise API, or anything with multiple teams working on the same codebase.</p>

<p><strong>Use Express</strong> when you need a lightweight, unopinionated server fast — a webhook handler, a simple REST API, or a prototype you'll throw away.</p>

<h2>Architecture</h2>

<p>Express is a minimal HTTP library. It gives you routing and middleware, and nothing else. Every architecture decision — folder structure, dependency injection, validation, configuration — is yours to make. That's powerful for simple apps, but it becomes a liability at scale. Ten different Express projects at a company will have ten different structures.</p>

<p>NestJS is an opinionated framework built on top of Express (or Fastify). It borrows heavily from Angular's architecture: modules, services, controllers, decorators, and dependency injection are all first-class citizens. You spend less time making architectural decisions and more time building features.</p>

<h2>TypeScript Support</h2>

<p>Express technically works with TypeScript, but it was designed for JavaScript. You'll spend time adding type declarations, configuring tsconfig, and finding community-maintained types (<code>@types/express</code>).</p>

<p>NestJS is written in TypeScript from the ground up. Decorators, metadata reflection, and type inference are built into the framework. The result is a significantly better IDE experience — autocompletion, refactoring, and compile-time error catching that Express simply can't match.</p>

<h2>Boilerplate</h2>

<p>This is where Express wins. A working HTTP server in Express:</p>

<pre><code>const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ ok: true }));
app.listen(3000);</code></pre>

<p>NestJS requires a module, controller, and main.ts — more files, but each with a clear responsibility. For large projects, this structure pays dividends. For a 200-line API, it's overhead.</p>

<h2>Ecosystem and Integrations</h2>

<p>NestJS has first-party packages for nearly everything modern applications need: <code>@nestjs/jwt</code>, <code>@nestjs/passport</code>, <code>@nestjs/config</code>, <code>@nestjs/typeorm</code>, <code>@nestjs/prisma</code>, and more. Each follows the same module pattern, so integrations feel native rather than bolted on.</p>

<p>Express relies on the broader npm ecosystem. You'll find packages for everything, but you're responsible for wiring them together consistently.</p>

<h2>Performance</h2>

<p>Raw Express is slightly faster than NestJS, since NestJS adds a layer of abstraction. In practice, the difference is negligible — both can handle thousands of requests per second on commodity hardware. Your database queries and external API calls will bottleneck your application long before the framework does.</p>

<p>If raw throughput matters above all else, use NestJS with Fastify as the underlying adapter instead of Express — you get the framework's structure with near-native performance.</p>

<h2>Learning Curve</h2>

<p>Express is beginner-friendly. The concepts (routes, middleware, request/response) map directly to HTTP. Most developers are productive in Express within a day.</p>

<p>NestJS has a steeper curve. Dependency injection, decorators, and module systems are powerful but unfamiliar to developers coming from plain JavaScript. Budget a few days to internalize the patterns before your velocity picks up.</p>

<h2>When to Use NestJS</h2>

<ul>
<li>Building a SaaS product or multi-module API</li>
<li>Working in a team of more than two developers</li>
<li>You want TypeScript as a first-class citizen</li>
<li>You need built-in validation, guards, interceptors, or pipes</li>
<li>You're generating code — AI tools like PromptForge generate NestJS because the structure is predictable and machine-readable</li>
</ul>

<h2>When to Use Express</h2>

<ul>
<li>Prototyping or building an MVP you might throw away</li>
<li>A small, single-purpose API (webhook receiver, file uploader)</li>
<li>Migrating a legacy JavaScript project incrementally</li>
<li>You already know Express deeply and the project scope is small</li>
</ul>

<h2>The Bottom Line</h2>

<p>For any project you expect to grow, NestJS is the better default in 2026. The initial boilerplate cost is front-loaded, but it pays back quickly as your application scales. Express remains excellent for small, focused services where structure gets in the way.</p>

<p>PromptForge generates production-ready NestJS projects — including modules, services, controllers, Prisma integration, JWT auth, and Docker configuration — from a single natural language prompt. If you want to skip the setup entirely, <a href="/register">try it free</a>.</p>
    `,
  },

  // ─── Post 7 ───────────────────────────────────────────────────────────────────
  {
    slug: "deploy-nestjs-to-railway",
    title: "How to Deploy a NestJS App to Railway in 10 Minutes",
    description:
      "Step-by-step guide to deploying a NestJS + PostgreSQL application to Railway, including environment variables, Dockerfile setup, and custom domains.",
    date: "2026-03-20",
    readTime: 7,
    category: "Tutorial",
    content: `
<p>Railway has become one of the best platforms for deploying backend applications. It's fast, the free tier is generous, and PostgreSQL is built in. This guide walks you through deploying a NestJS application from zero to production in about ten minutes.</p>

<h2>Prerequisites</h2>

<ul>
<li>A NestJS application in a GitHub repository</li>
<li>A Railway account (free tier works)</li>
<li>PostgreSQL as your database (Railway provides it)</li>
</ul>

<h2>Step 1: Add a Dockerfile</h2>

<p>Railway can detect Node.js projects automatically, but a Dockerfile gives you full control over the build. Here's a production-optimized Dockerfile for NestJS:</p>

<pre><code>FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/main"]</code></pre>

<p>This uses a multi-stage build — the first stage compiles TypeScript, the second stage copies only the compiled output and production dependencies. The final image is lean and fast to start.</p>

<h2>Step 2: Configure Your App to Listen on PORT</h2>

<p>Railway assigns a dynamic port via the <code>PORT</code> environment variable. Your NestJS <code>main.ts</code> must read it:</p>

<pre><code>async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(\`Application running on port \${port}\`);
}
bootstrap();</code></pre>

<h2>Step 3: Create a Railway Project</h2>

<ol>
<li>Go to <strong>railway.app</strong> and sign in with GitHub</li>
<li>Click <strong>New Project</strong> → <strong>Deploy from GitHub repo</strong></li>
<li>Select your repository</li>
<li>Railway will detect the Dockerfile and start building</li>
</ol>

<h2>Step 4: Add PostgreSQL</h2>

<ol>
<li>In your Railway project, click <strong>New</strong> → <strong>Database</strong> → <strong>PostgreSQL</strong></li>
<li>Railway creates the database and automatically provides <code>DATABASE_URL</code></li>
<li>In your NestJS service, reference it: <code>process.env.DATABASE_URL</code></li>
</ol>

<p>If you're using Prisma, add a <code>postinstall</code> script to generate the client automatically:</p>

<pre><code>// package.json
"scripts": {
  "postinstall": "prisma generate",
  "build": "nest build"
}</code></pre>

<h2>Step 5: Set Environment Variables</h2>

<p>In Railway's dashboard, go to your service → <strong>Variables</strong> and add:</p>

<pre><code>NODE_ENV=production
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app</code></pre>

<p>Railway automatically injects <code>DATABASE_URL</code> from the PostgreSQL service — you don't need to set it manually.</p>

<h2>Step 6: Run Prisma Migrations</h2>

<p>The safest approach is to run migrations before starting the server. Add this to your Dockerfile CMD or a start script:</p>

<pre><code>CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]</code></pre>

<p>Or use Railway's <strong>Start Command</strong> override in the service settings.</p>

<h2>Step 7: Custom Domain</h2>

<ol>
<li>In Railway, go to your service → <strong>Settings</strong> → <strong>Networking</strong> → <strong>Custom Domain</strong></li>
<li>Enter your domain (e.g., <code>api.yourdomain.com</code>)</li>
<li>Add a CNAME record at your DNS provider pointing to the Railway-provided hostname</li>
<li>Railway provisions an SSL certificate automatically</li>
</ol>

<h2>Monitoring Your Deployment</h2>

<p>Railway shows real-time logs in the <strong>Deployments</strong> tab. If your build fails, the logs will tell you exactly why. Common issues:</p>

<ul>
<li><strong>PORT not set</strong>: Make sure your app reads <code>process.env.PORT</code></li>
<li><strong>Prisma client not generated</strong>: Add <code>prisma generate</code> to your build step</li>
<li><strong>Missing env vars</strong>: Check the Variables tab for typos</li>
</ul>

<h2>Automating This With PromptForge</h2>

<p>Every project generated by PromptForge includes a production-ready Dockerfile, a <code>railway.json</code> configuration, and a Prisma setup that's compatible with Railway's PostgreSQL. You can go from prompt to deployed API in under 15 minutes — no manual configuration required. <a href="/register">Try it free</a>.</p>
    `,
  },

  // ─── Post 8 ───────────────────────────────────────────────────────────────────
  {
    slug: "what-is-ai-code-generation",
    title: "What Is AI Code Generation? A Developer's Guide for 2026",
    description:
      "AI code generation is transforming how developers build software. This guide explains how it works, what it's good at, its real limitations, and how to get the most out of it.",
    date: "2026-03-22",
    readTime: 9,
    category: "Engineering",
    content: `
<p>AI code generation is no longer a novelty — it's a core part of how modern developers work. But there's a wide spectrum between "GitHub Copilot autocompletes a line" and "an AI builds your entire application." Understanding where tools fall on that spectrum helps you choose the right one.</p>

<h2>How AI Code Generation Works</h2>

<p>Modern code generation tools are built on large language models (LLMs) trained on billions of lines of code from open-source repositories, documentation, and programming tutorials. These models learn the statistical patterns in code — which functions tend to appear together, how data structures are typically shaped, which APIs are commonly used with which libraries.</p>

<p>When you give a model a natural language prompt, it generates a probability distribution over possible next tokens (roughly: characters or word-pieces) and samples from that distribution to produce output. The "intelligence" in the output comes from having seen enough similar patterns during training to generate plausible completions.</p>

<h2>Three Categories of Code Generation</h2>

<p><strong>Line and function completion</strong> (GitHub Copilot, Cursor tab, IDE extensions): The AI watches what you type and suggests the next few lines. Fast, low-effort, and already standard in most editors. Best for reducing repetitive typing within a file you're already writing.</p>

<p><strong>Conversational coding</strong> (Claude, ChatGPT, Gemini): You describe what you want in a chat interface and the model writes or rewrites code in response. Good for generating implementations, explaining existing code, debugging, and writing tests. Requires back-and-forth to get the output right.</p>

<p><strong>Scaffolding and project generation</strong> (PromptForge, v0, Lovable): The AI generates an entire project structure from a high-level description — files, modules, configuration, and dependencies all at once. Best for starting new projects without spending days on boilerplate.</p>

<h2>What AI Code Generation Is Good At</h2>

<ul>
<li><strong>Boilerplate</strong>: CRUD endpoints, authentication modules, DTO classes, and configuration files are highly structured and therefore predictable. AI generates these reliably.</li>
<li><strong>Standard patterns</strong>: RESTful APIs, database schemas, JWT auth, Docker files — well-established patterns that appear millions of times in training data.</li>
<li><strong>Repetitive tasks</strong>: Writing tests for existing functions, converting data formats, generating documentation.</li>
<li><strong>Unfamiliar APIs</strong>: Generating starter code for a library you haven't used before, using the library's documented patterns as a guide.</li>
</ul>

<h2>What AI Code Generation Struggles With</h2>

<ul>
<li><strong>Novel algorithms</strong>: If your problem requires a new approach that doesn't resemble known solutions, the model may generate plausible-looking but incorrect code.</li>
<li><strong>Deeply custom business logic</strong>: The nuances of your specific domain, pricing rules, or legal requirements aren't in the training data.</li>
<li><strong>Large-scale consistency</strong>: As generated code grows beyond a few hundred lines, maintaining internal consistency — naming, abstraction levels, error handling — becomes harder for the model.</li>
<li><strong>Security-sensitive code</strong>: Generated code may contain subtle vulnerabilities. Always review auth, input validation, and cryptographic code carefully.</li>
</ul>

<h2>The Right Mental Model</h2>

<p>Think of AI code generation as a very fast, very well-read junior developer. It can implement standard patterns quickly and reliably. It needs your review for anything security-sensitive or domain-specific. It works best when you give it a clear, detailed brief — vague prompts produce vague code.</p>

<h2>Getting the Most Out of Code Generation</h2>

<p><strong>Be specific.</strong> "Build a task management API" produces generic output. "Build a task management API with users, projects, tasks (with priority and due date), and team assignments. Use NestJS, Prisma, and PostgreSQL" produces something immediately useful.</p>

<p><strong>Iterate.</strong> Treat the first output as a draft. Chat-based tools and specialized generators like PromptForge let you refine output in follow-up prompts.</p>

<p><strong>Review output.</strong> Read generated code before you run it. LLMs occasionally hallucinate method names, miss edge cases, or make incorrect assumptions about library APIs. Five minutes of review prevents hours of debugging.</p>

<p><strong>Use specialized tools for specialized tasks.</strong> A general-purpose chat model is fine for one-off scripts. For generating an entire NestJS project with a correct Prisma schema, relations, and production configuration, a specialized tool like PromptForge produces significantly better output because it's optimized for that specific task.</p>

<h2>Where It's Going</h2>

<p>Code generation accuracy is improving rapidly with each model generation. The direction is toward agents that can generate, test, debug, and deploy code autonomously — not just write it. The developers who will benefit most are those who learn to use these tools as force multipliers rather than replacements for understanding.</p>

<p>PromptForge sits at the scaffolding end of the spectrum — it generates complete, production-ready NestJS applications from natural language so you can skip the setup and focus on what makes your product unique. <a href="/register">Start for free.</a></p>
    `,
  },

  // ─── Post 9 ───────────────────────────────────────────────────────────────────
  {
    slug: "nestjs-prisma-postgresql-tutorial",
    title: "Building a REST API with NestJS, Prisma, and PostgreSQL",
    description:
      "A complete tutorial for building a production-ready REST API using NestJS, Prisma ORM, and PostgreSQL — from schema design to running endpoints.",
    date: "2026-03-24",
    readTime: 11,
    category: "Tutorial",
    content: `
<p>NestJS with Prisma and PostgreSQL is one of the most productive backend stacks available in 2026. NestJS provides structure and dependency injection, Prisma handles database access with type safety, and PostgreSQL gives you a battle-tested relational database. Here's how to build a complete REST API with this stack.</p>

<h2>Project Setup</h2>

<p>Create a new NestJS project and install Prisma:</p>

<pre><code>npm i -g @nestjs/cli
nest new my-api
cd my-api
npm install prisma @prisma/client
npx prisma init</code></pre>

<p>This creates a <code>prisma/schema.prisma</code> file and a <code>.env</code> with a placeholder <code>DATABASE_URL</code>.</p>

<h2>Configure the Database Connection</h2>

<p>Update <code>.env</code> with your PostgreSQL connection string:</p>

<pre><code>DATABASE_URL="postgresql://postgres:password@localhost:5432/myapi_db"</code></pre>

<p>If you don't have PostgreSQL installed, the quickest way is Docker:</p>

<pre><code>docker run --name my-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=myapi_db -p 5432:5432 -d postgres:16</code></pre>

<h2>Define Your Schema</h2>

<p>Open <code>prisma/schema.prisma</code> and define your models. Let's build a simple task management API:</p>

<pre><code>generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  priority    Priority   @default(MEDIUM)
  status      TaskStatus @default(TODO)
  dueDate     DateTime?
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}</code></pre>

<p>Run the migration to create the tables:</p>

<pre><code>npx prisma migrate dev --name init</code></pre>

<h2>Create a Prisma Service</h2>

<p>Create a shared Prisma service that the rest of your application injects:</p>

<pre><code>// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}</code></pre>

<pre><code>// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}</code></pre>

<h2>Build the Tasks Module</h2>

<pre><code>// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, userId },
    });
  }

  async update(id: string, userId: string, dto: Partial&lt;CreateTaskDto&gt;) {
    await this.findOne(id, userId); // throws if not found
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}</code></pre>

<h2>Validation with DTOs</h2>

<p>Install validation packages and use class-validator decorators:</p>

<pre><code>npm install class-validator class-transformer</code></pre>

<pre><code>// src/tasks/dto/create-task.dto.ts
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Priority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}</code></pre>

<p>Enable validation globally in <code>main.ts</code>:</p>

<pre><code>app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));</code></pre>

<h2>Testing Your Endpoints</h2>

<p>Once running (<code>npm run start:dev</code>), your API is available at <code>http://localhost:3000</code>:</p>

<pre><code>POST /tasks          → Create a task
GET  /tasks          → List all tasks
GET  /tasks/:id      → Get one task
PATCH /tasks/:id     → Update a task
DELETE /tasks/:id    → Delete a task</code></pre>

<h2>Skip the Setup With PromptForge</h2>

<p>This tutorial covered the basics of a NestJS + Prisma + PostgreSQL setup. A production application also needs authentication, rate limiting, error handling, Swagger documentation, Docker configuration, and CI/CD. Setting all of that up from scratch takes 1–2 days.</p>

<p>PromptForge generates all of it — the schema, services, controllers, auth module, Dockerfile, and documentation — from a single prompt in under five minutes. <a href="/register">Try it for free.</a></p>
    `,
  },

  // ─── Post 10 ───────────────────────────────────────────────────────────────────
  {
    slug: "saas-mvp-launch-checklist",
    title: "The SaaS MVP Launch Checklist: 20 Things to Do Before You Ship",
    description:
      "Before you launch your SaaS MVP, make sure you've covered these 20 essentials — from auth and payments to error monitoring, legal pages, and SEO basics.",
    date: "2026-03-26",
    readTime: 10,
    category: "Engineering",
    content: `
<p>Most developers spend months building features and then rush the launch, skipping steps that turn out to matter. This checklist covers the 20 things you should have in place before you tell anyone about your SaaS product.</p>

<h2>Authentication & Access</h2>

<p><strong>1. Email + password auth with proper hashing.</strong> Passwords must be hashed with bcrypt (cost factor ≥ 12) or Argon2. Never store plain text. Never use MD5 or SHA-1 for passwords.</p>

<p><strong>2. Email verification.</strong> Require users to verify their email before they can access paid features. This reduces fraud, improves deliverability when you send emails, and gives you a confirmed contact channel.</p>

<p><strong>3. Password reset flow.</strong> Test it end-to-end. The reset link should expire in 1 hour. After a reset, all existing sessions should be invalidated.</p>

<p><strong>4. Rate limiting on auth endpoints.</strong> Without rate limiting, your login and register endpoints are targets for credential stuffing and brute force attacks. Apply at minimum 5 requests/minute per IP on auth routes.</p>

<h2>Payments</h2>

<p><strong>5. A working payment flow in production.</strong> Not sandbox — actual production. Test with a real card. Confirm the webhook fires and your database updates. This is the single most common thing that breaks on launch day.</p>

<p><strong>6. Subscription management.</strong> Users need to be able to upgrade, downgrade, and cancel without emailing you. Automate it.</p>

<p><strong>7. Billing receipt emails.</strong> Legal requirement in most jurisdictions. Most payment processors (iyzico, Stripe) send these automatically — make sure they're configured.</p>

<h2>Error Handling & Monitoring</h2>

<p><strong>8. Error monitoring.</strong> Sentry (free tier) or Highlight.io will capture unhandled exceptions and send you alerts. Without it, you'll find out about crashes when users email you — or when they don't.</p>

<p><strong>9. Structured logging on the backend.</strong> Use a logger (Pino, Winston) instead of <code>console.log</code>. In production, logs should be searchable. Railway and Vercel both surface structured logs in their dashboards.</p>

<p><strong>10. Graceful error pages.</strong> A 500 page that says "Internal Server Error" looks unfinished. A 404 that helps users navigate back looks professional. Both are worth 20 minutes.</p>

<h2>Security</h2>

<p><strong>11. HTTPS everywhere.</strong> Every endpoint, including API callbacks and webhooks. Most hosting platforms (Railway, Vercel) handle this automatically — confirm it's enabled.</p>

<p><strong>12. CORS configured correctly.</strong> Your API should only accept requests from your frontend domain in production. A wildcard <code>*</code> CORS policy is a security risk.</p>

<p><strong>13. Secrets in environment variables.</strong> No API keys, JWT secrets, or database passwords in your code or git history. Audit with <code>git log -p</code> if you're unsure.</p>

<p><strong>14. Input validation.</strong> Validate and sanitize all user input at the API boundary. Use class-validator in NestJS, or Zod in a plain Express app. Never trust what comes from the client.</p>

<h2>Legal & Trust</h2>

<p><strong>15. Privacy Policy.</strong> Required by GDPR if you have any EU users (and you will). Must explain what data you collect, how you use it, and how users can request deletion.</p>

<p><strong>16. Terms of Service.</strong> Protects you legally. At minimum, cover acceptable use, subscription terms, limitation of liability, and governing law.</p>

<p><strong>17. Cookie consent (if applicable).</strong> If you use analytics cookies or tracking, EU law requires consent. If you only use essential/session cookies, a simple notice in your privacy policy is sufficient.</p>

<h2>SEO & Marketing Basics</h2>

<p><strong>18. A <code>sitemap.xml</code> submitted to Google Search Console.</strong> Without it, Google may still find your pages, but it'll take longer. Submit it manually and check the coverage report after 48 hours.</p>

<p><strong>19. Open Graph meta tags.</strong> When someone shares your link on Twitter, LinkedIn, or Slack, the preview should show your product name, description, and a good-looking image. Without OG tags, the preview is bare text.</p>

<p><strong>20. A real email address for your domain.</strong> <code>hello@yourproduct.com</code> or <code>support@yourproduct.com</code>, not a Gmail. Domain-verified email improves deliverability and looks professional. Set up SPF, DKIM, and DMARC records.</p>

<h2>Automate the Boilerplate</h2>

<p>Items 1–4 (auth), 8–14 (error handling and security), and the deployment configuration can be generated automatically. PromptForge produces NestJS applications with authentication, rate limiting, input validation, Dockerfile, and CI/CD configuration built in — so you can focus on items 5–7 (payments) and 15–20 (legal and marketing), which genuinely require your attention.</p>

<p><a href="/register">Generate your backend for free</a> and check 14 items off this list before you write a single line of business logic.</p>
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
