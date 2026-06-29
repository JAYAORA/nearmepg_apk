"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/data/auth-context";
import { getProperty, getPropertyRooms, reserveBed, reserveRoom, releaseBed, releaseRoom, initiatePayment, verifyPayment } from "@/lib/api";
import type { Property, Room, Bed } from "@/types/property";
import Link from "next/link";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import type { DateRange } from "react-day-picker";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const roomId = params.roomId as string;
  const bedIdArray = params.bedId as string[] | undefined;
  const bedId = bedIdArray?.[0];

  const { user, isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [bed, setBed] = useState<Bed | null>(null);
  
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAuthReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const reservedRef = useRef(false);
  const targetRoomIdRef = useRef(roomId);
  const paymentCompletedRef = useRef(false);
  const isRedirectingRef = useRef(false);
  const rzpInstanceRef = useRef<any>(null);

  // Active booking conflict state
  const [activeBookingBlock, setActiveBookingBlock] = useState<{
    propertyName: string;
    checkoutDate: string;
  } | null>(null);
  const [minCheckInDate, setMinCheckInDate] = useState<string>("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const searchParams = useSearchParams();
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const initialFrom = checkInParam ? new Date(checkInParam) : new Date();
  const initialTo = checkOutParam ? new Date(checkOutParam) : new Date(Date.now() + 86400000);

  const [checkIn, setCheckIn] = useState(() => initialFrom.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(() => initialTo.toISOString().split("T")[0]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo,
  });
  const [disabledDates, setDisabledDates] = useState<{ start: Date; end: Date }[]>([]);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name ?? "");
      if (!email) setEmail(user.email ?? "");
      
      // Fetch phone number from profile if we have user
      fetch(`/api/account/profile?uid=${user.id}`)
        .then(res => res.json())
        .then(profile => {
          if (profile?.phone && !phone) {
            setPhone(profile.phone);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  // Check for active bookings that would block a new one
  useEffect(() => {
    if (!authReady || !user || !isAuthenticated) return;
    async function checkActiveBookings() {
      try {
        const res = await fetch(
          `/api/account/bookings?tenantId=${encodeURIComponent(user!.id)}&email=${encodeURIComponent(user!.email)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        const bookings: any[] = data.bookings ?? [];
        // Find any active booking (checked-in or pending) with a future checkout
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (const b of bookings) {
          const status = (b.booking_status || "").toLowerCase();
          if (status !== "checked-in" && status !== "pending") continue;
          const checkoutStr =
            b.checkOut ||
            b.booking_details?.checkOut ||
            b.booking_details?.actualEndDate ||
            null;
          if (!checkoutStr) continue;
          const checkoutDate = new Date(checkoutStr);
          if (checkoutDate > today) {
            const minDate = checkoutDate.toISOString().split("T")[0];
            setActiveBookingBlock({
              propertyName: b.property?.hostelName || "your current property",
              checkoutDate: checkoutDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            });
            setMinCheckInDate(minDate);
            // Update check-in to earliest allowed date
            setCheckIn(minDate);
            const nextDay = new Date(checkoutDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOut(nextDay.toISOString().split("T")[0]);
            break;
          }
        }
      } catch {
        // Silent fail — conflict check is best-effort
      }
    }
    checkActiveBookings();
  }, [authReady, user, isAuthenticated]);

  useEffect(() => {
    if (!authReady) return;

    let isMounted = true;

    async function initialize() {
      try {
        const [propData, roomsData] = await Promise.all([
          getProperty(slug),
          getPropertyRooms(slug)
        ]);
        
        if (!isMounted) return;

        setProperty(propData);
        const selectedRoom = roomsData.find(r => String(r.id) === roomId);
        if (!selectedRoom) throw new Error("Room not found");
        setRoom(selectedRoom);

        let selectedBed: Bed | null = null;
        if (bedId && selectedRoom.beds) {
          selectedBed = selectedRoom.beds.find(b => String(b.id) === bedId) || null;
          if (!selectedBed) throw new Error("Bed not found");
          setBed(selectedBed);
        }
        
        targetRoomIdRef.current = selectedRoom.firestoreId || selectedRoom.id;

        // Generate or retrieve a reservation token to allow page reloads
        let token = sessionStorage.getItem("reservationToken");
        if (!token) {
          token = Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem("reservationToken", token);
        }

        // Fetch blocked dates for hotels
        if (!selectedBed && propData?.propertyType !== "pg") {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/property-rooms/${targetRoomIdRef.current}/blocked-dates`);
          if (res.ok) {
            const data = await res.json();
            if (data.blockedDates) {
              setDisabledDates(data.blockedDates.map((d: any) => ({
                start: new Date(d.start),
                end: new Date(d.end)
              })));
            }
          }
        }

        let reserveResponse;
        if (selectedBed) {
          reserveResponse = await reserveBed(targetRoomIdRef.current, selectedBed.id, token);
        } else {
          // For hotel, pass the initial selected dates
          const searchParams = new URLSearchParams(window.location.search);
          const pCheckIn = searchParams.get("checkIn");
          const pCheckOut = searchParams.get("checkOut");
          const initCheckIn = pCheckIn ? new Date(pCheckIn).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
          const initCheckOut = pCheckOut ? new Date(pCheckOut).toISOString().split("T")[0] : new Date(Date.now() + 86400000).toISOString().split("T")[0];
          reserveResponse = await reserveRoom(targetRoomIdRef.current, token, initCheckIn, initCheckOut);
        }

        reservedRef.current = true;
        if (reserveResponse.reservedUntil) {
          const until = new Date(reserveResponse.reservedUntil).getTime();
          const now = Date.now();
          const remaining = Math.floor((until - now) / 1000);
          setTimeLeft(remaining > 0 ? remaining : 0);
        }

        if (!isAuthenticated) {
          isRedirectingRef.current = true;
          router.push(`/login?redirect=/booking/${slug}/${roomId}${bedId ? `/${bedId}` : ""}`);
        }
      } catch (err: unknown) {
        if (isMounted) {
          alert(err instanceof Error ? err.message : "Failed to initialize booking.");
          router.push(`/properties/${slug}`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initialize();

    return () => {
      isMounted = false;
      
      // Do not release the bed if we are just redirecting to login
      if (isRedirectingRef.current) return;

      if (reservedRef.current && !paymentCompletedRef.current) {
        if (bedId) {
          releaseBed(targetRoomIdRef.current, bedId).catch(console.error);
        } else {
          releaseRoom(targetRoomIdRef.current).catch(console.error);
        }
      }
    };
  }, [slug, roomId, bedId, isAuthenticated, authReady, router]);

  // Timer Effect
  useEffect(() => {
    if (loading || timeLeft === null || timeLeft <= 0 || !reservedRef.current || paymentCompletedRef.current) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          clearInterval(interval);
          if (rzpInstanceRef.current && typeof rzpInstanceRef.current.close === 'function') {
            try { rzpInstanceRef.current.close(); } catch(e){}
          }
          alert("Your booking session has expired");
          window.location.href = `/properties/${slug}`;
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, timeLeft, slug, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const isPg = property?.propertyType === "pg";
  
  // Calculate nights differently based on PG vs Hotel
  const hCheckIn = dateRange?.from ? dateRange.from : new Date(checkIn);
  const hCheckOut = dateRange?.to ? dateRange.to : new Date(checkOut);
  const nights = isPg 
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : Math.max(1, Math.round((hCheckOut.getTime() - hCheckIn.getTime()) / 86400000));
    
  const total = room ? (isPg ? room.price : room.price * nights) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservedRef.current) {
      alert("Session expired.");
      return;
    }
    // Double-check client-side conflict before attempting payment
    if (activeBookingBlock) {
      alert(`You already have an active booking at ${activeBookingBlock.propertyName}. New booking can only start after ${activeBookingBlock.checkoutDate}.`);
      return;
    }

    setSubmitting(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load.");

      const payload = {
        tenantId: user?.id,
        tenantEmail: email,
        tenantPhone: phone,
        property: {
          hostelId: property?.id,
          hostelName: property?.name,
          location: property?.location,
        },
        room: {
          roomId: room?.id,
          roomName: room?.name,
          bedId: bed?.id,
        },
        pricingBreakdown: {
          finalAmountPaid: total,
        },
        bookingDetails: {
          checkIn: isPg ? checkIn : hCheckIn.toISOString(),
          checkOut: isPg ? checkOut : hCheckOut.toISOString(),
          guests
        }
      };

      let initiateRes: any;
      try {
        initiateRes = await initiatePayment(payload);
      } catch (initErr: any) {
        // Handle 409 conflict specifically
        if (initErr.message && initErr.message.includes("active booking")) {
          alert(initErr.message);
          setSubmitting(false);
          return;
        }
        throw initErr;
      }
      const payment: any = initiateRes.payment;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SfqD1lkH1e4oRa",
        amount: payment.amount * 100,
        currency: payment.currency || "INR",
        name: "NearMePG",
        description: "Booking Payment",
        order_id: payment.gateway_order_id as string,
        handler: async function (response: Record<string, unknown>) {
          try {
            const verifyRes = await verifyPayment({
              ...response,
              paymentId: payment.id,
            });
            if (verifyRes.success) {
              paymentCompletedRef.current = true;
              alert("Payment successful!");
              router.push("/account/bookings");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: {
          color: "#d97706", // amber-600
        },
        timeout: Math.max(1, (timeLeft || 0) - 5 || 1),
      };

      const rzp = new (window as Record<string, any>).Razorpay(options);
      rzpInstanceRef.current = rzp;
      rzp.on("payment.failed", function (response: Record<string, unknown>) {
        console.error(response.error);
        alert("Payment failed.");
      });
      rzp.open();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Payment initiation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authReady || loading) {
    return <div className="max-w-3xl mx-auto px-6 py-12 text-center">Loading booking session...</div>;
  }

  if (!property || !room || (bedId && !bed)) {
    return <div className="max-w-3xl mx-auto px-6 py-12 text-center">Booking not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Active booking conflict banner */}
      {activeBookingBlock && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-start gap-3">
            <span className="text-amber-600 mt-0.5 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Active booking at {activeBookingBlock.propertyName}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                You have an ongoing stay. You can book a new place starting from <strong>{activeBookingBlock.checkoutDate}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
      {timeLeft !== null && timeLeft > 0 && (
        <div className="bg-red-600 text-white py-2 px-4 text-center font-semibold sticky top-0 z-40 shadow-md">
          Time remaining to complete booking: {formatTime(timeLeft)}
        </div>
      )}
      
      {/* KYC Verification Banner */}
      {user && !user.aadhaarVerified && (
        <div className="bg-rose-50 border-b border-rose-200 py-3 px-4 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-start gap-3">
            <span className="text-rose-600 mt-0.5 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-rose-800">
                KYC Verification Required
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                You must complete your KYC verification before you can book a stay.{" "}
                <Link href="/account/profile" className="underline font-semibold hover:text-rose-900">
                  Verify now &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">Complete your booking</h1>
        <p className="text-slate-500 mt-1">{property.name} · {property.location}</p>

        <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-6">
            
            {/* Room Info */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg mb-4 text-slate-900">Selected {isPg ? "Room" : "Room Type"}</h2>
              <div className="p-4 rounded-2xl border border-amber-500 bg-amber-50 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-800">{room.name || "Standard Room"}</div>
                  <div className="text-xs text-slate-600">Sharing: {room.sharing} {room.hasAC ? "· AC" : "· Non-AC"}</div>
                </div>
                <div className="text-sm font-bold text-slate-800">₹{room.price.toLocaleString("en-IN")}</div>
              </div>
            </div>

            {/* Bed Info */}
            {isPg && bed && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="font-display font-bold text-lg mb-4 text-slate-900">Selected Bed</h2>
                <div className="inline-flex px-6 py-2 rounded-full font-semibold bg-amber-600 text-white shadow-sm">
                  {bed.label || `Bed ${bed.id}`}
                </div>
              </div>
            )}

            {/* Dates & guest */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className={isPg ? "grid sm:grid-cols-3 gap-4" : "space-y-4"}>
                {isPg ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Move-in</label>
                      <input
                        type="date"
                        required
                        value={checkIn}
                        min={minCheckInDate || undefined}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Move-out</label>
                      <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stay Dates</label>
                    <DateRangePicker 
                      date={dateRange} 
                      setDate={setDateRange} 
                      disabledDates={disabledDates} 
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                  <input type="number" min={1} max={room.sharing} required value={guests} onChange={(e) => setGuests(+e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
            </div>

            {/* Guest info */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="font-display font-bold text-lg text-slate-900">Your details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input required readOnly={!!user?.name} value={name} onChange={(e) => setName(e.target.value)} className={`w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 ${user?.name ? "bg-slate-50 opacity-70" : ""}`} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required readOnly={!!user?.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 ${user?.email ? "bg-slate-50 opacity-70" : ""}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required readOnly={!!phone && user !== null} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 ${phone && user !== null ? "bg-slate-50 opacity-70" : ""}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
            <h2 className="font-display font-bold text-lg text-slate-900">Price summary</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>{room.name || "Room Base Price"}</span><span className="font-medium">₹{room.price.toLocaleString("en-IN")}</span></div>
              {!isPg && <div className="flex justify-between"><span>{nights} night{nights > 1 ? "s" : ""}</span><span className="font-medium">× {nights}</span></div>}
              <div className="flex justify-between"><span>Taxes & fees</span><span className="font-medium">Included</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-display text-2xl font-bold text-amber-600">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button
              type="submit"
              disabled={submitting || !!activeBookingBlock || !user?.aadhaarVerified}
              className="mt-5 w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-2xl font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Processing..."
                : activeBookingBlock
                ? `Available from ${activeBookingBlock.checkoutDate}`
                : !user?.aadhaarVerified
                ? "KYC Verification Required"
                : "Pay Now"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
