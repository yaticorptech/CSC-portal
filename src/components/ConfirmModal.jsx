import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ title, message, confirmLabel = "Delete", confirmClass = "bg-red-600 hover:bg-red-700", onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-start gap-4 p-6">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-100 transition shrink-0">
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition ${confirmClass}`}>
            {confirmLabel}
          </button>
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
