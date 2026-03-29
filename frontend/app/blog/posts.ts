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
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
