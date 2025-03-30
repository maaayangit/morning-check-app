import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import ScheduleList from "./ScheduleList";
import MissedLogins from "./MissedLogins";

function App() {
  const [selectedDate, setSelectedDate] = useState(""); // 📅 日付の状態を追加

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <h1 className="text-2xl font-bold">📅 勤怠管理ダッシュボード</h1>

      {/* アップロードは共通なので最上部 */}
      <AdminDashboard />

      {/* 📅 日付選択 UI（全コンポーネント共通） */}
      <div className="mb-4">
        <label className="font-semibold mr-2">表示する日付を選択:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* 📋 勤務予定一覧（選択された日付に基づく） */}
      <ScheduleList selectedDate={selectedDate} />

      {/* 🚨 未ログイン・遅刻者一覧（選択された日付に基づく） */}
      <MissedLogins selectedDate={selectedDate} />
    </div>
  );
}

export default App;

