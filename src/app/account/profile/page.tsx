"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/data/auth-context";
import { Loader2, ShieldCheck, ShieldAlert, User as UserIcon, Phone, Mail, MapPin } from "lucide-react";

interface ProfileForm {
  displayName: string;
  phone: string;
  altPhone: string;
  gender: string;
  dob: string;
  address: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // KYC State
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [kycLoading, setKycLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>();

  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/account/profile");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/account/profile?uid=${user!.id}`);
        const profile = await res.json();
        if (res.ok && profile) {
          reset({
            displayName: profile.displayName || "",
            phone: profile.phone || "",
            altPhone: profile.altPhone || "",
            gender: profile.gender || "",
            dob: profile.dob || "",
            address: profile.address || "",
          });
          if (profile.aadhaarVerified !== user!.aadhaarVerified) {
            login({ ...user!, aadhaarVerified: profile.aadhaarVerified });
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [authReady, isAuthenticated, user, router, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user!.id, ...data })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save profile");
      
      setMessage({ type: "success", text: "Profile updated successfully." });
      
      // Update local context name
      if (data.displayName !== user!.name) {
        login({ ...user!, name: data.displayName });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleKycVerify = async () => {
    setKycLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/verify-kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user!.id, aadhaarNumber })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Verification failed");
      
      setMessage({ type: "success", text: "KYC Verified successfully!" });
      login({ ...user!, aadhaarVerified: true });
      setKycModalOpen(false);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setKycLoading(false);
    }
  };

  if (!authReady || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and verification status.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Verification Status Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">KYC Verification</h3>
            {user?.aadhaarVerified ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-800">Verified</p>
                <p className="text-xs text-emerald-600 mt-1">Your identity is verified securely via DigiLocker.</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-amber-800">Not Verified</p>
                <p className="text-xs text-amber-700 mt-1 mb-4">Complete your KYC to unlock seamless bookings.</p>
                <button
                  onClick={() => setKycModalOpen(true)}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Verify Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("displayName", { required: "Name is required" })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm bg-slate-50 focus:bg-white"
                    />
                  </div>
                  {errors.displayName && <p className="text-xs text-red-500 mt-1">{errors.displayName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={user?.email || ""}
                      readOnly
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9+\-\s()]+$/, message: "Invalid phone" } })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm bg-slate-50 focus:bg-white"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alternate Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      {...register("altPhone")}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                  <select
                    {...register("gender")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm bg-slate-50 focus:bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    {...register("dob")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Permanent Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      {...register("address")}
                      rows={3}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm bg-slate-50 focus:bg-white resize-none"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* KYC Modal */}
      {kycModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                DigiLocker KYC
              </h2>
              <button onClick={() => setKycModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              We use DigiLocker via Surepass to securely verify your identity. Enter your 12-digit Aadhaar number below to simulate verification.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Aadhaar Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                className="w-full px-4 py-3 text-center text-xl tracking-[0.2em] font-mono rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-slate-50"
              />
            </div>

            <button
              onClick={handleKycVerify}
              disabled={kycLoading || aadhaarNumber.length < 12}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {kycLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
