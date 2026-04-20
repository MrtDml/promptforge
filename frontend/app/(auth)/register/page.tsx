"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import OAuthButtons from "@components/ui/OAuthButtons";

const passwordRequirements = [
  { label: "En az 8 karakter", test: (p: string) => p.length >= 8 },
  { label: "Bir büyük harf", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Bir rakam", test: (p: string) => /\d/.test(p) },
];

function RegisterForm() {
  const { register, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  const passwordScore = passwordRequirements.filter((r) => r.test(password)).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (passwordScore < 2) {
      setError("Lütfen daha güçlü bir şifre seçin.");
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(referralCode.trim() ? { referralCode: referralCode.trim() } : {}),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ttq?.track("CompleteRegistration");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ttq?.track("Lead", { content_name: "Free Registration" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
          Hesabını oluştur
        </h1>
        <p className="text-slate-400 text-sm">
          AI ile SaaS uygulamaları geliştirmeye başla — ücretsiz, kredi kartı gerekmez.
        </p>
      </div>

      {referralCode && (
        <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 mb-5">
          <Gift className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <p className="text-indigo-300 text-sm">
            Referans kodu <span className="font-mono font-semibold">{referralCode}</span> uygulandı — arkadaşın bonus üretim hakkı kazanacak!
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adın Soyadın"
            className="input-base"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            E-posta adresi
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sen@ornek.com"
            className="input-base"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
            Şifre
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowRequirements(true)}
              placeholder="Güçlü bir şifre oluştur"
              className="input-base pr-11"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {showRequirements && password.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= passwordScore
                        ? passwordScore === 1
                          ? "bg-red-500"
                          : passwordScore === 2
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 transition-colors ${
                        req.test(password) ? "text-green-400" : "text-slate-600"
                      }`}
                    />
                    <span
                      className={`text-xs transition-colors ${
                        req.test(password) ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
            Şifre tekrar
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifreni tekrar gir"
            className={`input-base ${
              confirmPassword && confirmPassword !== password
                ? "border-red-500/60 focus:ring-red-500"
                : confirmPassword && confirmPassword === password
                ? "border-green-500/60 focus:ring-green-500"
                : ""
            }`}
            autoComplete="new-password"
            required
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="text-red-400 text-xs mt-1.5">Şifreler eşleşmiyor</p>
          )}
        </div>

        {!searchParams.get("ref") && (
          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-slate-300 mb-1.5">
              Referans kodu <span className="text-slate-500 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="örn. A1B2C3D4"
              maxLength={12}
              className="input-base font-mono"
              autoComplete="off"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-sm font-semibold mt-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Hesap oluşturuluyor...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Ücretsiz hesap oluştur
            </>
          )}
        </button>

        <p className="text-slate-600 text-xs text-center">
          Hesap oluşturarak{" "}
          <Link href="/terms" className="text-indigo-400/80 hover:text-indigo-300 hover:underline">
            Kullanım Koşulları
          </Link>
          {" "}ve{" "}
          <Link href="/privacy" className="text-indigo-400/80 hover:text-indigo-300 hover:underline">
            Gizlilik Politikası
          </Link>
          &apos;nı kabul etmiş olursun.
        </p>
      </form>

      <div className="mt-6">
        <OAuthButtons label="kayıt ol" />
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
        <p className="text-slate-400 text-sm">
          Zaten hesabın var mı?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Giriş yap →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-slate-800/30 rounded-xl" />}>
      <RegisterForm />
    </Suspense>
  );
}
