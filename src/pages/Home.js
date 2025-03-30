// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 w-full max-w-md text-center space-y-6">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">勤怠支援アプリ</h1>
        <p className="text-sm text-gray-500">出勤予定や実績を記録・確認できます。</p>

        <div className="space-y-3">
          <Link
            to="/staff"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md transition"
          >
            担当者としてログイン
          </Link>
          <Link
            to="/admin"
            className="block w-full text-center bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2.5 rounded-md transition"
          >
            管理者としてログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
