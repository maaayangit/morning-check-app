// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">🌞 朝の出勤チェック</h1>
        <p className="text-gray-600">出勤予定や実績を記録・確認できます。</p>

        <div className="flex flex-col space-y-4">
          <Link
            to="/staff"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded shadow"
          >
            担当者としてログイン
          </Link>
          <Link
            to="/admin"
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded shadow"
          >
            管理者としてログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
