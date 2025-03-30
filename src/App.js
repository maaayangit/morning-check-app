import React from "react";
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
  const [selectedDate, setSelectedDate] = React.useState("");
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
  const navigate = useNavigate();

  // 実績入力関数（仮実装）
  const handleRecordLogin = () => {
    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    fetch("https://fastapi-backend-dot2.onrender.com/record-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, login_time: currentTime }),
    })
      .then((res) => res.json())
      .then((res) => alert(res.message || "実績を登録しました"))
      .catch((err) => alert("送信エラー"));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <Helmet><title>勤怠支援アプリ - 担当者</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <span>📊 勤怠支援アプリ</span>
            <span className="text-gray-500 text-base">担当者用ダッシュボード</span>
          </h1>
          <p className="text-sm text-gray-600">
            担当者は翌日以降の計画、または当日の実績を入力できます。
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 text-sm text-black px-4 py-1 rounded"
        >
          ホームに戻る
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4 space-y-6">
        <StaffDashboard />

        {/* 実績入力ボタン */}
        <div className="text-center">
          <button
            onClick={handleRecordLogin}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
          >
            🎯 今日のログイン実績を記録する
          </button>
        </div>
      </div>
    </div>
  );
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