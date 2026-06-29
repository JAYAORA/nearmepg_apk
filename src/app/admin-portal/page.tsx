"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/data/auth-context";
import type { UserRole } from "@/data/auth-context";
import { LogOutIcon, ShieldCheckIcon } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type Tab = "login" | "create";

const ROLE_META: Record<string, { label: string; color: string; description: string }> = {
  admin:       { label: "Admin",       color: "from-purple-500 to-violet-600",  description: "Manage all properties, bookings & users" },
  super_admin: { label: "Super Admin", color: "from-rose-500 to-pink-600",      description: "Full platform control including admin promotion" },
  pg_owner:    { label: "PG Owner",    color: "from-amber-500 to-orange-600",   description: "Manage own PG properties & tenants" },
  hotel_owner: { label: "Hotel Owner", color: "from-orange-400 to-amber-600",   description: "Manage own hotel properties & bookings" },
  tenant:      { label: "Tenant",      color: "from-blue-500 to-indigo-600",    description: "Browse & book accommodations" },
};

function RolePill({ role }: { role: string }) {
  const meta = ROLE_META[role] ?? { label: role, color: "from-slate-400 to-slate-600", description: "" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${meta.color} shadow-sm`}>
      {meta.label}
    </span>
  );
}

export default function AdminPortalPage() {
  const { login, user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Create user form
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createRole, setCreateRole] = useState<string>("admin");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState<{ email: string; role: string } | null>(null);

  const canCreate = isAuthenticated && (user?.role === "admin" || user?.role === "super_admin");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login({
        id: data.uid,
        name: data.displayName,
        email: data.email,
        role: data.role as UserRole,
        token: data.idToken,
      });
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callerRole: user.role,
          email: createEmail,
          password: createPassword,
          displayName: createName,
          phone: createPhone,
          role: createRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      setCreateSuccess({ email: createEmail, role: createRole });
      setCreateEmail("");
      setCreatePassword("");
      setCreateName("");
      setCreatePhone("");
    } catch (err: any) {
      setCreateError(err.message || "Something went wrong");
    } finally {
      setCreateLoading(false);
    }
  }

  const allowedCreateRoles =
    user?.role === "super_admin"
      ? ["tenant", "pg_owner", "hotel_owner", "admin", "super_admin"]
      : ["tenant", "pg_owner", "hotel_owner"];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      {/* <div className="border-b border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">NearMePG Admin Portal</p>
            <p className="text-slate-500 text-xs">Restricted access</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3">
          {isAuthenticated && (
            <>
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2.5 py-1.5 max-w-[180px] sm:max-w-none">
                <span className="text-slate-300 text-xs font-medium truncate max-w-[80px] sm:max-w-none" title={user?.name || ""}>
                  {user?.name}
                </span>
                <RolePill role={user?.role || ""} />
              </div>
              <button
                onClick={() => { logout(); }}
                className="text-xs text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800 shrink-0"
              >
                Sign out
              </button>
            </>
          )}
          <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800 shrink-0">
            ← Back to site
          </a>
        </div>
      </div> */}
      <div className="border-b border-slate-800 px-4 sm:px-6 py-4">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    
    {/* Left */}
    <div className="flex items-center justify-between gap-3 min-w-0">
      <div className="inline-flex gap-2">

      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
        <ShieldCheckIcon className="w-4 h-4 text-white" />
      </div>

      <div className="min-w-0">
        <p className="text-white font-bold text-sm truncate">
          NearMePG Admin Portal
        </p>
        <p className="text-slate-500 text-xs">
          Restricted access
        </p>
      </div>
      </div>

      {isAuthenticated && (
        <LogOutIcon className="w-4 h-4 text-white md:hidden mr-2" />
      )}
    </div>

    {/* Right */}
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      {isAuthenticated && (
        <>
          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
            <span
              className="text-slate-300 text-xs font-medium max-w-[120px] truncate"
              title={user?.name || ""}
            >
              {user?.name}
            </span>

            <RolePill role={user?.role || ""} />
          </div>

          <button
            onClick={logout}
            className="hidden md:block text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            Sign out
          </button>
        </>
      )}

      <a
        href="/"
        className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
      >
        ← Back to site
      </a>
    </div>

  </div>
</div>

      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-4xl">
          {/* Page heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 mt-2 text-sm">
              Manage admin & privileged accounts — separate from the public login
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ── LEFT: Login / Current session ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-800">
                <h2 className="text-white font-bold text-lg">Sign In</h2>
                <p className="text-slate-500 text-xs mt-0.5">Use any account credentials below</p>
              </div>

              {isAuthenticated ? (
                <div className="px-6 py-6">
                  <div className="bg-slate-800 rounded-xl p-4 mb-4">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Currently signed in as</p>
                    <p className="text-white font-bold">{user?.name}</p>
                    <p className="text-slate-400 text-sm">{user?.email}</p>
                    <div className="mt-2">
                      <RolePill role={user?.role || ""} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {user?.role === "admin" || user?.role === "super_admin" ? (
                      <button
                        onClick={() => setTab("create")}
                        className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
                      >
                        Create New User →
                      </button>
                    ) : null}
                    <button
                      onClick={logout}
                      className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
                    >
                      Sign out & switch account
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="px-6 py-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@test.nearmepg.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  {loginError && (
                    <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">{loginError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {loginLoading ? "Signing in…" : "Sign in"}
                  </button>
                </form>
              )}
            </div>

            {/* ── RIGHT: Create user ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-slate-800">
                <h2 className="text-white font-bold text-lg">Create User</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  {canCreate
                    ? "Create admin, owner, or tenant accounts"
                    : "Sign in as admin or super_admin to create users"}
                </p>
              </div>

              {!canCreate ? (
                <div className="px-6 py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">Sign in as <strong className="text-slate-300">admin</strong> or <strong className="text-slate-300">super_admin</strong> to create users</p>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="px-6 py-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                      <input
                        required
                        value={createName}
                        onChange={(e) => setCreateName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone</label>
                      <input
                        value={createPhone}
                        onChange={(e) => setCreatePhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="9000000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="new@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="min 6 chars"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Role</label>
                    <select
                      value={createRole}
                      onChange={(e) => setCreateRole(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {allowedCreateRoles.map((r) => (
                        <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">{ROLE_META[createRole]?.description}</p>
                  </div>
                  {createError && (
                    <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">{createError}</p>
                  )}
                  {createSuccess && (
                    <div className="bg-emerald-950/50 border border-emerald-800 rounded-lg px-3 py-2">
                      <p className="text-sm text-emerald-400 font-semibold">✓ User created</p>
                      <p className="text-xs text-emerald-600 mt-0.5">{createSuccess.email} · {createSuccess.role}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {createLoading ? "Creating…" : "Create User"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Test credentials table ── */}
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold">Test Credentials</h2>
                <p className="text-slate-500 text-xs mt-0.5">Use these to test different roles — all pre-seeded in Firestore</p>
              </div>
              <span className="text-xs font-mono text-slate-600 bg-slate-800 px-3 py-1 rounded-full">dev only</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-950/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">Role</th>
                    <th className="text-left px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">Email</th>
                    <th className="text-left px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">Password</th>
                    <th className="text-left px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wide">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { role: "tenant",       email: "tenant@test.nearmepg.com",     password: "Tenant@123",     access: "My Bookings" },
                    { role: "pg_owner",     email: "pgowner@test.nearmepg.com",    password: "PgOwner@123",    access: "Owner Dashboard + My Tenants" },
                    { role: "hotel_owner",  email: "hotelowner@test.nearmepg.com", password: "Hotel@123",      access: "Owner Dashboard + My Tenants" },
                    { role: "admin",        email: "admin@test.nearmepg.com",      password: "Admin@123",      access: "All Bookings + Users + Properties" },
                    { role: "super_admin",  email: "superadmin@test.nearmepg.com", password: "SuperAdmin@123", access: "Full platform + Admin creation" },
                  ].map((cred) => (
                    <tr key={cred.role} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-3"><RolePill role={cred.role} /></td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-300">{cred.email}</td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-300">{cred.password}</td>
                      <td className="px-6 py-3 text-xs text-slate-400">{cred.access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
