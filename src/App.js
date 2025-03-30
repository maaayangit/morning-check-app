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
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <Helmet>
        <title>勤怠支援アプリ - 管理者</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 勤怠支援アプリ</h1>
          <p className="text-gray-500 text-sm">管理者用ダッシュボード</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 text-sm text-black px-4 py-2 rounded shadow"
        >
          ホームに戻る
        </button>
      </div>

      <AdminDashboard />

      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <label className="font-semibold">📅 一覧表示する日付を選択:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 border rounded p-4 shadow">
            <ScheduleList selectedDate={selectedDate} />
          </div>
          <div className="bg-gray-50 border rounded p-4 shadow">
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
