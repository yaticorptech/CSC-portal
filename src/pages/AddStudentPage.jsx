import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import api from "../api/axios";

const AI_COURSES = [
  "Student AI Course",
  "Parents AI Course",
  "Compete AI Course",
  "Business AI Course",
  "Professional AI Course",
  "Educate/Teacher AI Course",
  "Trainers AI Course",
  "Marketing AI Course",
  "Sales AI Course",
  "Agriculture AI Course",
  "Finance/Accounts AI Course",
  "Investment AI Course",
  "Employees AI Course",
  "Entertainment AI Course",
  "Journalists AI Course",
  "Logistics AI Course",
  "Content Creators AI Course",
  "Supply Chain AI Course",
  "Entrepreneurs AI Course",
  "Startups/Founders AI Course",
  "Entrepreneur/Startup AI Course",
  "Healthcare AI Course",
  "Photographers AI Course",
  "Lawyers AI Course",
  "Designers AI Course",
  "Government Employees AI Course",
  "Construction AI Course",
  "Real Estates AI Course",
  "Social Media AI Course",
  "Cybersecurity AI Course",
  "Civil Engineers AI Course",
  "Human Resource AI Course",
  "Hospitality/Tourism AI Course",
  "House wife AI Course",
];

export default function AddStudentPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/center/add-student", data);
      toast.success("Student enrolled! Redirecting to AI Card Activation...");
      reset();
      setTimeout(() => {
        window.location.href = res.data.redirect_url;
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <UserPlus size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add Student</h2>
          <p className="text-sm text-gray-500">Enroll a student — they'll be redirected to AI Card Activation</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "name", label: "Full Name", placeholder: "Student Name" },
            { name: "email", label: "Email", type: "email", placeholder: "student@example.com" },
            { name: "phone", label: "Phone", placeholder: "+91 9876543210" },
          ].map(({ name, label, type = "text", placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                {...register(name, { required: `${label} is required` })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              {...register("course", { required: "Please select a course" })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {AI_COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Enrolling & Redirecting..." : "Enroll Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
