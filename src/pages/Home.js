// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">🌞 朝の出勤チェック</h1>
        <p className="text-sm text-gray-500">出勤予定や実績を記録・確認できます。</p>

        <div className="space-y-3">
          <Link
            to="/staff"
            className="block w-full text-center bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
          >
            担当者としてログイン
          </Link>
          <Link
            to="/admin"
            className="block w-full text-center bg-gray-800 text-white font-medium py-2 rounded-md hover:bg-gray-900 transition"
          >
            管理者としてログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
