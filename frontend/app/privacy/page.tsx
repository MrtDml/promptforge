import Link from "next/link";
import LandingNav from "@components/layout/LandingNav";
import LandingFooter from "@components/layout/LandingFooter";
import AnnouncementBanner from "@components/layout/AnnouncementBanner";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AnnouncementBanner />
      <LandingNav />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="text-indigo-400 text-sm font-medium mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: March 25, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10">

          <section>
            <p className="text-slate-300 leading-relaxed">
              PromptForge (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at <strong>promptforgeai.dev</strong>.
            </p>
          </section>

          {[
            {
              title: "1. Information We Collect",
              content: [
                {
                  subtitle: "Account Information",
                  text: "When you register, we collect your name, email address, and a hashed version of your password. We never store your plain-text password.",
                },
                {
                  subtitle: "Usage Data",
                  text: "We collect data on how you use PromptForge, including the prompts you submit, the projects you generate, and feature interactions. This data helps us improve the service.",
                },
                {
                  subtitle: "Payment Information",
                  text: "Payments are processed by Stripe. We do not store your credit card number or sensitive payment details on our servers. We only retain subscription status and plan information.",
                },
                {
                  subtitle: "Technical Data",
                  text: "We automatically collect IP addresses, browser type, operating system, referring URLs, and device identifiers for security and performance monitoring purposes.",
                },
              ],
            },
            {
              title: "2. How We Use Your Information",
              items: [
                "To provide and maintain the PromptForge platform",
                "To process your transactions and manage your subscription",
                "To send transactional emails (account confirmation, password resets)",
                "To improve our AI models and generation quality",
                "To detect and prevent fraud or abuse",
                "To comply with legal obligations",
              ],
            },
            {
              title: "3. Data Sharing",
              content: [
                {
                  subtitle: "We do not sell your data.",
                  text: "We share your information only with trusted third-party service providers who assist in operating our platform, subject to strict confidentiality agreements.",
                },
                {
                  subtitle: "Third-party services we use:",
                  text: "Railway (infrastructure hosting), Vercel (frontend hosting), Anthropic (AI processing for code generation), Stripe (payment processing). Each provider has their own privacy policy.",
                },
              ],
            },
            {
              title: "4. Data Retention",
              text: "We retain your account data for as long as your account is active. Generated project files are stored for your convenience and can be deleted at any time from your dashboard. Upon account deletion, we remove your personal data within 30 days.",
            },
            {
              title: "5. Security",
              text: "We implement industry-standard security measures including TLS encryption for data in transit, bcrypt hashing for passwords, and JWT-based authentication. However, no method of transmission over the Internet is 100% secure.",
            },
            {
              title: "6. Your Rights",
              items: [
                "Access: Request a copy of the personal data we hold about you",
                "Correction: Request correction of inaccurate data",
                "Deletion: Request deletion of your account and associated data",
                "Portability: Request your data in a structured, machine-readable format",
                "Objection: Object to processing of your data for certain purposes",
              ],
            },
            {
              title: "7. Cookies",
              text: "We use essential cookies for authentication (JWT tokens stored in localStorage) and session management. We do not use tracking or advertising cookies. You can clear cookies at any time through your browser settings.",
            },
            {
              title: "8. Children's Privacy",
              text: "PromptForge is not intended for users under the age of 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us.",
            },
            {
              title: "9. Changes to This Policy",
              text: "We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the platform. Continued use of PromptForge after changes constitutes acceptance of the updated policy.",
            },
            {
              title: "10. Contact Us",
              text: "If you have questions or concerns about this Privacy Policy, please contact us at hello@promptforgeai.dev or through our contact page.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-slate-800">{section.title}</h2>
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
                      <span className="text-indigo-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {"text" in section && section.text && (
                <p className="text-slate-400 leading-relaxed text-sm">{section.text}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">Questions? <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact us</Link></p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
