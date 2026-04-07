import React, { useEffect, useState } from "react";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/center/dashboard")
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500 text-sm">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Welcome, {user?.center?.owner_name || "Admin"}
        </h2>
        <p className="text-sm text-gray-500">{user?.center?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Students" value={data?.total_students} color="bg-blue-500" />
        <StatCard icon={BookOpen} label="Total Enrollments" value={data?.total_enrollments} color="bg-green-500" />
        <StatCard icon={TrendingUp} label="Courses Active" value={data?.course_wise?.length} color="bg-purple-500" />
      </div>

      {data?.course_wise?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Enrollments by Course</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.course_wise}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
