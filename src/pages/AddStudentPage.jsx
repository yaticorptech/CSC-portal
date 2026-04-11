import React, { useState, useEffect } from "react";
import { CheckCircle, Printer, User, BookOpen, ClipboardList } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = [
    { label: "Personal Details", icon: User },
    { label: "Course Selection", icon: BookOpen },
    { label: "Review & Confirm", icon: ClipboardList },
  ];
  return (
    <div className="flex items-center mb-8">
      {steps.map(({ label, icon: Icon }, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                {done ? <CheckCircle size={16} /> : <Icon size={16} />}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${active ? "text-blue-600 font-semibold" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 mb-4 rounded transition-colors ${current > num ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Admission Slip ────────────────────────────────────────────────────────────
function AdmissionSlip({ data, center }) {
  const slipRef = React.useRef(null);

  const handlePrint = () => {
    if (!slipRef.current) return;
    slipRef.current.classList.add("print-slip-active");
    window.print();
    slipRef.current.classList.remove("print-slip-active");
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print-slip-active, .print-slip-active * { visibility: visible !important; }
          .print-slip-active { position: fixed; inset: 0; padding: 32px; background: white; z-index: 9999; }
        }
      `}</style>

      <div className="space-y-4">
        {/* Success */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
          <CheckCircle size={18} className="text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-700">Admission Successful!</p>
            <p className="text-xs text-green-600">Admission No: <strong>{data.admission_no}</strong></p>
          </div>
        </div>

        {/* Slip */}
        <div ref={slipRef} className="border-2 border-gray-200 rounded-xl p-6 bg-white text-sm">
          {/* Header */}
          <div className="text-center border-b pb-4 mb-4">
            <h1 className="text-xl font-bold text-blue-700">Yaticorp AI Courses</h1>
            <p className="text-xs text-gray-500 mt-0.5">Student Admission Slip</p>
          </div>

          {/* Center */}
          <div className="bg-blue-50 rounded-lg px-4 py-2 mb-4">
            <p className="text-xs text-gray-500">CSC Center</p>
            <p className="font-semibold text-gray-800">{center?.name || "—"}</p>
            {center?.center_id && (
              <p className="text-xs font-mono text-blue-700 font-bold">{center.center_id}</p>
            )}
          </div>

          {/* Admission No */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 mb-4 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Admission Number</span>
            <span className="font-mono font-bold text-blue-700 text-base">{data.admission_no}</span>
          </div>

          {/* Details table */}
          <table className="w-full border-collapse mb-4">
            <tbody>
              {[
                ["Full Name",        data.name],
                ["Email",            data.email],
                ["Phone / WhatsApp", data.phone],
                ["Date of Birth",    data.dob || "—"],
                ["Gender",           data.gender || "—"],
                ["Address",          data.address || "—"],
                ["────────────────", "────────────────────"],
                ["Course",           data.course],
                ["Language",         data.language],
                ["Batch",            data.batch || "—"],
                ["Admission Date",   dayjs().format("DD MMM YYYY")],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-gray-100">
                  <td className="py-1.5 pr-3 text-gray-500 text-xs font-medium w-40">{label}</td>
                  <td className="py-1.5 text-gray-800 font-semibold text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center text-xs text-gray-400 border-t pt-3">
            <p>This is a computer-generated admission slip.</p>
            <p>Support: contact@yaticorp.com</p>
          </div>
        </div>

        {/* Buttons */}
        <button onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
          <Printer size={16} /> Print Admission Slip
        </button>
        <button onClick={() => window.location.reload()}
          className="w-full py-2.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
          + Admit Another Student
        </button>
      </div>
    </>
  );
}

// ─── Field component ───────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AddStudentPage() {
  const { user } = useAuth();
  const [step, setStep]         = useState(1);
  const [admitted, setAdmitted] = useState(false);
  const [admittedData, setAdmittedData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Fetch courses and batches from server
  const [courses, setCourses]             = useState([]);
  const [batches, setBatches]             = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data.data))
      .catch(() => setCourses([]))
      .finally(() => setCoursesLoading(false));

    api.get("/batches")
      .then(res => setBatches(res.data.data))
      .catch(() => setBatches([]));
  }, []);

  // Form state
  const [personal, setPersonal] = useState({
    name: "", email: "", phone: "", dob: "", gender: "", address: "",
  });
  const [course, setCourse] = useState({
    language: "", course: "", batch: "",
  });

  const setP = (k, v) => setPersonal(f => ({ ...f, [k]: v }));
  const setC = (k, v) => {
    if (k === "language") setCourse(f => ({ ...f, language: v, course: "" }));
    else setCourse(f => ({ ...f, [k]: v }));
  };

  // Validation
  const step1Valid = personal.name.trim() && personal.email.trim() && personal.phone.trim();
  const step2Valid = course.course;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/center/add-student", {
        ...personal,
        ...course,
      });
      setAdmittedData(res.data.data);
      setAdmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to admit student");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const navCls   = "flex gap-3 pt-4";

  return (
    <div className="min-h-full flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Student Admission</h2>
          <p className="text-sm text-gray-500 mt-1">Register a new student for AI courses</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {admitted ? (
            <AdmissionSlip data={admittedData} center={user?.center} />
          ) : (
            <>
              <StepIndicator current={step} />

              {/* ── STEP 1: Personal Details ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <Field label="Full Name" required>
                    <input value={personal.name} onChange={e => setP("name", e.target.value)}
                      placeholder="Student's full name" className={inputCls} />
                  </Field>
                  <Field label="Email" required>
                    <input type="email" value={personal.email} onChange={e => setP("email", e.target.value)}
                      placeholder="student@example.com" className={inputCls} />
                  </Field>
                  <Field label="Phone / WhatsApp" required>
                    <input value={personal.phone} onChange={e => setP("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile number" maxLength={10} className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date of Birth">
                      <input type="date" value={personal.dob} onChange={e => setP("dob", e.target.value)}
                        className={inputCls} />
                    </Field>
                    <Field label="Gender">
                      <select value={personal.gender} onChange={e => setP("gender", e.target.value)} className={inputCls}>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Address">
                    <textarea value={personal.address} onChange={e => setP("address", e.target.value)}
                      placeholder="Full address" rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </Field>

                  <div className={navCls}>
                    <button disabled className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-300 cursor-not-allowed">
                      ← Back
                    </button>
                    <button onClick={() => setStep(2)} disabled={!step1Valid}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Course Selection ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <Field label="Language" required>
                    <select value={course.language} onChange={e => setC("language", e.target.value)} className={inputCls}>
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Kannada">Kannada</option>
                    </select>
                  </Field>

                  <Field label="Course" required>
                    <select value={course.course} onChange={e => setC("course", e.target.value)}
                      disabled={coursesLoading} className={inputCls + " disabled:bg-gray-50 disabled:text-gray-400"}>
                      <option value="">{coursesLoading ? "Loading courses..." : courses.length === 0 ? "No courses available yet" : "Select a course"}</option>
                      {courses.map(c => (
                        <option key={c._id} value={c.title}>{c.title}{c.price > 0 ? ` — ₹${c.price}` : ""}</option>
                      ))}
                    </select>
                    {!coursesLoading && courses.length === 0 && (
                      <p className="text-xs text-yellow-600 mt-1">⚠️ No courses added yet. Contact the admin to add courses.</p>
                    )}
                  </Field>

                  <Field label="Batch">
                    <select value={course.batch} onChange={e => setC("batch", e.target.value)} className={inputCls}>
                      <option value="">{batches.length === 0 ? "No batches available" : "Select Batch (optional)"}</option>
                      {batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                    </select>
                  </Field>

                  <div className={navCls}>
                    <button onClick={() => setStep(1)}
                      className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
                      ← Back
                    </button>
                    <button onClick={() => setStep(3)} disabled={!step2Valid}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Review & Confirm ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Review Admission Details</p>

                  {/* Personal summary */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Personal</p>
                    {[
                      ["Name",    personal.name],
                      ["Email",   personal.email],
                      ["Phone",   personal.phone],
                      ["DOB",     personal.dob || "—"],
                      ["Gender",  personal.gender || "—"],
                      ["Address", personal.address || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-medium text-gray-800 text-right max-w-[60%]">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Course summary */}
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Course</p>
                    {[
                      ["Language", course.language],
                      ["Course",   course.course],
                      ["Batch",    course.batch || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-medium text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className={navCls}>
                    <button onClick={() => setStep(2)}
                      className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
                      ← Back
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                      className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60">
                      {loading ? "Admitting..." : "✅ Confirm Admission"}
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
