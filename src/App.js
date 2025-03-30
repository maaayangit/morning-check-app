import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import ScheduleList from "./ScheduleList";
import MissedLogins from "./MissedLogins";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-10 space-y-6">
      <Helmet><title>勤怠支援アプリ</title></Helmet>
      <h1 className="text-2xl font-bold">📊 勤怠支援アプリ</h1>
      <p className="text-gray-600">ご自身の役割を選択してください。</p>

      <div className="space-x-4">
        <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded">
          管理者としてログイン
        </Link>
        <Link to="/staff" className="bg-green-500 text-white px-4 py-2 rounded">
          担当者としてログイン
        </Link>
      </div>
    </div>
  );
}

function AdminPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <Helmet><title>勤怠支援アプリ - 管理者</title></Helmet>
      <div className="flex justify-between items-center">
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
          className="bg-gray-300 text-sm text-black px-4 py-1 rounded"
        >
          ホームに戻る
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4 space-y-4">
        <AdminDashboard />

        <div className="ml-4">
          <label className="font-semibold mr-2">一覧で表示する日付を選択:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <ScheduleList selectedDate={selectedDate} />
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <MissedLogins selectedDate={selectedDate} />
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