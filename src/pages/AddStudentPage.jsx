import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CheckCircle, Printer, Eye, EyeOff, QrCode } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

const AI_COURSES = {
  English: [
    "Student AI Course","Parents AI Course","Compete AI Course","Business AI Course",
    "Professional AI Course","Educate/Teacher AI Course","Trainers AI Course","Marketing AI Course",
    "Sales AI Course","Agriculture AI Course","Finance/Accounts AI Course","Investment AI Course",
    "Employees AI Course","Entertainment AI Course","Journalists AI Course","Logistics AI Course",
    "Content Creators AI Course","Supply Chain AI Course","Entrepreneurs AI Course",
    "Startups/Founders AI Course","Entrepreneur/Startup AI Course","Healthcare AI Course",
    "Photographers AI Course","Lawyers AI Course","Designers AI Course",
    "Government Employees AI Course","Construction AI Course","Real Estates AI Course",
    "Social Media AI Course","Cybersecurity AI Course","Civil Engineers AI Course",
    "Human Resource AI Course","Hospitality/Tourism AI Course","House wife AI Course",
  ],
  Kannada: [
    "Student AI Course","Parents AI Course","Compete AI Course","Business AI Course",
    "Professional AI Course","Educate/Teacher AI Course","Trainers AI Course","Marketing AI Course",
    "Sales AI Course","Agriculture AI Course","Finance/Accounts AI Course","Investment AI Course",
    "Employees AI Course","Entertainment AI Course","Journalists AI Course","Logistics AI Course",
    "Content Creators AI Course","Supply Chain AI Course","Entrepreneurs AI Course",
    "Startups/Founders AI Course","Entrepreneur/Startup AI Course","Healthcare AI Course",
    "Photographers AI Course","Lawyers AI Course","Designers AI Course",
    "Government Employees AI Course","Construction AI Course","Real Estates AI Course",
    "Social Media AI Course","Cybersecurity AI Course","Civil Engineers AI Course",
    "Human Resource AI Course","Hospitality/Tourism AI Course","House wife AI Course",
  ],
};

// Same API base the website uses for aicard routes
const AICARD_API = import.meta.env.VITE_AICARD_API_BASE;
const API_KEY    = import.meta.env.VITE_API_KEY;
const API_SECRET = import.meta.env.VITE_API_SECRET;

async function aicardFetch(path, body) {
  const res = await fetch(`${AICARD_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "x-api-secret": API_SECRET,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

// ─── Step 2: Verify Card (QR input + QR Scan) ─────────────────────────────────
function Step2Verify({ cardNo, setCardNo, cvv, setCvv, verifyError, setVerifyError, verifyLoading, onBack, onVerify }) {
  const [qrInput, setQrInput]     = useState("");
  const [scanning, setScanning]   = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const html5QrRef = useRef(null);

  const lookupCard = async (qrCode) => {
    if (!qrCode.trim()) return;
    setQrLoading(true);
    setVerifyError("");
    try {
      const res = await api.get(`/center/card-lookup?qrCode=${encodeURIComponent(qrCode.trim())}`);
      setCardNo(res.data.cardNo);
      setCvv(res.data.cvv);
      toast.success("Card found!");
    } catch (err) {
      setVerifyError(err.response?.data?.message || "QR code not recognised");
      setCardNo(""); setCvv("");
    } finally {
      setQrLoading(false);
    }
  };

  const startScanner = async () => {
    setScanning(true);
    setVerifyError("");
    await new Promise(r => setTimeout(r, 100));
    try {
      html5QrRef.current = new Html5Qrcode("qr-reader");
      await html5QrRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await stopScanner();
          setQrInput(decodedText);
          await lookupCard(decodedText);
        },
        () => {}
      );
    } catch {
      setVerifyError("Camera access denied or not available");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrRef.current?.isScanning) {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      }
    } catch {}
    setScanning(false);
  };

  useEffect(() => { return () => { stopScanner(); }; }, []);

  const scanned = cardNo && cvv;

  return (
    <div className="space-y-4">
      {verifyError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {verifyError}
        </div>
      )}

      {/* QR Code text input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter QR Code</label>
        <div className="flex gap-2">
          <input
            value={qrInput}
            onChange={e => { setQrInput(e.target.value); setCardNo(""); setCvv(""); setVerifyError(""); }}
            onKeyDown={e => e.key === "Enter" && lookupCard(qrInput)}
            placeholder="Type or paste QR code value"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => lookupCard(qrInput)}
            disabled={qrLoading || !qrInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {qrLoading ? "..." : "Find"}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Camera scanner */}
      {!scanning ? (
        <button onClick={startScanner}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-blue-300 text-blue-600 text-sm font-medium hover:bg-blue-50 transition">
          <QrCode size={16} /> Scan QR Code with Camera
        </button>
      ) : (
        <div className="space-y-2">
          <div id="qr-reader" className="w-full rounded-xl overflow-hidden border border-gray-200" />
          <button onClick={stopScanner}
            className="w-full py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancel Scan
          </button>
        </div>
      )}

      {/* Card details after lookup */}
      {scanned && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
            <CheckCircle size={15} className="text-green-600" />
            <p className="text-sm font-semibold text-green-700">Card found</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["AI Card Number", cardNo], ["CVV", cvv]].map(([label, value]) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-mono text-sm font-bold text-gray-800 tracking-wider">{value}</p>
              </div>
            ))}
          </div>
          <button onClick={() => { setCardNo(""); setCvv(""); setQrInput(""); setVerifyError(""); }}
            className="w-full py-1.5 rounded-lg border border-gray-200 text-xs text-gray-400 hover:bg-gray-50 transition flex items-center justify-center gap-1">
            <QrCode size={12} /> Use a different card
          </button>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
          ← Back
        </button>
        <button onClick={onVerify} disabled={verifyLoading || !scanned}
          className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
          {verifyLoading ? "Verifying..." : "Next →"}
        </button>
      </div>
    </div>
  );
}

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = ["Student Info", "Verify Card", "Activate Card"];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                ${done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                {done ? <CheckCircle size={16} /> : num}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${active ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 mb-4 rounded ${current > num ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Activation Success: Credentials + Print Slip ─────────────────────────────
const LMS_URL        = "https://access.yaticorp.in/signin";       // CSC center flow
const STUDENT_LMS_URL = "https://learn.yaticorp.com/learn/account/signin"; // student course access

function ActivationSuccess({ student, cardNo, cvv, center }) {
  const lmsEmail    = `${cardNo}@yaticorp.com`;
  const lmsPassword = student.password;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-slip, #print-slip * { visibility: visible !important; }
          #print-slip { position: fixed; inset: 0; padding: 32px; background: white; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="space-y-4">
        {/* Success banner */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
          <CheckCircle size={18} className="text-green-600" />
          <p className="text-sm font-semibold text-green-700">AI Card Activated Successfully!</p>
        </div>

        {/* ── Note alert ── */}
        <div className="no-print flex items-start gap-3 bg-yellow-50 border border-yellow-300 px-4 py-3 rounded-lg">
          <span className="text-yellow-500 text-base mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-yellow-800">Note — To be completed by CSC Center</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Open the AI Course Access Login link below, sign in with the student's credentials, and complete the course enrollment setup before handing the slip to the student.
            </p>
          </div>
        </div>

        {/* ── AI Course Access Login (CSC center completes this) ── */}
        <div className="no-print border-2 border-blue-200 rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-4 py-3">
            <h3 className="text-white font-semibold text-sm">AI Course Access Login</h3>
            <p className="text-blue-200 text-xs mt-0.5">CSC center — complete the student's course access setup</p>
          </div>
          <div className="p-4 space-y-3 bg-blue-50">
            <div className="grid grid-cols-1 gap-3">
              {[
                ["AI Course Access Login", LMS_URL, true],
                ["Email (Login ID)", lmsEmail, false],
                ["Password", lmsPassword, false],
              ].map(([label, value, isLink]) => (
                <div key={label} className="bg-white rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  {isLink ? (
                    <a href={value} target="_blank" rel="noreferrer"
                      className="text-blue-600 font-semibold text-sm hover:underline break-all">
                      {value}
                    </a>
                  ) : (
                    <p className="font-mono text-sm font-bold text-gray-800 break-all">{value}</p>
                  )}
                </div>
              ))}
            </div>
            <a href={LMS_URL} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
              Open AI Course Access Login →
            </a>
          </div>
        </div>

        {/* ── Printable Slip ── */}
        <div id="print-slip" className="border-2 border-gray-200 rounded-xl p-6 bg-white text-sm">
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold text-blue-700">Yaticorp AI Card</h1>
            <p className="text-xs text-gray-500">Student Enrollment & Activation Confirmation</p>
          </div>

          {/* Center info */}
          <div className="mb-4 bg-blue-50 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500">CSC Center</p>
            <p className="font-semibold text-gray-800">{center?.name || "—"}</p>
            {center?.center_id && (
              <p className="text-xs font-mono text-blue-700 font-bold">{center.center_id}</p>
            )}
          </div>

          {/* Student + credentials table */}
          <table className="w-full text-sm border-collapse mb-4">
            <tbody>
              {[
                ["Student Name",      student.name],
                ["Email",             student.email],
                ["Phone / WhatsApp",  student.phone],
                ["Course",            student.course],
                ["Language",          student.language],
                ["AI Card No.",       cardNo],
                ["Enrollment Date",   dayjs().format("DD MMM YYYY")],
                ["─────────────────", "─────────────────────"],
                ["Course Access URL",  STUDENT_LMS_URL],
                ["Login Email",        lmsEmail],
                ["CVV",                cvv],
                ["Password",           lmsPassword],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-500 font-medium w-44 text-xs">{label}</td>
                  <td className="py-2 text-gray-800 font-semibold text-xs break-all">{value || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center text-xs text-gray-400 border-t pt-3">
            <p>This is a computer-generated enrollment slip. Keep this for your records.</p>
            <p>Support: contact@yaticorp.com</p>
          </div>
        </div>

        {/* Action buttons */}
        <button onClick={() => window.print()}
          className="no-print w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-900 transition">
          <Printer size={16} /> Print Slip (with Credentials)
        </button>
        <button onClick={() => window.location.reload()}
          className="no-print w-full py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
          + Enroll Another Student
        </button>
      </div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AddStudentPage() {
  const { user } = useAuth();
  const [step, setStep]           = useState(1);
  const [activated, setActivated] = useState(false);
  const [activatedPassword, setActivatedPassword] = useState("");

  // Step 1 — student info (collected locally, not saved yet)
  const [studentData, setStudentData] = useState(null);
  const { register: reg1, handleSubmit: hs1, formState: { errors: e1 } } = useForm();

  // Step 2 — card verify (mirrors website exactly)
  const [cardNo, setCardNo]           = useState("");
  const [cvv, setCvv]                 = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError]   = useState("");

  // Step 3 — activation (mirrors website exactly)
  const [form, setForm] = useState({
    language: "", course: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [activateLoading, setActivateLoading] = useState(false);
  const [activateError, setActivateError]   = useState("");
  const [passwordError, setPasswordError]   = useState("");
  const [confirmError, setConfirmError]     = useState("");

  // ── Step 1: just collect data locally, no API call yet ─────────────────────
  const onStep1Submit = async (data) => {
    setStudentData(data);
    setStep(2);
  };

  // ── Step 2: verify — exact same logic as website ────────────────────────────
  const verifyCard = async () => {
    setVerifyError("");
    setVerifyLoading(true);
    try {
      const { ok, data } = await aicardFetch("/aicard/verify", { cardNo, cvv });
      if (!ok) {
        setVerifyError(data.error || "Card verification failed");
        return;
      }
      toast.success("AI Card verified successfully");
      setStep(3);
    } catch {
      setVerifyError("Server error during verification");
    } finally {
      setVerifyLoading(false);
    }
  };

  // ── Step 3: form change — exact same logic as website ───────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "language") {
      setForm(f => ({ ...f, language: value, course: "" }));
      return;
    }
    if (name === "password") {
      setForm(f => ({ ...f, password: value }));
      setPasswordError(value.length < 9 ? "Password must be at least 9 characters" : "");
      if (form.confirmPassword && value !== form.confirmPassword) {
        setConfirmError("Passwords do not match");
      } else {
        setConfirmError("");
      }
      return;
    }
    if (name === "confirmPassword") {
      setForm(f => ({ ...f, confirmPassword: value }));
      setConfirmError(value !== form.password ? "Passwords do not match" : "");
      return;
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  // Activate button disabled logic — exact same as website
  const canActivate =
    !activateLoading &&
    form.language &&
    form.course &&
    form.password &&
    form.password.length >= 9 &&
    form.password === form.confirmPassword;

  // ── Step 3: activate — enroll student only after successful activation ───────
  const submitForm = async () => {
    setActivateError("");

    if (form.password.length < 9) {
      setActivateError("Password must be at least 9 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setActivateError("Passwords do not match");
      return;
    }

    setActivateLoading(true);
    try {
      // 1. Activate AI card (same as website)
      const { ok, data } = await aicardFetch("/aicard/activate", {
        cardNo,
        cvv,
        name: studentData.name,
        whatsapp: studentData.phone.replace(/\D/g, ""),
        course: form.course,
        language: form.language,
        password: form.password,
        source: "csc",
      });

      if (!ok) {
        setActivateError(data.error || data.message || "Activation failed");
        return;
      }

      // 2. Only after activation succeeds — save student to DB
      await api.post("/center/add-student", {
        name:     studentData.name,
        email:    studentData.email,
        phone:    studentData.phone,
        course:   form.course,
        language: form.language,
        card_no:  cardNo,
        cvv:      cvv,
        password: form.password,
      });

      toast.success("AI Card activated & student enrolled!");
      setActivatedPassword(form.password);
      setActivated(true);
    } catch (err) {
      setActivateError(err.response?.data?.message || "Server error during activation");
    } finally {
      setActivateLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add & Activate Student</h2>
          <p className="text-sm text-gray-500 mt-1">Enroll student and activate their AI Card</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {activated ? (
            <ActivationSuccess
              student={{ ...studentData, course: form.course, language: form.language, password: activatedPassword }}
              cardNo={cardNo}
              cvv={cvv}
              center={user?.center}
            />
          ) : (
            <>
              <StepIndicator current={step} />

              {/* ── STEP 1: Student Info ── */}
              {step === 1 && (
                <form onSubmit={hs1(onStep1Submit)} className="space-y-4">
                  {[
                    { name: "name",  label: "Full Name",        placeholder: "Student Name" },
                    { name: "email", label: "Email", type: "email", placeholder: "student@example.com" },
                    { name: "phone", label: "Phone / WhatsApp", placeholder: "+91 9876543210" },
                  ].map(({ name, label, type = "text", placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type={type}
                        {...reg1(name, { required: `${label} is required` })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder} />
                      {e1[name] && <p className="text-red-500 text-xs mt-1">{e1[name].message}</p>}
                    </div>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button type="button" disabled
                      className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-300 cursor-not-allowed">
                      ← Back
                    </button>
                    <button type="submit"
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                      Next →
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 2: Verify Card ── */}
              {step === 2 && (
                <Step2Verify
                  cardNo={cardNo} setCardNo={setCardNo}
                  cvv={cvv} setCvv={setCvv}
                  verifyError={verifyError} setVerifyError={setVerifyError}
                  verifyLoading={verifyLoading}
                  onBack={() => { setStep(1); setVerifyError(""); }}
                  onVerify={verifyCard}
                />
              )}

              {/* ── STEP 3: Activate Card ── */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Verified badge + card details — same as website */}
                  <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center gap-3">
                    <span className="text-green-500 text-lg">✔</span>
                    <div>
                      <p className="text-sm font-semibold text-green-700">AI Card verified successfully</p>
                      <p className="text-xs text-green-600">Now complete the activation details</p>
                    </div>
                  </div>

                  {/* Verified card details — same as website */}
                  <div className="grid grid-cols-2 gap-3">
                    {[["Card Number", cardNo], ["CVV", cvv]].map(([label, value]) => (
                      <div key={label} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="font-mono text-sm font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>

                  {activateError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                      {activateError}
                    </div>
                  )}

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select name="language" value={form.language} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Kannada">Kannada</option>
                    </select>
                  </div>

                  {/* Course — disabled until language selected, same as website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select name="course" value={form.course} onChange={handleChange}
                      disabled={!form.language}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400">
                      <option value="">{form.language ? "Choose your course..." : "Select language first"}</option>
                      {form.language && AI_COURSES[form.language].map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Password — same validation as website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password"
                        value={form.password} onChange={handleChange}
                        placeholder="Create password"
                        className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordError ? "border-red-400" : "border-gray-300"}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                  </div>

                  {/* Confirm Password — same validation as website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                        value={form.confirmPassword} onChange={handleChange}
                        placeholder="Confirm password"
                        className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${confirmError ? "border-red-400" : "border-gray-300"}`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {confirmError && <p className="text-red-500 text-xs mt-1">{confirmError}</p>}
                  </div>

                  {/* Nav — Back + Activate (disabled same as website) */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setStep(2); setActivateError(""); }}
                      className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
                      ← Back
                    </button>
                    <button onClick={submitForm} disabled={!canActivate}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                        canActivate
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-green-600/40 text-white cursor-not-allowed"
                      }`}>
                      {activateLoading ? "Activating..." : "🚀 Activate"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
