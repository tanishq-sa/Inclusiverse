
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Lock,
  Search,
  Download,
  RefreshCw,
  Users,
  IndianRupee,
  Ticket,
  LogOut,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  ScanLine,
  UserCheck,
  UserX,
  Camera,
  CameraOff,
  ClipboardList,
  ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Pencil,
} from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Attendee {
  name: string;
  regNo: string;
  email: string;
}

interface TicketInfo {
  ticketId: string;
  bookingId: string;
  attendeeName: string;
  attendeeRegNo: string;
  attendeeEmail: string;
  checkedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
}

interface Booking {
  _id: string;
  bookingId: string;
  createdAt: string;
  primaryName: string;
  primaryRegNo: string;
  primaryEmail: string;
  attendees: Attendee[];
  tickets: TicketInfo[];
  attendeeCount: number;
  totalAmount: number;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  paymentScreenshotUrl?: string;
  status: string;
  emailSent?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE;

// ─── Passcode Gate ─────────────────────────────────────────────────────────────
function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const submit = () => {
    if (value === ADMIN_PASSCODE) {
      onUnlock();
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <m.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10 w-full max-w-sm text-center"
      >
        <div className={`w-16 h-16 rounded-2xl ${error ? "bg-red-100" : "bg-primary/10"} flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}>
          <Lock className={`w-8 h-8 ${error ? "text-red-500" : "text-primary"} transition-colors`} />
        </div>
        <h1 className="text-2xl font-display font-bold text-text-main mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-8">Chhichhore · Inclusiverse</p>

        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Enter passcode"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 font-mono tracking-widest text-center ${error
                ? "border-red-400 bg-red-50 focus:ring-red-200"
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
              }`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-500 mb-4 flex items-center justify-center gap-1"
          >
            <AlertCircle className="w-3 h-3" /> Incorrect passcode
          </m.p>
        )}

        <button
          type="button"
          onClick={submit}
          className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          Unlock
        </button>
      </m.div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string }) {
  const bg = color === "green" ? "bg-green-100" : color === "amber" ? "bg-amber-100" : "bg-primary/10";
  const text = color === "green" ? "text-green-600" : color === "amber" ? "text-amber-600" : "text-primary";
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${text}`} />
        </div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-display font-bold text-text-main">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── QR Scanner Component ──────────────────────────────────────────────────────
function QrScanner({ onScan, enabled }: { onScan: (data: string) => void; enabled: boolean }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastScanRef = useRef<string>("");

  const startScanning = useCallback(async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          // Prevent rapid duplicate scans
          if (decodedText !== lastScanRef.current) {
            lastScanRef.current = decodedText;
            onScan(decodedText);
            // Reset after 3 seconds to allow re-scan
            setTimeout(() => { lastScanRef.current = ""; }, 3000);
          }
        },
        () => {} // ignore errors during scanning
      );
      setIsScanning(true);
    } catch (err) {
      setError("Could not access camera. Please grant camera permission and try again.");
      console.error("QR Scanner error:", err);
    }
  }, [onScan]);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  }, [isScanning]);

  useEffect(() => {
    if (enabled && !isScanning) {
      startScanning();
    }
    if (!enabled && isScanning) {
      stopScanning();
    }
    return () => { stopScanning(); };
  }, [enabled]);

  return (
    <div>
      <div
        id="qr-reader"
        className="rounded-2xl overflow-hidden bg-gray-900"
        style={{ width: "100%", maxWidth: 400, minHeight: enabled ? 300 : 0 }}
      />
      {error && (
        <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

// ─── Check-In Result Toast ─────────────────────────────────────────────────────
interface CheckInResult {
  type: "success" | "error" | "already";
  message: string;
  attendeeName?: string;
  attendeeRegNo?: string;
  bookingId?: string;
  checkedInAt?: string;
}

function CheckInToast({ result, onDismiss }: { result: CheckInResult; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bg = result.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const icon = result.type === "success"
    ? <CheckCircle2 className="w-6 h-6 text-green-500" />
    : <AlertCircle className="w-6 h-6 text-red-500" />;

  return (
    <m.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 ${bg} border rounded-2xl p-5 shadow-2xl`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-base ${result.type === "success" ? "text-green-800" : "text-red-800"}`}>
            {result.type === "success" ? "✅ Check-In Successful" : result.type === "already" ? "⚠️ Already Checked In" : "❌ Check-In Failed"}
          </p>
          {result.attendeeName && (
            <p className="text-sm text-gray-700 mt-1">
              <strong>{result.attendeeName}</strong>
              {result.attendeeRegNo && <span className="text-gray-400 ml-2 font-mono text-xs">{result.attendeeRegNo}</span>}
            </p>
          )}
          {result.bookingId && (
            <p className="text-xs text-gray-400 mt-0.5">Booking: {result.bookingId}</p>
          )}
          {result.type === "already" && result.checkedInAt && (
            <p className="text-xs text-red-500 mt-1">
              Was checked in at {new Date(result.checkedInAt).toLocaleTimeString("en-IN")}
            </p>
          )}
          {result.type === "error" && <p className="text-sm text-red-600 mt-1">{result.message}</p>}
        </div>
        <button type="button" onClick={onDismiss} className="text-gray-400 hover:text-gray-600 cursor-pointer text-sm">✕</button>
      </div>
    </m.div>
  );
}

// ─── Check-In Tab ──────────────────────────────────────────────────────────────
function CheckInTab() {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [stats, setStats] = useState({ totalTickets: 0, checkedIn: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/bookings/all-tickets`, { headers: { "x-admin-passcode": ADMIN_PASSCODE } }),
        fetch(`${API_BASE}/api/bookings/checkin-stats`, { headers: { "x-admin-passcode": ADMIN_PASSCODE } }),
      ]);
      const ticketsData = await ticketsRes.json();
      const statsData = await statsRes.json();
      setTickets(ticketsData.tickets || []);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch check-in data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckIn = async (ticketId: string, method: "qr" | "manual") => {
    setProcessingId(ticketId);
    try {
      const endpoint = method === "qr" ? "checkin" : "manual-checkin";
      const res = await fetch(`${API_BASE}/api/bookings/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passcode": ADMIN_PASSCODE },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();

      if (res.ok) {
        setCheckInResult({
          type: "success",
          message: "Check-in successful",
          attendeeName: data.attendeeName,
          attendeeRegNo: data.attendeeRegNo,
          bookingId: data.bookingId,
        });
        fetchData(); // refresh
      } else if (res.status === 409) {
        setCheckInResult({
          type: "already",
          message: data.error,
          attendeeName: data.attendeeName,
          checkedInAt: data.checkedInAt,
        });
      } else {
        setCheckInResult({
          type: "error",
          message: data.error || "Unknown error",
        });
      }
    } catch {
      setCheckInResult({
        type: "error",
        message: "Network error — please check your connection",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleQrScan = (data: string) => {
    // The QR contains just the UUID ticketId
    handleCheckIn(data.trim(), "qr");
  };

  // Filter tickets by search
  const filtered = useMemo(() => {
    const q = manualSearch.toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (t) =>
        t.attendeeName.toLowerCase().includes(q) ||
        t.attendeeRegNo.includes(q) ||
        t.attendeeEmail.toLowerCase().includes(q) ||
        t.bookingId.toLowerCase().includes(q)
    );
  }, [tickets, manualSearch]);

  const checkedInPercentage = stats.totalTickets > 0
    ? Math.round((stats.checkedIn / stats.totalTickets) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Check-in Result Toast */}
      <AnimatePresence>
        {checkInResult && (
          <CheckInToast result={checkInResult} onDismiss={() => setCheckInResult(null)} />
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Ticket} label="Total Tickets" value={stats.totalTickets} />
        <StatCard icon={UserCheck} label="Checked In" value={stats.checkedIn} sub={`${checkedInPercentage}%`} color="green" />
        <StatCard icon={UserX} label="Remaining" value={stats.remaining} color="amber" />
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">Attendance Progress</span>
          <span className="text-sm font-bold text-primary">{checkedInPercentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <m.div
            className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${checkedInPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Scanner + Manual Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-bold text-text-main text-base">QR Scanner</h3>
            </div>
            <button
              type="button"
              onClick={() => setScannerEnabled((e) => !e)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                scannerEnabled
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-primary text-white hover:bg-primary-hover shadow-sm"
              }`}
            >
              {scannerEnabled ? (
                <><CameraOff className="w-3.5 h-3.5" /> Stop</>
              ) : (
                <><Camera className="w-3.5 h-3.5" /> Start Scanner</>
              )}
            </button>
          </div>
          {scannerEnabled ? (
            <QrScanner onScan={handleQrScan} enabled={scannerEnabled} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-300">
              <Camera className="w-16 h-16 mb-3 opacity-30" />
              <p className="text-sm text-gray-400">Click "Start Scanner" to begin scanning QR codes</p>
            </div>
          )}
        </div>

        {/* Manual Search */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Search className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-display font-bold text-text-main text-base">Manual Check-In</h3>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, reg no, email, or booking ID…"
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all"
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">{manualSearch ? "No results found" : "No tickets"}</p>
              </div>
            ) : (
              filtered.map((t) => (
                <div
                  key={t.ticketId}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    t.checkedIn
                      ? "bg-green-50/50 border-green-200"
                      : "bg-white border-gray-100 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      t.checkedIn ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      {t.checkedIn ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <UserX className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-main truncate">{t.attendeeName}</p>
                      <p className="text-xs text-gray-400">
                        <span className="font-mono">{t.attendeeRegNo}</span>
                        <span className="mx-1">·</span>
                        <span>{t.bookingId}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {t.checkedIn ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" /> In
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCheckIn(t.ticketId, "manual")}
                        disabled={processingId === t.ticketId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        {processingId === t.ticketId ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full attendance table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-text-main text-sm">All Tickets</h3>
          </div>
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reg No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Booking</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Checked In At</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, idx) => (
                    <tr
                      key={t.ticketId}
                      className={`border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} ${
                        t.checkedIn ? "" : "hover:bg-primary/5"
                      } transition-colors`}
                    >
                      <td className="px-4 py-3">
                        {t.checkedIn ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" /> In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            <UserX className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-text-main whitespace-nowrap">{t.attendeeName}</td>
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">{t.attendeeRegNo}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] truncate">{t.attendeeEmail}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-primary text-xs tracking-wider">{t.bookingId}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {t.checkedInAt
                          ? new Date(t.checkedInAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {t.checkedInBy ? (
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            t.checkedInBy === "qr" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {t.checkedInBy === "qr" ? "📱 QR" : "✋ Manual"}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {!t.checkedIn && (
                          <button
                            type="button"
                            onClick={() => handleCheckIn(t.ticketId, "manual")}
                            disabled={processingId === t.ticketId}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {processingId === t.ticketId ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {filtered.map((t) => (
                <div key={t.ticketId} className="p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary text-xs tracking-wider">{t.bookingId}</span>
                      {t.checkedIn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" /> In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                          <UserX className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                    {t.checkedInBy && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        t.checkedInBy === "qr" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {t.checkedInBy === "qr" ? "📱 QR" : "✋ Manual"}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-text-main text-sm">{t.attendeeName}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{t.attendeeRegNo}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{t.attendeeEmail}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                      {t.checkedInAt
                        ? new Date(t.checkedInAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })
                        : "Not checked in yet"}
                    </span>
                    {!t.checkedIn && (
                      <button
                        type="button"
                        onClick={() => handleCheckIn(t.ticketId, "manual")}
                        disabled={processingId === t.ticketId}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {processingId === t.ticketId ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-center text-gray-400">
        Showing {filtered.length} of {tickets.length} tickets
      </p>
    </div>
  );
}

// ─── Reviews Tab ────────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<{ bookingId: string; ticketId?: string; current: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/pending-reviews`, {
        headers: { "x-admin-passcode": ADMIN_PASSCODE },
      });
      const data = await res.json();
      setPendingBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch pending reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleReview = async (bookingId: string, action: "approve" | "reject") => {
    const reason = action === "reject" ? window.prompt("Rejection reason (optional):") : undefined;
    if (action === "reject" && reason === null) return; // user cancelled prompt

    setProcessingId(bookingId);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/review-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-passcode": ADMIN_PASSCODE },
        body: JSON.stringify({ bookingId, action, reason: reason || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchPending();
      } else {
        alert(data.error || "Failed to process review");
      }
    } catch {
      alert("Network error — please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEditEmail = async () => {
    if (!editingEmail || !newEmail.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/edit-email`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-passcode": ADMIN_PASSCODE },
        body: JSON.stringify({
          bookingId: editingEmail.bookingId,
          ticketId: editingEmail.ticketId,
          newEmail: newEmail.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Email updated!");
        setEditingEmail(null);
        setNewEmail("");
        fetchPending();
      } else {
        alert(data.error || "Failed to update email");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-text-main flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Pending Reviews
          {pendingBookings.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {pendingBookings.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={fetchPending}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-gray-200 text-sm font-medium text-gray-600 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : pendingBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">All caught up!</p>
          <p className="text-sm text-gray-400 mt-1">No bookings are pending review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-4 bg-amber-50/50 border-b border-amber-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary text-sm tracking-wider">{b.bookingId}</span>
                    <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Pending Review
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>{b.primaryName}</strong> · {b.primaryRegNo} · {b.primaryEmail}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.attendeeCount} {b.attendeeCount === 1 ? "attendee" : "attendees"} · ₹{b.totalAmount} · {new Date(b.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex sm:items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleReview(b.bookingId, "approve")}
                    disabled={processingId === b.bookingId}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {processingId === b.bookingId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(b.bookingId, "reject")}
                    disabled={processingId === b.bookingId}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Payment Screenshot */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Screenshot</p>
                  {b.paymentScreenshotUrl ? (
                    <div>
                      <img
                        src={b.paymentScreenshotUrl}
                        alt="Payment screenshot"
                        className="w-full max-h-64 object-contain rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewImage(b.paymentScreenshotUrl!)}
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewImage(b.paymentScreenshotUrl!)}
                        className="mt-2 text-xs text-primary font-medium cursor-pointer hover:underline"
                      >
                        View full size →
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-400 text-sm">
                      No screenshot uploaded
                    </div>
                  )}
                </div>

                {/* Attendee Details */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Attendees</p>
                  <div className="space-y-2">
                    {[
                      { name: b.primaryName, regNo: b.primaryRegNo, email: b.primaryEmail, isPrimary: true },
                      ...b.attendees.map((a) => ({ ...a, isPrimary: false })),
                    ].map((att, i) => (
                      <div key={i} className="flex items-center justify-between bg-surface rounded-xl px-3 py-2.5">
                        <div>
                          <p className="text-sm font-medium text-text-main">
                            {att.name}
                            {att.isPrimary && <span className="text-xs text-primary ml-1.5">(Primary)</span>}
                          </p>
                          <p className="text-xs text-gray-400">{att.regNo} · {att.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEmail({ bookingId: b.bookingId, current: att.email });
                            setNewEmail(att.email);
                          }}
                          className="text-gray-400 hover:text-primary transition-colors cursor-pointer p-1"
                          title="Edit email"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Email Modal */}
      {editingEmail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingEmail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-text-main text-lg mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Edit Email
            </h3>
            <p className="text-sm text-gray-500 mb-3">Current: <strong>{editingEmail.current}</strong></p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email address"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleEditEmail}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingEmail(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-size Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Payment screenshot full size"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"bookings" | "checkin" | "reviews">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Booking>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"emails" | "full" | null>(null);
  const [settings, setSettings] = useState<any>({ ticketsEnabled: true });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResendFailedEmails = async () => {
    if (!window.confirm("Are you sure you want to resend failed ticket emails?")) return;
    setResending(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/resend-failed-emails`, {
        method: "POST",
        headers: { "x-admin-passcode": ADMIN_PASSCODE },
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchBookings();
    } catch (err) {
      alert("Failed to trigger resend. Please check the network.");
    } finally {
      setResending(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { "x-admin-passcode": ADMIN_PASSCODE },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTickets = async () => {
    setSettingsLoading(true);
    try {
      const newVal = !settings.ticketsEnabled;
      await fetch(`${API_BASE}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-passcode": ADMIN_PASSCODE },
        body: JSON.stringify({ key: "ticketsEnabled", value: newVal }),
      });
      setSettings((prev: any) => ({ ...prev, ticketsEnabled: newVal }));
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); fetchSettings(); }, []);

  // ── Computed stats ──────────────────────────────────────────────────────
  const totalRevenue = bookings.reduce((s, b) => s + b.totalAmount, 0);
  const totalAttendees = bookings.reduce((s, b) => s + b.attendeeCount, 0);

  // ── Filtered + sorted ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bookings
      .filter(
        (b) =>
          !q ||
          b.primaryName.toLowerCase().includes(q) ||
          b.primaryEmail.toLowerCase().includes(q) ||
          b.primaryRegNo.includes(q) ||
          b.bookingId.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = a[sortField] as string | number;
        const bv = b[sortField] as string | number;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortAsc ? cmp : -cmp;
      });
  }, [bookings, search, sortField, sortAsc]);

  const toggleSort = (field: keyof Booking) => {
    if (sortField === field) setSortAsc((a) => !a);
    else { setSortField(field); setSortAsc(true); }
  };

  // ── CSV download ────────────────────────────────────────────────────────
  const downloadCSV = async (type: "emails" | "full") => {
    setDownloading(type);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/export?type=${type}`, {
        headers: { "x-admin-passcode": ADMIN_PASSCODE },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "emails" ? "Chhichhore-emails.csv" : "Chhichhore-full-report.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  // ── Sort indicator ──────────────────────────────────────────────────────
  const SortIcon = ({ field }: { field: keyof Booking }) =>
    sortField === field ? (
      sortAsc ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />
    ) : null;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-display font-bold text-text-main leading-none">Admin Panel</h1>
              <p className="text-xs text-gray-400">Chhichhore · Inclusiverse</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="hidden sm:flex items-center bg-surface rounded-xl border border-gray-200 p-0.5">
              <button
                type="button"
                onClick={() => setTab("bookings")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tab === "bookings"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Ticket className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                Bookings
              </button>
              <button
                type="button"
                onClick={() => setTab("reviews")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tab === "reviews"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                Reviews
              </button>
              <button
                type="button"
                onClick={() => setTab("checkin")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  tab === "checkin"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ScanLine className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                Check-In
              </button>
            </div>
            <button
              type="button"
              onClick={() => tab === "bookings" ? fetchBookings() : undefined}
              disabled={loading && tab === "bookings"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-gray-200 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading && tab === "bookings" ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-t border-gray-100">
          <button
            type="button"
            onClick={() => setTab("bookings")}
            className={`flex-1 py-2.5 text-xs font-semibold text-center transition-all cursor-pointer ${
              tab === "bookings" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-gray-500"
            }`}
          >
            <Ticket className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            Bookings
          </button>
          <button
            type="button"
            onClick={() => setTab("reviews")}
            className={`flex-1 py-2.5 text-xs font-semibold text-center transition-all cursor-pointer ${
              tab === "reviews" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-gray-500"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            Reviews
          </button>
          <button
            type="button"
            onClick={() => setTab("checkin")}
            className={`flex-1 py-2.5 text-xs font-semibold text-center transition-all cursor-pointer ${
              tab === "checkin" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-gray-500"
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            Check-In
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {tab === "checkin" ? (
          <CheckInTab />
        ) : tab === "reviews" ? (
          <ReviewsTab />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={Ticket} label="Total Bookings" value={bookings.length} sub={`${filtered.length} shown`} />
              <StatCard icon={Users} label="Total Attendees" value={totalAttendees} />
              <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} />
            </div>

            {/* Controls: Search + Download */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, email, reg no, booking ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all"
                />
              </div>

              {/* Toggles & Download buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-sm font-medium text-gray-700">Ticket Sales</span>
                  <button
                    type="button"
                    onClick={toggleTickets}
                    disabled={settingsLoading}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                      settings.ticketsEnabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        settings.ticketsEnabled ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendFailedEmails}
                  disabled={resending}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Resend Failed Emails
                </button>
                <button
                  type="button"
                  onClick={() => downloadCSV("emails")}
                  disabled={!!downloading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-primary/40 text-sm font-medium text-gray-700 hover:text-primary transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {downloading === "emails" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Emails CSV
                </button>
                <button
                  type="button"
                  onClick={() => downloadCSV("full")}
                  disabled={!!downloading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm shadow-primary/20 cursor-pointer disabled:opacity-50"
                >
                  {downloading === "full" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Full Report
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
                <button type="button" onClick={fetchBookings} className="ml-auto text-xs text-red-600 underline cursor-pointer">Retry</button>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Ticket className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-medium">{search ? "No results found" : "No bookings yet"}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface border-b border-gray-100">
                        {[
                          { label: "Booking ID", field: "bookingId" as keyof Booking },
                          { label: "Name", field: "primaryName" as keyof Booking },
                          { label: "Reg No.", field: "primaryRegNo" as keyof Booking },
                          { label: "Email", field: "primaryEmail" as keyof Booking },
                          { label: "People", field: "attendeeCount" as keyof Booking },
                          { label: "Total", field: "totalAmount" as keyof Booking },
                          { label: "Date", field: "createdAt" as keyof Booking },
                          { label: "Status", field: "status" as keyof Booking },
                        ].map(({ label, field }) => (
                          <th
                            key={field}
                            onClick={() => toggleSort(field)}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-primary transition-colors whitespace-nowrap select-none"
                          >
                            {label}
                            <SortIcon field={field} />
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Attendees
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b, idx) => (
                        <React.Fragment key={b._id}>
                          <tr
                            className={`border-b border-gray-50 hover:bg-primary/5 transition-colors cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                              } ${expandedId === b._id ? "bg-primary/5" : ""}`}
                            onClick={() => setExpandedId(expandedId === b._id ? null : b._id)}
                          >
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-primary text-xs tracking-wider">{b.bookingId}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-text-main whitespace-nowrap">{b.primaryName}</td>
                            <td className="px-4 py-3 font-mono text-gray-500 text-xs">{b.primaryRegNo}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] truncate">{b.primaryEmail}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                {b.attendeeCount}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-text-main whitespace-nowrap">₹{b.totalAmount}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                              {new Date(b.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${b.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                                }`}>
                                {b.status === "paid" && <CheckCircle2 className="w-3 h-3" />}
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">
                              {b.attendeeCount > 1 ? (
                                <button type="button" className="text-primary hover:underline cursor-pointer text-xs">
                                  {expandedId === b._id ? "Hide" : `+${b.attendeeCount - 1} more`}
                                </button>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          </tr>

                          {/* Expanded: Additional attendees */}
                          <AnimatePresence>
                            {expandedId === b._id && b.attendees.length > 0 && (
                              <tr>
                                <td colSpan={9} className="bg-primary/5 border-b border-primary/10 px-4 py-3">
                                  <m.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Additional Attendees</p>
                                    <div className="space-y-1.5">
                                      {b.attendees.map((a, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white rounded-lg px-3 py-2 text-sm border border-gray-100">
                                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                                            {i + 2}
                                          </span>
                                          <span className="font-medium text-text-main">{a.name}</span>
                                          <span className="font-mono text-xs text-gray-400">{a.regNo}</span>
                                          <span className="text-xs text-gray-400">{a.email}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </m.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <p className="text-xs text-center text-gray-400">
              Showing {filtered.length} of {bookings.length} bookings
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Exported Page ─────────────────────────────────────────────────────────────
export function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false);

  return unlocked ? (
    <AdminDashboard onLogout={() => setUnlocked(false)} />
  ) : (
    <PasscodeGate onUnlock={() => setUnlocked(true)} />
  );
}
