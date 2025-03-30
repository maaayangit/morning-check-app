import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import ScheduleList from "./ScheduleList";
import MissedLogins from "./MissedLogins";

function App() {
  const [selectedDate, setSelectedDate] = useState(""); // 📅 日付の状態を追加

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      {/* 🔰 タイトルと説明 */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <span>📊 勤怠支援アプリ</span>
          <span className="text-gray-500 text-base">管理者用ダッシュボード</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          勤務予定CSVをアップロードしてください。日付ごとの勤務状況を確認できます。
        </p>
      </div>

      {/* 📂 CSVアップロードと📅 日付選択 */}
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

      {/* 📋 勤務予定一覧 & 🚨 未ログイン者一覧（2カラムで並べる） */}
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

export default App;
