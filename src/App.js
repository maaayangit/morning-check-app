import React from "react";
import AdminDashboard from "./AdminDashboard";
import ScheduleList from "./ScheduleList";
import MissedLogins from "./MissedLogins"; // ← 忘れずに！

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <AdminDashboard />
      <ScheduleList />
      <MissedLogins />  {/* 🚨 ここにチェック結果が表示されます */}
    </div>
  );
}

export default App;
