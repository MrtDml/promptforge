import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly from = 'PromptForge <noreply@promptforgeai.dev>';
  private readonly frontendUrl: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.frontendUrl = process.env.FRONTEND_URL ?? 'https://promptforgeai.dev';
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.resend = null;
      this.logger.warn('RESEND_API_KEY not set — emails will be logged only');
    }
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      const { error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });
      if (error) {
        this.logger.error(`Resend error for ${to}: ${JSON.stringify(error)}`);
      } else {
        this.logger.log(`Email sent: "${subject}" → ${to}`);
      }
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  // ─── Email Verification ───────────────────────────────────────────────────

  async sendVerificationEmail(to: string, name: string, token: string) {
    const link = `${this.frontendUrl}/verify-email?token=${token}`;
    await this.send(to, 'PromptForge hesabını doğrula', this.verificationTemplate(name, link));
  }

  // ─── Password Reset ───────────────────────────────────────────────────────

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const link = `${this.frontendUrl}/reset-password?token=${token}`;
    await this.send(to, 'PromptForge şifreni sıfırla', this.resetPasswordTemplate(name, link));
  }

  // ─── Welcome (after email verified) ──────────────────────────────────────

  async sendWelcomeEmail(to: string, name: string) {
    await this.send(to, `PromptForge&apos;a hoş geldin, ${name}! 🚀`, this.welcomeTemplate(name));
  }

  // ─── Project Complete ─────────────────────────────────────────────────────

  async sendProjectCompleteEmail(to: string, name: string, projectName: string, projectId: string) {
    const link = `${this.frontendUrl}/dashboard/projects/${projectId}`;
    await this.send(
      to,
      `✅ "${projectName}" hazır!`,
      this.projectCompleteTemplate(name, projectName, link),
    );
  }

  // ─── Generation Limit Warning ─────────────────────────────────────────────

  async sendLimitWarningEmail(to: string, name: string, used: number, limit: number) {
    const link = `${this.frontendUrl}/pricing`;
    await this.send(
      to,
      '⚠️ Üretim hakkın azalıyor',
      this.limitWarningTemplate(name, used, limit, link),
    );
  }

  // ─── Templates ────────────────────────────────────────────────────────────

  private baseTemplate(content: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PromptForge</title>
</head>
<body style="margin:0;padding:0;background:#0a0b14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b14;padding:40px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <!-- Logo -->
      <tr><td style="padding-bottom:32px;text-align:center;">
        <table cellpadding="0" cellspacing="0" style="display:inline-table;">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:12px;width:40px;height:40px;text-align:center;vertical-align:middle;">
              <span style="color:white;font-size:20px;font-weight:bold;">⚡</span>
            </td>
            <td style="padding-left:10px;color:white;font-size:20px;font-weight:700;vertical-align:middle;">PromptForge</td>
          </tr>
        </table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#0f1123;border:1px solid #1e2235;border-radius:16px;padding:40px;">
        ${content}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:24px;text-align:center;color:#334155;font-size:12px;line-height:1.6;">
        <p style="margin:0;">© ${new Date().getFullYear()} PromptForge · <a href="${this.frontendUrl}" style="color:#4f46e5;text-decoration:none;">promptforgeai.dev</a></p>
        <p style="margin:4px 0 0;">Bu e-postayı PromptForge hesabın olduğu için alıyorsun.</p>
        <p style="margin:4px 0 0;"><a href="${this.frontendUrl}/dashboard/settings?tab=notifications" style="color:#475569;text-decoration:underline;">Aboneliği iptal et</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
  }

  private btn(href: string, text: string): string {
    return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;margin-top:24px;">${text}</a>`;
  }

  private h1(text: string): string {
    return `<h1 style="margin:0 0 8px;color:white;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${text}</h1>`;
  }

  private p(text: string): string {
    return `<p style="margin:12px 0;color:#94a3b8;font-size:15px;line-height:1.6;">${text}</p>`;
  }

  private verificationTemplate(name: string, link: string): string {
    return this.baseTemplate(`
      ${this.h1('E-posta adresini doğrula')}
      ${this.p(`Merhaba ${name}, PromptForge&apos;a hoş geldin! Hesabını etkinleştirmek ve AI destekli SaaS uygulamaları oluşturmaya başlamak için e-posta adresini doğrula.`)}
      <div style="text-align:center;margin:8px 0 16px;">
        ${this.btn(link, 'E-posta Adresimi Doğrula')}
      </div>
      ${this.p('Bu bağlantı <strong style="color:#e2e8f0;">24 saat</strong> içinde sona erer. Hesap oluşturmadıysan bu e-postayı görmezden gelebilirsin.')}
      <div style="margin-top:24px;padding:16px;background:#0a0b14;border-radius:10px;border:1px solid #1e2235;">
        <p style="margin:0;color:#475569;font-size:12px;">Bağlantıyı tarayıcına kopyalayabilirsin:</p>
        <p style="margin:4px 0 0;font-size:12px;word-break:break-all;"><a href="${link}" style="color:#6366f1;">${link}</a></p>
      </div>
    `);
  }

  private resetPasswordTemplate(name: string, link: string): string {
    return this.baseTemplate(`
      ${this.h1('Şifreni sıfırla')}
      ${this.p(`Merhaba ${name}, PromptForge şifreni sıfırlama talebini aldık. Yeni şifre belirlemek için aşağıdaki butona tıkla.`)}
      <div style="text-align:center;margin:8px 0 16px;">
        ${this.btn(link, 'Şifremi Sıfırla')}
      </div>
      ${this.p('Bu bağlantı <strong style="color:#e2e8f0;">1 saat</strong> içinde sona erer. Şifre sıfırlama talebinde bulunmadıysan bu e-postayı görmezden gelebilirsin — şifren değişmeyecektir.')}
    `);
  }

  private welcomeTemplate(name: string): string {
    const newProjectLink = `${this.frontendUrl}/dashboard/new`;
    return this.baseTemplate(`
      ${this.h1(`PromptForge&apos;a hoş geldin, ${name}! 🚀`)}
      ${this.p('Hesabın doğrulandı ve hazır. Artık sade Türkçe açıklamalardan tam yığın SaaS uygulamaları üretebilirsin — kodlama bilgisi gerekmez.')}
      <div style="margin:20px 0;padding:20px;background:#0a0b14;border-radius:12px;border:1px solid #1e2235;">
        <p style="margin:0 0 12px;color:#e2e8f0;font-weight:600;font-size:14px;">Neler yapabilirsin:</p>
        <table cellpadding="0" cellspacing="0" style="width:100%;">
          ${[
            '⚡ Prompt ile NestJS + Prisma backend üret',
            '🗄️ Varlık ve ilişkilerle veritabanı şeması al',
            '📦 Üretime hazır kodu ZIP olarak indir',
            '🐙 Yeni bir GitHub reposuna doğrudan gönder',
            '🤖 Kodunu AI chat ile istediğin zaman değiştir',
          ]
            .map(
              (item) => `
          <tr><td style="padding:6px 0;color:#94a3b8;font-size:14px;">${item}</td></tr>`,
            )
            .join('')}
        </table>
      </div>
      <div style="text-align:center;">
        ${this.btn(newProjectLink, 'İlk Projemi Oluştur')}
      </div>
      ${this.p(`<strong style="color:#e2e8f0;">Ücretsiz plan</strong> ile başlıyorsun — aylık 3 üretim hakkı. Daha fazlası için <a href="${this.frontendUrl}/pricing" style="color:#6366f1;">istediğin zaman yükseltebilirsin</a>.`)}
    `);
  }

  private projectCompleteTemplate(name: string, projectName: string, link: string): string {
    return this.baseTemplate(`
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:#052e16;border:1px solid #166534;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;">✅</div>
      </div>
      ${this.h1(`"${projectName}" hazır!`)}
      ${this.p(`Merhaba ${name}, projen başarıyla oluşturuldu. Üretime hazır kodun indirilebilir veya GitHub&apos;a gönderilebilir durumda.`)}
      <div style="text-align:center;margin:8px 0 16px;">
        ${this.btn(link, 'Projeyi Görüntüle')}
      </div>
      ${this.p('ZIP dosyasını indirebilir, tek tıkla GitHub&apos;a gönderebilir veya AI chat ile değişiklik yapabilirsin.')}
    `);
  }

  private limitWarningTemplate(name: string, used: number, limit: number, link: string): string {
    const remaining = limit - used;
    return this.baseTemplate(`
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;background:#431407;border:1px solid #9a3412;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:28px;">⚠️</div>
      </div>
      ${this.h1('Üretim hakkın azalıyor')}
      ${this.p(`Merhaba ${name}, bu ay <strong style="color:#e2e8f0;">${limit} üretim hakkından ${used} tanesini</strong> kullandın. <strong style="color:#fb923c;">${remaining} üretim hakkın</strong> kaldı.`)}
      <div style="margin:16px 0;background:#0a0b14;border-radius:10px;overflow:hidden;border:1px solid #1e2235;">
        <div style="height:8px;background:linear-gradient(90deg,#6366f1,#f97316);width:${Math.round((used / limit) * 100)}%;border-radius:10px;"></div>
      </div>
      ${this.p('Sınırsız üretim, öncelikli işleme ve tüm premium özellikler için Pro plana geç.')}
      <div style="text-align:center;margin:8px 0 16px;">
        ${this.btn(link, 'Pro&apos;ya Yükselt')}
      </div>
    `);
  }
}
