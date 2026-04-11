import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus, ChevronDown, ChevronUp, Printer, Users, Search,
  Trash2, X, Download, CreditCard, Filter
} from "lucide-react";
import dayjs from "dayjs";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

const PAGE_SIZE = 10;

// ─── Admission Slip ────────────────────────────────────────────────────────────
function AdmissionSlip({ s, center }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white text-sm space-y-3">
      <div className="text-center border-b pb-3">
        <h2 className="text-base font-bold text-blue-700">Yaticorp AI Courses</h2>
        <p className="text-xs text-gray-400">Student Admission Slip</p>
      </div>
      <div className="bg-blue-50 rounded-lg px-3 py-2">
        <p className="text-xs text-gray-500">CSC Center</p>
        <p className="font-semibold text-gray-800 text-sm">{center?.name || "—"}</p>
        {center?.center_id && <p className="text-xs font-mono text-blue-700 font-bold">{center.center_id}</p>}
      </div>
      {s.admission_no && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Admission No.</span>
          <span className="font-mono font-bold text-blue-700 text-sm">{s.admission_no}</span>
        </div>
      )}
      <table className="w-full border-collapse">
        <tbody>
          {[
            ["Full Name", s.name], ["Email", s.email], ["Phone", s.phone],
            ["Date of Birth", s.dob || "—"], ["Gender", s.gender || "—"],
            ["Address", s.address || "—"],
            ["────────────", "────────────────────"],
            ["Course", s.course || "—"], ["Language", s.language || "—"],
            ["Batch", s.batch || "—"],
            ["Admission Date", dayjs(s.createdAt).format("DD MMM YYYY")],
          ].map(([label, value]) => (
            <tr key={label} className="border-b border-gray-100">
              <td className="py-1.5 pr-3 text-gray-400 text-xs w-36">{label}</td>
              <td className="py-1.5 text-gray-800 font-semibold text-xs break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-center text-xs text-gray-400 border-t pt-2">
        Computer-generated slip · contact@yaticorp.com
      </p>
    </div>
  );
}

// ─── Student ID Card ───────────────────────────────────────────────────────────
function IDCard({ s, center }) {
  return (
    <div className="border-2 border-blue-600 rounded-2xl overflow-hidden bg-white w-72 shadow-lg">
      <div className="bg-blue-600 px-4 py-3 text-white text-center">
        <p className="text-xs font-semibold opacity-80">Yaticorp AI Courses</p>
        <p className="text-xs opacity-60">{center?.name}</p>
      </div>
      <div className="p-4 space-y-2">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-bold text-blue-600">{s.name?.[0]?.toUpperCase()}</span>
        </div>
        <p className="text-center font-bold text-gray-800">{s.name}</p>
        <p className="text-center text-xs text-gray-500">{s.course || "—"}</p>
        <div className="border-t pt-2 space-y-1">
          {[
            ["ID", s.admission_no || "—"],
            ["Phone", s.phone],
            ["Batch", s.batch || "—"],
            ["Language", s.language || "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-gray-400">{k}</span>
              <span className="font-medium text-gray-700">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 text-center">
        <p className="text-xs text-gray-400">Issued: {dayjs(s.createdAt).format("DD MMM YYYY")}</p>
      </div>
    </div>
  );
}

// ─── Student Row ──────────────────────────────────────────────────────────────
function StudentRow({ s, center, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [view, setView]         = useState("slip");
  const slipRef = useRef(null);
  const idRef   = useRef(null);

  const handlePrint = (e, ref) => {
    e.stopPropagation();
    if (!ref.current) return;
    ref.current.classList.add("print-slip-active");
    window.print();
    ref.current.classList.remove("print-slip-active");
  };

  return (
    <>
      <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setExpanded(e => !e)}>
        <td className="px-5 py-3.5">
          <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
          {s.admission_no && <p className="text-xs font-mono text-blue-500 mt-0.5">{s.admission_no}</p>}
        </td>
        <td className="px-5 py-3.5 text-gray-500 text-sm">{s.phone}</td>
        <td className="px-5 py-3.5">
          {s.course ? <span className="badge bg-blue-100 text-blue-700">{s.course}</span>
            : <span className="text-gray-300 text-xs">—</span>}
        </td>
        <td className="px-5 py-3.5 text-gray-400 text-xs">{s.batch || "—"}</td>
        <td className="px-5 py-3.5 text-gray-400 text-xs">{dayjs(s.createdAt).format("DD MMM YYYY")}</td>
        <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onDelete(s._id)}
              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
              <Trash2 size={13} />
            </button>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer
              ${expanded ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
              onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className="px-5 pb-5 bg-slate-50 border-b border-gray-100">
            <div className="pt-4 space-y-3 max-w-md">
              <div className="flex rounded-xl border border-gray-200 overflow-hidden w-fit">
                {[["slip","Admission Slip"],["id","ID Card"]].map(([v,l]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-4 py-1.5 text-xs font-semibold transition
                      ${view === v ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                    {l}
                  </button>
                ))}
              </div>
              {view === "slip" ? (
                <>
                  <div ref={slipRef}><AdmissionSlip s={s} center={center} /></div>
                  <button onClick={e => handlePrint(e, slipRef)}
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-900 transition">
                    <Printer size={14} /> Print Slip
                  </button>
                </>
              ) : (
                <>
                  <div ref={idRef}><IDCard s={s} center={center} /></div>
                  <button onClick={e => handlePrint(e, idRef)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                    <CreditCard size={14} /> Print ID Card
                  </button>
                </>
              )}
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
  const [courses, setCourses]   = useState([]);
  const [batches, setBatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterBatch, setFilterBatch]   = useState("");
  const [filterDate, setFilterDate]     = useState("");
  const [showFilters, setShowFilters]   = useState(false);
  const [page, setPage]         = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      api.get("/center/students"),
      api.get("/courses"),
      api.get("/batches"),
    ]).then(([s, c, b]) => {
      setStudents(s.data.data);
      setCourses(c.data.data);
      setBatches(b.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/center/students/${id}`);
      setDeleteId(null);
      fetchAll();
    } catch { alert("Delete failed"); }
  };

  const exportCSV = () => {
    const headers = ["Admission No","Name","Email","Phone","DOB","Gender","Address","Course","Language","Batch","Admitted On"];
    const rows = filtered.map(s => [
      s.admission_no, s.name, s.email, s.phone,
      s.dob, s.gender, s.address,
      s.course, s.language, s.batch,
      dayjs(s.createdAt).format("DD MMM YYYY"),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `students_${dayjs().format("YYYYMMDD")}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.admission_no || "").toLowerCase().includes(q);
    const matchCourse = !filterCourse || s.course === filterCourse;
    const matchBatch  = !filterBatch  || s.batch  === filterBatch;
    const matchDate   = !filterDate   || dayjs(s.createdAt).format("YYYY-MM-DD") === filterDate;
    return matchSearch && matchCourse && matchBatch && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetFilters = () => { setFilterCourse(""); setFilterBatch(""); setFilterDate(""); setSearch(""); setPage(1); };

  return (
    <div className="space-y-5 w-full">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print-slip-active, .print-slip-active * { visibility: visible !important; }
          .print-slip-active { position: fixed; inset: 0; padding: 32px; background: white; z-index: 9999; }
        }
      `}</style>

      {deleteId && (
        <ConfirmModal
          title="Delete Student"
          message="This will permanently remove the student record. This action cannot be undone."
          confirmLabel="Yes, Delete"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Students</h2>
          <p className="text-sm text-gray-400 mt-0.5">{students.length} total · {filtered.length} shown</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Download size={15} /> Export CSV
          </button>
          <Link to="/add-student"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            <UserPlus size={16} /> Admit Student
          </Link>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, phone, admission no..."
            className="input pl-9 py-2" />
        </div>
        <button onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition
            ${showFilters ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          <Filter size={14} /> Filters
          {(filterCourse || filterBatch || filterDate) && <span className="w-2 h-2 rounded-full bg-red-400" />}
        </button>
        {(filterCourse || filterBatch || filterDate || search) && (
          <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Course</label>
            <select value={filterCourse} onChange={e => { setFilterCourse(e.target.value); setPage(1); }} className="input">
              <option value="">All Courses</option>
              {courses.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Batch</label>
            <select value={filterBatch} onChange={e => { setFilterBatch(e.target.value); setPage(1); }} className="input">
              <option value="">All Batches</option>
              {batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Admission Date</label>
            <input type="date" value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1); }} className="input" />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Users size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-400">No students found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50">
                  {["Student","Phone","Course","Batch","Admitted",""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(s => (
                  <StudentRow key={s._id} s={s} center={user?.center} onDelete={setDeleteId} />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition
                      ${page === p ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
