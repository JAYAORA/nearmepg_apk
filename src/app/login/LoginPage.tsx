"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/data/auth-context";
import { loginSchema, type LoginForm } from "@/schemas/auth.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: "4s" }}
    />
  );
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) router.replace(redirectUrl);
  }, [isAuthenticated, router, redirectUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    const toastId = toast.loading("Signing you in…");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Login failed");

      login({
        id: result.uid,
        name: result.displayName,
        email: result.email,
        role: result.role,
        token: result.idToken,
        aadhaarVerified: result.aadhaarVerified,
      });

      toast.success(`Welcome back, ${result.displayName?.split(" ")[0]}!`, {
        id: toastId,
        icon: "👋",
      });

      // Role-aware redirect
      const role = result.role as string;
      if (redirectUrl && redirectUrl !== "/") {
        router.replace(redirectUrl);
      } else if (role === "pg_owner" || role === "hotel_owner") {
        router.replace("/owner");
      } else if (role === "admin" || role === "super_admin") {
        router.replace("/admin/bookings");
      } else {
        router.replace("/account/bookings");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* ── LEFT decorative panel ── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-slate-950 flex-col justify-between p-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80')",
          }}
        />
        <Orb className="w-72 h-72 bg-amber-500 top-10 -left-20" delay={0} />
        <Orb className="w-96 h-96 bg-indigo-600 bottom-20 right-10" delay={1.5} />
        <Orb className="w-56 h-56 bg-orange-500 top-1/2 left-1/2 -translate-x-1/2" delay={3} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold text-white/80 uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            NearMePG
          </div>
          <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
            Find your<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500">
              perfect PG.
            </span>
          </h2>
          <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-sm">
            Verified accommodations, real-time bed availability, and instant booking — all in one place.
          </p>
        </div>

        <div className="relative z-10 bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl p-5">
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white/90 text-sm leading-relaxed italic">
            &ldquo;Found my PG in Gachibowli within 2 days of moving cities. Zero hidden charges, exactly as pictured.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-400/50 flex items-center justify-center text-amber-300 text-xs font-bold">
              AK
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Aditya K.</p>
              <p className="text-slate-400 text-[11px]">Software Engineer, Hyderabad</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT form ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Sign in to manage bookings and saved properties.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
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
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-warm mt-2"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="size-4" /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              Create one free
            </Link>
          </p>

          <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed">
            By signing in you agree to our{" "}
            <Link href="/terms-conditions" className="underline hover:text-slate-600">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
