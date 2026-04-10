import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, ChevronDown, ChevronUp, Printer } from "lucide-react";
import dayjs from "dayjs";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STUDENT_LMS_URL = "https://learn.yaticorp.com/learn/account/signin";

// ─── Student Slip (printable) ─────────────────────────────────────────────────
function StudentSlip({ s, center }) {
  const lmsEmail = s.card_no ? `${s.card_no}@yaticorp.com` : "—";

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white text-sm space-y-3">
      <div className="text-center border-b pb-3">
        <h2 className="text-lg font-bold text-blue-700">Yaticorp AI Card</h2>
        <p className="text-xs text-gray-400">Student Enrollment & Activation Confirmation</p>
      </div>
      <div className="bg-blue-50 rounded-lg px-3 py-2">
        <p className="text-xs text-gray-500">CSC Center</p>
        <p className="font-semibold text-gray-800">{center?.name || "—"}</p>
        {center?.center_id && (
          <p className="text-xs font-mono text-blue-700 font-bold">{center.center_id}</p>
        )}
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {[
            ["Student Name",     s.name],
            ["Email",            s.email],
            ["Phone / WhatsApp", s.phone],
            ["Course",           s.course || "—"],
            ["Language",         s.language || "—"],
            ["AI Card No.",      s.card_no || "—"],
            ["CVV",              s.cvv || "—"],
            ["Enrolled On",      dayjs(s.createdAt).format("DD MMM YYYY")],
            ["────────────────", "────────────────────"],
            ["Course Access URL", STUDENT_LMS_URL],
            ["Login Email",      lmsEmail],
            ["Password",         s.password || "—"],
          ].map(([label, value]) => (
            <tr key={label} className="border-b border-gray-100">
              <td className="py-1.5 pr-3 text-gray-500 text-xs font-medium w-40">{label}</td>
              <td className="py-1.5 text-gray-800 font-semibold text-xs break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center text-xs text-gray-400 border-t pt-2">
        <p>Computer-generated slip. Support: contact@yaticorp.com</p>
      </div>
    </div>
  );
}

// ─── Student Row ──────────────────────────────────────────────────────────────
function StudentRow({ s, center }) {
  const [expanded, setExpanded] = useState(false);
  const slipRef = React.useRef(null);

  const handlePrint = () => {
    if (!slipRef.current) return;
    slipRef.current.classList.add("print-slip-active");
    window.print();
    slipRef.current.classList.remove("print-slip-active");
  };

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
        <td className="px-4 py-3 text-gray-600">{s.email}</td>
        <td className="px-4 py-3 text-gray-600">{s.phone}</td>
        <td className="px-4 py-3">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {s.course || "—"}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-400 text-xs">{dayjs(s.createdAt).format("DD MMM YYYY")}</td>
        <td className="px-4 py-3 text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className="px-4 pb-4 bg-gray-50">
            <div className="max-w-lg mx-auto pt-3 space-y-3">
              <div ref={slipRef}>
                <StudentSlip s={s} center={center} />
              </div>
              <button onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition">
                <Printer size={15} /> Print Slip
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/center/students")
      .then(res => setStudents(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print-slip-active, .print-slip-active * { visibility: visible !important; }
          .print-slip-active { position: fixed; inset: 0; padding: 32px; background: white; z-index: 9999; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Students</h2>
        <Link to="/add-student"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          <UserPlus size={16} /> Add Student
        </Link>
      </div>

      {/* Students table */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
          No students yet. Add your first student.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Enrolled</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(s => (
                <StudentRow key={s._id} s={s} center={user?.center} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
