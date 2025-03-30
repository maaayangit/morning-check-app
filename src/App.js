// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import ScheduleList from "./ScheduleList";
import MissedLoginList from "./MissedLoginList";
import Home from "./pages/Home";

function getTodayJST() {
  const jstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
  return jstDate.toISOString().slice(0, 10); // YYYY-MM-DD
}

function AdminPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  const today = getTodayJST();

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <Helmet>
        <title>勤怠支援アプリ - 管理者</title>
      </Helmet>

      <div className="flex justify-between items-start flex-wrap gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <span>📊 勤怠支援アプリ</span>
            <span className="text-gray-500 text-base">管理者用ダッシュボード</span>
          </h1>
          <p className="text-sm text-gray-600">
            勤務予定CSVをアップロードしてください。日付ごとの勤務状況を確認できます。
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 text-sm text-black px-4 py-1 rounded"
        >
          ホームに戻る
        </button>
      </div>

      {/* 管理者機能全体を渡す */}
      <AdminDashboard today={today} />

      {/* 一覧表示日付の選択と結果表示 */}
      <div className="bg-white shadow rounded-xl p-4 space-y-4">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-semibold">📅 一覧表示する日付を選択:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-bold mb-2">📋 勤務予定一覧</h2>
            <ScheduleList selectedDate={selectedDate} />
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-bold mb-2">🚨 未ログイン・遅刻者一覧（{selectedDate || "未選択"}）</h2>
            <MissedLoginList selectedDate={selectedDate} />
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
