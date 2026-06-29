"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  BedDouble,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/data/auth-context";
import { registerSchema, type RegisterForm } from "@/schemas/auth.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Password strength meter ──────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number; // 0-4
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map = [
    { label: "Too weak", color: "bg-red-400" },
    { label: "Weak", color: "bg-orange-400" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Good", color: "bg-emerald-400" },
    { label: "Strong", color: "bg-emerald-500" },
  ];
  return { score, ...map[score] };
}

// ─── Benefit item for right panel ────────────────────────────────────────────

function Benefit({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-4 text-amber-400" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold leading-tight">{title}</p>
        <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function SignupPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "tenant",
    },
  });

  // Watch password for strength meter
  const watchedPassword = watch("password", "");
  useEffect(() => {
    setPasswordValue(watchedPassword ?? "");
  }, [watchedPassword]);

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    const toastId = toast.loading("Creating your account…");
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: data.role,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");

      login({
        id: result.uid,
        name: result.displayName ?? data.name,
        email: result.email ?? data.email,
        role: result.role ?? "user",
        token: result.idToken,
        aadhaarVerified: false,
      });

      toast.success("Account created! Welcome to NearMePG 🎉", {
        id: toastId,
        duration: 4000,
      });
      router.replace("/");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-row-reverse">
      {/* ── RIGHT decorative panel (reversed layout vs login) ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-slate-950 flex-col justify-between p-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80')",
          }}
        />
        {/* Gradient orbs */}
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-25 bg-indigo-600 -top-16 -right-16 animate-pulse"
          style={{ animationDuration: "5s" }}
        />
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 bg-amber-500 bottom-32 left-10 animate-pulse"
          style={{ animationDuration: "3.5s", animationDelay: "1.5s" }}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold text-white/80 uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free to Join
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
            Your stay,<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-amber-400">
              your way.
            </span>
          </h2>
          <p className="mt-5 text-slate-300 text-base leading-relaxed max-w-sm">
            Join 10,000+ students and professionals who found their perfect
            accommodation on NearMePG.
          </p>
        </div>

        {/* Benefits list */}
        <div className="relative z-10 space-y-5">
          <Benefit
            icon={ShieldCheck}
            title="Verified listings only"
            desc="Every property is physically inspected before going live."
          />
          <Benefit
            icon={BedDouble}
            title="Bed-level availability"
            desc="See exactly which beds are free — no ambiguity."
          />
          <Benefit
            icon={Star}
            title="Real reviews from real tenants"
            desc="Honest ratings from verified residents, not landlords."
          />
        </div>
      </div>

      {/* ── LEFT form panel ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Free forever. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Role Selection */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <label className="flex-1 text-center cursor-pointer relative">
                <input
                  type="radio"
                  value="tenant"
                  {...register("role")}
                  className="peer sr-only"
                />
                <div className="py-2 text-sm font-semibold rounded-lg text-slate-500 peer-checked:bg-white peer-checked:text-amber-600 peer-checked:shadow-sm transition-all">
                  Tenant
                </div>
              </label>
              <label className="flex-1 text-center cursor-pointer relative">
                <input
                  type="radio"
                  value="pg_owner"
                  {...register("role")}
                  className="peer sr-only"
                />
                <div className="py-2 text-sm font-semibold rounded-lg text-slate-500 peer-checked:bg-white peer-checked:text-amber-600 peer-checked:shadow-sm transition-all">
                  Property Owner
                </div>
              </label>
            </div>
            {/* Full name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Priya Sharma"
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-amber-300 focus:border-amber-400"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-amber-300 focus:border-amber-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="signup-phone"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Phone number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="9876543210"
                  {...register("phone")}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-amber-300 focus:border-amber-400"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  {...register("password")}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-amber-300 focus:border-amber-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {passwordValue.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs text-slate-500">
                      Strength:{" "}
                      <span
                        className={`font-semibold ${
                          strength.score <= 1
                            ? "text-red-500"
                            : strength.score === 2
                            ? "text-yellow-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {strength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="signup-confirm"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-amber-300 focus:border-amber-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Requirements hint */}
            <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5">
              {[
                { check: passwordValue.length >= 8, text: "At least 8 characters" },
                { check: /[A-Z]/.test(passwordValue), text: "One uppercase letter" },
                { check: /[0-9]/.test(passwordValue), text: "One number" },
              ].map(({ check, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`size-3.5 transition-colors ${
                      check ? "text-emerald-500" : "text-slate-300"
                    }`}
                  />
                  <span className={check ? "text-emerald-700" : "text-slate-400"}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-warm mt-1"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>Create account <ArrowRight className="size-4" /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms-conditions" className="underline hover:text-slate-600">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
