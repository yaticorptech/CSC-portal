import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-xl font-bold">CC</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CSC Center Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your partner dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input type="email"
                {...register("email", { required: "Email is required" })}
                className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Not registered?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register your center
          </Link>
        </p>
      </div>
      </div>
      <Footer />
    </div>
  );
}
