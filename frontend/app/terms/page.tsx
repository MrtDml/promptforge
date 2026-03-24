import Link from "next/link";
import { Zap } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">PromptForge</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="text-indigo-400 text-sm font-medium mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: March 25, 2026</p>
        </div>

        <div className="space-y-10">
          <section>
            <p className="text-slate-300 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of PromptForge (&quot;Service&quot;), operated by PromptForge (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). By accessing or using the Service, you agree to be bound by these Terms.
            </p>
          </section>

          {[
            {
              title: "1. Acceptance of Terms",
              text: "By creating an account or using PromptForge, you confirm that you are at least 16 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.",
            },
            {
              title: "2. Description of Service",
              text: "PromptForge is an AI-powered platform that generates full-stack application code from natural language prompts. The Service produces NestJS backend projects including Prisma schemas, REST API scaffolding, authentication modules, and deployment configurations. Generated code is provided as-is for use in your own projects.",
            },
            {
              title: "3. Account Registration",
              items: [
                "You must provide accurate and complete registration information",
                "You are responsible for maintaining the security of your account credentials",
                "You must notify us immediately of any unauthorized use of your account",
                "You may not share your account with others or create accounts on behalf of third parties without authorization",
                "We reserve the right to refuse registration or suspend accounts at our discretion",
              ],
            },
            {
              title: "4. Subscription and Billing",
              items: [
                "Free plan: 3 app generations per month at no charge",
                "Starter plan ($29/month): 50 generations per month",
                "Pro plan ($99/month): Unlimited generations",
                "Subscriptions are billed monthly and renew automatically",
                "You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period",
                "We do not offer refunds for partial months",
                "Prices may change with 30 days advance notice",
              ],
            },
            {
              title: "5. Acceptable Use",
              text: "You agree not to use PromptForge to:",
              items: [
                "Generate code intended for malicious purposes, malware, or cyberattacks",
                "Violate any applicable laws or regulations",
                "Infringe upon intellectual property rights of third parties",
                "Attempt to reverse-engineer, scrape, or exploit the Service's infrastructure",
                "Resell or redistribute access to the Service without written permission",
                "Submit prompts that are offensive, harmful, or violate our community guidelines",
              ],
            },
            {
              title: "6. Intellectual Property",
              content: [
                {
                  subtitle: "Your prompts",
                  text: "You retain ownership of the prompts you submit to PromptForge. By submitting prompts, you grant us a limited, non-exclusive license to process them solely for the purpose of providing the Service.",
                },
                {
                  subtitle: "Generated code",
                  text: "You own the code generated for you by PromptForge and may use it for any lawful purpose, including commercial projects. We do not claim ownership over your generated output.",
                },
                {
                  subtitle: "PromptForge platform",
                  text: "The PromptForge platform, including its design, algorithms, and codebase, is owned by us and protected by intellectual property laws. You may not copy or replicate the platform itself.",
                },
              ],
            },
            {
              title: "7. Availability and Service Levels",
              text: "We strive for high availability but do not guarantee uninterrupted access. The Service is provided 'as-is' and we may perform maintenance, introduce changes, or temporarily suspend the Service. We will make reasonable efforts to notify users of planned outages.",
            },
            {
              title: "8. Limitation of Liability",
              text: "To the maximum extent permitted by law, PromptForge shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim. We are not responsible for the correctness, completeness, or fitness for purpose of generated code.",
            },
            {
              title: "9. Disclaimer of Warranties",
              text: "The Service is provided 'as-is' and 'as available' without warranties of any kind, either express or implied. We do not warrant that the generated code will be error-free, production-ready, or suitable for any specific purpose. You are responsible for reviewing and testing all generated code before use.",
            },
            {
              title: "10. Termination",
              text: "Either party may terminate these Terms at any time. We reserve the right to suspend or terminate your account immediately if you violate these Terms. Upon termination, your right to use the Service ceases, but provisions that should survive termination (including IP rights and limitation of liability) remain in effect.",
            },
            {
              title: "11. Changes to Terms",
              text: "We reserve the right to modify these Terms at any time. We will notify you of material changes via email or a notice on the platform. Continued use of the Service after changes constitutes acceptance of the new Terms.",
            },
            {
              title: "12. Governing Law",
              text: "These Terms are governed by the laws of Turkey. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Istanbul, Turkey.",
            },
            {
              title: "13. Contact",
              text: "For questions about these Terms, please contact us at hello@promptforgeai.dev or through our contact page at promptforgeai.dev/contact.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-800">{section.title}</h2>
              {"text" in section && section.text && !("items" in section) && (
                <p className="text-slate-400 leading-relaxed text-sm">{section.text}</p>
              )}
              {"text" in section && section.text && "items" in section && (
                <p className="text-slate-400 leading-relaxed text-sm mb-3">{section.text}</p>
              )}
              {"content" in section && section.content && (
                <div className="space-y-4">
                  {section.content.map((c) => (
                    <div key={c.subtitle}>
                      <p className="text-white font-medium text-sm mb-1">{c.subtitle}</p>
                      <p className="text-slate-400 leading-relaxed text-sm">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {"items" in section && section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-400 text-sm">
                      <span className="text-indigo-400 mt-1 flex-shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">Questions? <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact us</Link></p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">PromptForge</span>
          </Link>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} PromptForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms</Link>
            <Link href="/contact" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
