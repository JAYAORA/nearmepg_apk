"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useIsAdmin, useIsSuperAdmin } from "@/data/auth-context";

type UserRole = "tenant" | "pg_owner" | "hotel_owner" | "admin" | "super_admin";

interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  phone?: string;
  role?: string;
  account_status?: string;
  isActive?: boolean;
  createdAt?: any;
  lastLoginAt?: any;
  aadhaarVerified?: boolean;
}

const ROLES: { value: UserRole | ""; label: string }[] = [
  { value: "", label: "All Roles" },
  { value: "tenant", label: "Tenant" },
  { value: "pg_owner", label: "PG Owner" },
  { value: "hotel_owner", label: "Hotel Owner" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

function RoleBadge({ role }: { role?: string }) {
  const map: Record<string, string> = {
    tenant:       "bg-blue-100 text-blue-700 border-blue-200",
    pg_owner:     "bg-amber-100 text-amber-700 border-amber-200",
    hotel_owner:  "bg-orange-100 text-orange-700 border-orange-200",
    admin:        "bg-purple-100 text-purple-700 border-purple-200",
    super_admin:  "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[role || ""] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {role || "—"}
    </span>
  );
}

interface EditModalProps {
  user: AuthUser;
  callerRole: string;
  onClose: () => void;
  onSuccess: () => void;
}

function EditUserModal({ user: editUser, callerRole, onClose, onSuccess }: EditModalProps) {
  const [role, setRole] = useState<string>(editUser.role || "tenant");
  const [displayName, setDisplayName] = useState(editUser.displayName || "");
  const [isActive, setIsActive] = useState(editUser.isActive !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedRoles =
    callerRole === "super_admin"
      ? ["tenant", "pg_owner", "hotel_owner", "admin", "super_admin"]
      : ["tenant", "pg_owner", "hotel_owner"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callerRole, role, displayName, isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Edit User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Email</p>
            <p className="font-semibold text-slate-800">{editUser.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {allowedRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Account Active</label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const isSuperAdmin = useIsSuperAdmin();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  async function fetchUsers() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        callerRole: user.role,
        ...(roleFilter ? { role: roleFilter } : {}),
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/admin/users?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) { router.replace("/login?redirect=/admin/users"); return; }
    if (!isAdmin) { router.replace("/"); return; }
    fetchUsers();
  }, [authReady, isAuthenticated, user, isAdmin, router, roleFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchUsers();
  }

  const activeCnt = users.filter((u) => u.isActive !== false).length;
  const inactiveCnt = users.length - activeCnt;

  return (
    <div className="min-h-screen bg-slate-50">
      {editingUser && (
        <EditUserModal
          user={editingUser}
          callerRole={user!.role}
          onClose={() => setEditingUser(null)}
          onSuccess={() => { setEditingUser(null); fetchUsers(); }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            {isSuperAdmin && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                Super Admin View
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{activeCnt} active · {inactiveCnt} inactive · {users.length} total</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone…"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Search
              </button>
            </form>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchUsers} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold">Retry</button>
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-400 py-16">No users found.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name / Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${u.isActive === false ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{u.displayName || "—"}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{u.email}</p>
                      </td>
                      <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                      <td className="px-4 py-3 text-slate-600">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        {u.account_status === "pending_approval" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-amber-100 text-amber-700 border-amber-200">
                            Pending Approval
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${u.isActive !== false ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-600 border-red-200"}`}>
                            {u.isActive !== false ? "Active" : "Disabled"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(isSuperAdmin || (u.role !== "admin" && u.role !== "super_admin")) && (
                            <>
                              {u.account_status === "pending_approval" && (
                                <button
                                  onClick={async () => {
                                    if (!confirm("Approve this owner?")) return;
                                    try {
                                      await fetch(`/api/admin/users/${u.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ callerRole: user!.role, account_status: "active" })
                                      });
                                      fetchUsers();
                                    } catch (e) { alert("Failed to approve"); }
                                  }}
                                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50 border border-emerald-200"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  const action = u.isActive !== false ? "Deactivate" : "Activate";
                                  if (!confirm(`${action} this user?`)) return;
                                  try {
                                    await fetch(`/api/admin/users/${u.id}`, {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ callerRole: user!.role, isActive: u.isActive === false })
                                    });
                                    fetchUsers();
                                  } catch (e) { alert(`Failed to ${action.toLowerCase()} user`); }
                                }}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                                  u.isActive !== false 
                                    ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" 
                                    : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                }`}
                              >
                                {u.isActive !== false ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => setEditingUser(u)}
                                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-50"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
