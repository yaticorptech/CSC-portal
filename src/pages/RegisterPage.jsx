import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Building2, Download, CheckCircle } from "lucide-react";
import api from "../api/axios";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreementUrl, setAgreementUrl] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch master agreement URL (public endpoint)
    axios.get(`${import.meta.env.VITE_API_BASE}/agreement`)
      .then(res => setAgreementUrl(res.data.url))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    if (!data.agreement?.[0])
      return toast.error("Please upload the signed agreement PDF");

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === "agreement") formData.append("agreement", v[0]);
        else formData.append(k, v);
      });
      await api.post("/centers/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registration submitted! We'll review and contact you.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full mb-3">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Register CSC Center</h1>
          <p className="text-sm text-gray-500 mt-1">Partner with us to offer AI courses</p>
        </div>

        {/* Step 1 — Download agreement */}
        <div className={`mb-5 p-4 rounded-xl border-2 ${downloaded ? "border-green-400 bg-green-50" : "border-blue-300 bg-blue-50"}`}>
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            {downloaded
              ? <><CheckCircle size={16} className="text-green-600"/> Step 1 — Agreement Downloaded</>
              : <>Step 1 — Download & Sign the Agreement</>}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Download the agreement, print it, sign it, scan it as PDF, then upload below.
          </p>
          {agreementUrl ? (
            <a href={agreementUrl} target="_blank" rel="noreferrer"
              onClick={() => setDownloaded(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              <Download size={15}/> Download Agreement PDF
            </a>
          ) : (
            <p className="text-xs text-yellow-600">⚠️ No agreement available yet. Contact the company.</p>
          )}
        </div>

        {/* Step 2 — Fill form */}
        <p className="text-sm font-semibold text-gray-700 mb-3">Step 2 — Fill Registration Details</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "name", label: "Center Name", placeholder: "ABC CSC Center" },
            { name: "owner_name", label: "Owner Name", placeholder: "John Doe" },
            { name: "email", label: "Email", type: "email", placeholder: "center@example.com" },
            { name: "phone", label: "Phone", placeholder: "+91 9876543210" },
            { name: "address", label: "Address", placeholder: "123 Main St, City" },
          ].map(({ name, label, type = "text", placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type}
                {...register(name, { required: `${label} is required` })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Signed Agreement <span className="text-red-500">*</span>
            </label>
            <input type="file" accept=".pdf"
              {...register("agreement", { required: "Signed agreement is required" })}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.agreement && <p className="text-red-500 text-xs mt-1">{errors.agreement.message}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
}
