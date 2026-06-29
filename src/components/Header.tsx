"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  ChevronDown,
  User as UserIcon,
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  Home,
  FileText,
  User2,
  CreditCard,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth, useIsOwner, useIsAdmin } from "@/data/auth-context";
import { Button } from "@/components/ui/button";
import NotificationBell from "./layout/NotificationBell";

// Role display config
const ROLE_META: Record<string, { label: string; badgeCls: string }> = {
  tenant: {
    label: "Tenant",
    badgeCls: "bg-blue-100 text-blue-700 border-blue-200",
  },
  pg_owner: {
    label: "PG Owner",
    badgeCls: "bg-amber-100 text-amber-700 border-amber-200",
  },
  hotel_owner: {
    label: "Hotel Owner",
    badgeCls: "bg-orange-100 text-orange-700 border-orange-200",
  },
  admin: {
    label: "Admin",
    badgeCls: "bg-purple-100 text-purple-700 border-purple-200",
  },
  super_admin: {
    label: "Super Admin",
    badgeCls: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isOwner = useIsOwner();
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    router.push("/");
  }

  if (!user) return null;
  const meta = ROLE_META[user.role] ?? {
    label: user.role,
    badgeCls: "bg-slate-100 text-slate-700 border-slate-200",
  };
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        id="profile-dropdown-trigger"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors group"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Avatar circle */}
        <div className="w-6 h-6 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold leading-none">
            {initials}
          </span>
        </div>
        <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
          {user.name?.split(" ")[0] || "Account"}
        </span>
        <ChevronDown
          className={`size-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User info header */}
          <div className="px-4 py-4 bg-linear-to-br from-slate-50 to-amber-50/50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-sm font-bold">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span
                  className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeCls}`}
                >
                  {meta.label}
                </span>
              </div>
            </div>
          </div>

          {/* Nav links by role */}
          <div className="py-1.5">
            {/* Always: My Bookings */}
            <DropdownLink
              href="/account/profile"
              icon={<User2 className="size-4" />}
              label="My Profile"
              onClick={() => setOpen(false)}
            />
            <DropdownLink
              href="/account/bookings"
              icon={<BookOpen className="size-4" />}
              label="My Bookings"
              onClick={() => setOpen(false)}
            />

            {/* Owner links */}
            {isOwner && (
              <>
                <DropdownLink
                  href="/owner"
                  icon={<LayoutDashboard className="size-4" />}
                  label="Dashboard"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/owner/tenants"
                  icon={<Users className="size-4" />}
                  label="My Tenants"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/admin/properties"
                  icon={<Building2 className="size-4" />}
                  label="My Properties"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/owner/payments"
                  icon={<CreditCard className="size-4" />}
                  label="Payments"
                  onClick={() => setOpen(false)}
                />
              </>
            )}

            {/* Admin links */}
            {isAdmin && (
              <>
                <DropdownLink
                  href="/admin/properties"
                  icon={<Building2 className="size-4" />}
                  label="Properties"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/admin/bookings"
                  icon={<BookOpen className="size-4" />}
                  label="All Bookings"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/admin/users"
                  icon={<Users className="size-4" />}
                  label="User Management"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/admin/blogs"
                  icon={<FileText className="size-4" />}
                  label="Blog Management"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/admin-portal"
                  icon={<LayoutDashboard className="size-4" />}
                  label="Admin Portal"
                  onClick={() => setOpen(false)}
                  badge="portal"
                />
              </>
            )}
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-100 py-1.5">
            <button
              id="profile-dropdown-signout"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors group"
    >
      <span className="text-slate-400 group-hover:text-amber-500 transition-colors">
        {icon}
      </span>
      <span className="font-medium flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold text-violet-600 bg-violet-100 border border-violet-200 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const isOwner = useIsOwner();
  const isAdmin = useIsAdmin();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (pathname.startsWith("/admin-portal")) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 text-xs md:text-base md:w-8 md:h-8 rounded-full bg-linear-to-br from-indigo-700 to-indigo-900 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="inline-flex gap-0.5 font-display font-bold text-xl tracking-tight text-slate-800">
            <span>
              Near<span className="text-amber-600">Me</span>PG
            </span>
            <span className="text-[9px]">TM</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-500">
          <Link
            href="/search?kind=pg"
            className="hover:text-amber-600 transition-colors"
          >
            PGs
          </Link>
          <Link
            href="/search?kind=hotel"
            className="hover:text-amber-600 transition-colors"
          >
            Hotels
          </Link>
          {/* <Link href="/search?kind=pg&type=coliving" className="hover:text-amber-600 transition-colors">Coliving</Link> */}
          <Link href="/blog" className="hover:text-amber-600 transition-colors">
            Blog
          </Link>

          {/* Owner nav links (only on desktop, also in dropdown) */}
          {isOwner && (
            <>
              <span className="text-slate-200">|</span>
              <Link
                href="/owner"
                className="hover:text-amber-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/owner/tenants"
                className="hover:text-amber-600 transition-colors"
              >
                Tenants
              </Link>
              <Link
                href="/admin/properties"
                className="hover:text-amber-600 transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/owner/payments"
                className="hover:text-amber-600 transition-colors"
              >
                Payments
              </Link>
            </>
          )}

          {/* Admin nav links */}
          {isAdmin && (
            <>
              <span className="text-slate-200">|</span>
              <Link
                href="/admin-portal"
                className="hover:text-amber-600 transition-colors font-bold text-violet-600"
              >
                Portal
              </Link>
              <Link
                href="/admin/properties"
                className="hover:text-amber-600 transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/admin/bookings"
                className="hover:text-amber-600 transition-colors"
              >
                Bookings
              </Link>
              <Link
                href="/admin/users"
                className="hover:text-amber-600 transition-colors"
              >
                Users
              </Link>
              <Link
                href="/admin/blogs"
                className="hover:text-amber-600 transition-colors"
              >
                Blogs
              </Link>
            </>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              {/* Profile dropdown — desktop */}
              <ProfileDropdown />
              {/* Mobile avatar button (no dropdown, handled in mobile menu) */}
              <button
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <UserIcon className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex px-4 py-2 rounded-full bg-amber-600 text-white text-sm font-semibold shadow-warm hover:opacity-95 transition-opacity"
              >
                Sign up
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-600"
            onClick={() => setOpen(!open)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/search?kind=pg" onClick={() => setOpen(false)}>
              PGs
            </Link>
            <Link href="/search?kind=hotel" onClick={() => setOpen(false)}>
              Hotels
            </Link>
            <Link
              href="/search?kind=pg&type=coliving"
              onClick={() => setOpen(false)}
            >
              Coliving
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
            {isAuthenticated && (
              <Link href="/account/profile" onClick={() => setOpen(false)}>
                My Profile
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/account/bookings" onClick={() => setOpen(false)}>
                My Bookings
              </Link>
            )}
            {isOwner && (
              <>
                <Link href="/owner" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/owner/tenants" onClick={() => setOpen(false)}>
                  My Tenants
                </Link>
                <Link href="/admin/properties" onClick={() => setOpen(false)}>
                  My Properties
                </Link>
                <Link href="/owner/payments" onClick={() => setOpen(false)}>
                  Payments
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link href="/admin/properties" onClick={() => setOpen(false)}>
                  Properties
                </Link>
                <Link href="/admin/bookings" onClick={() => setOpen(false)}>
                  All Bookings
                </Link>
                <Link href="/admin/users" onClick={() => setOpen(false)}>
                  Users
                </Link>
                <Link href="/admin/blogs" onClick={() => setOpen(false)}>
                  Blogs
                </Link>
                <Link
                  href="/admin-portal"
                  onClick={() => setOpen(false)}
                  className="text-violet-600 font-semibold"
                >
                  Admin Portal
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="text-left text-red-500 font-medium"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-amber-600 font-semibold"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
