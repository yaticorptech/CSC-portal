import React, { useEffect, useState } from "react";
import {
  Users, BookOpen, TrendingUp, ArrowUpRight,
  IndianRupee, Award, Clock
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16"];

const statCards = [
  { key: "total_students",   label: "Total Students",  icon: Users,     light: "bg-blue-50 text-blue-600" },
  { key: "total_enrollments",label: "Total Admissions", icon: BookOpen,  light: "bg-violet-50 text-violet-600" },
  { key: "course_wise_len",  label: "Active Courses",  icon: TrendingUp, light: "bg-emerald-50 text-emerald-600" },
];

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" },
  cursor: { fill: "#f1f5f9" },
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return { text: "Good Morning", emoji: "🌅", sub: "Start your day by admitting new students to AI courses." };
    if (h < 17) return { text: "Good Afternoon", emoji: "☀️", sub: "Keep the momentum going — your center is making a difference." };
    return { text: "Good Evening", emoji: "🌙", sub: "Great work today. Review your admissions and wrap up strong." };
  };
  const greeting = getGreeting();

  useEffect(() => {
    api.get("/center/dashboard")
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const values = {
    total_students:    data?.total_students,
    total_enrollments: data?.total_enrollments,
    course_wise_len:   data?.course_wise?.length,
  };

  const totalEarnings = (data?.total_students ?? 0) * 499;

  return (
    <div className="space-y-6 w-full">

      {/* Welcome banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">{greeting.text} {greeting.emoji}</p>
            <h2 className="text-2xl font-bold">{user?.center?.owner_name || "Admin"}</h2>
            <p className="text-blue-300 text-sm mt-1 max-w-sm">{greeting.sub}</p>
            {user?.center?.center_id && (
              <span className="inline-block mt-3 text-xs font-mono bg-white/20 px-3 py-1 rounded-lg tracking-wider">
                {user.center.center_id} · {user?.center?.name}
              </span>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-4 text-center min-w-[120px]">
            <p className="text-3xl font-bold">{data?.total_students ?? "—"}</p>
            <p className="text-blue-200 text-xs mt-1">Total Students</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, light }) => (
          <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${light}`}><Icon size={22} /></div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-0.5">{values[key] ?? "—"}</p>
            </div>
            <ArrowUpRight size={16} className="text-gray-300" />
          </div>
        ))}
      </div>

      {/* Earning tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600"><IndianRupee size={22} /></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">₹{totalEarnings.toLocaleString("en-IN")}</p>
            <p className="text-xs text-emerald-600 mt-0.5">₹499 × {data?.total_students ?? 0} students</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-600"><Award size={22} /></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Active Batches</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">{data?.batch_wise?.length ?? "—"}</p>
            <p className="text-xs text-amber-600 mt-0.5">Running batches</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><Clock size={22} /></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Avg. per Student</p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">₹499</p>
            <p className="text-xs text-blue-600 mt-0.5">Per AI course admission</p>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Admissions over time — Area chart */}
        <ChartCard title="Admissions Over Time" subtitle="Last 30 days">
          {data?.admissions_by_day?.some(d => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.admissions_by_day}>
                <defs>
                  <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#admGrad)" name="Admissions" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">No admissions in last 30 days</div>
          )}
        </ChartCard>

        {/* Earnings over time — Line chart */}
        <ChartCard title="Earnings Over Time" subtitle="Last 30 days (₹499/student)">
          {data?.earnings_by_day?.some(d => d.earnings > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.earnings_by_day}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v}`} />
                <Tooltip {...tooltipStyle} formatter={v => [`₹${v}`, "Earnings"]} />
                <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2.5}
                  dot={false} activeDot={{ r: 5 }} name="Earnings" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">No earnings data yet</div>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Students per course — Bar chart */}
        <ChartCard title="Students by Course" subtitle="Admissions per course">
          {data?.course_wise?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.course_wise} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="course" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">No course data yet</div>
          )}
        </ChartCard>

        {/* Students per batch — Pie chart */}
        <ChartCard title="Students by Batch" subtitle="Distribution across batches">
          {data?.batch_wise?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.batch_wise} dataKey="count" nameKey="batch"
                  cx="50%" cy="50%" outerRadius={75} innerRadius={40}
                  paddingAngle={3} label={({ batch, percent }) => `${batch} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {data.batch_wise.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-300 text-sm">No batch data yet</div>
          )}
        </ChartCard>
      </div>

    </div>
  );
}
