import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

function PasswordField({ label, name, register: reg, rules, error, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...reg(name, rules)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/center/reset-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success("Password updated successfully!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <KeyRound size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-sm text-gray-500">Change your login password</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordField
            label="Current Password" name="current_password" register={register}
            rules={{ required: "Current password is required" }}
            error={errors.current_password} placeholder="••••••••"
          />
          <PasswordField
            label="New Password" name="new_password" register={register}
            rules={{ required: "New password is required", minLength: { value: 6, message: "Minimum 6 characters" } }}
            error={errors.new_password} placeholder="••••••••"
          />
          <PasswordField
            label="Confirm New Password" name="confirm_password" register={register}
            rules={{ required: "Please confirm your password", validate: v => v === watch("new_password") || "Passwords do not match" }}
            error={errors.confirm_password} placeholder="••••••••"
          />

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
