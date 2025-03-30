// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import ScheduleList from "./ScheduleList";
import MissedLoginList from "./MissedLoginList";
import Home from "./pages/Home";

function AdminPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <Helmet><title>勤怠支援アプリ - 管理者</title></Helmet>

      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <span>📊 勤怠支援アプリ</span>
            <span className="text-gray-500 text-base">管理者用ダッシュボード</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            勤務予定CSVをアップロードしてください。日付ごとの勤務状況を確認できます。
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 hover:bg-gray-400 text-sm text-black px-4 py-1 rounded transition"
        >
          ホームに戻る
        </button>
      </div>

      {/* メインボード */}
      <div className="bg-white shadow rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">🛠️ 管理者用ダッシュボード</h2>
        <AdminDashboard />
      </div>

      {/* 日付選択と一覧 */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <label className="font-semibold">📅 一覧で表示する日付を選択:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div>
            <h3 className="text-md font-semibold mb-2">📋 勤務予定一覧</h3>
            <div className="bg-gray-50 border rounded-xl p-3">
              <ScheduleList selectedDate={selectedDate} />
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">🚨 未ログイン・遅刻者一覧</h3>
            <div className="bg-gray-50 border rounded-xl p-3">
              <MissedLoginList selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffPage() {
  return <StaffDashboard />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </Router>
  );
}

export default App;
