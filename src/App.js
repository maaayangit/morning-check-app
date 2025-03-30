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
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [mode, setMode] = useState("actual");
  const [planDate, setPlanDate] = useState("");
  const [planTime, setPlanTime] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleRecordLogin = () => {
    const JSTOffset = 9 * 60 * 60 * 1000;
    const now = new Date(Date.now() + JSTOffset);
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    fetch("https://fastapi-backend-dot2.onrender.com/record-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: today, login_time: currentTime }),
    })
      .then((res) => res.json())
      .then((res) => {
        setSuccessMessage(res.message || "実績を登録しました");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch(() => {
        setSuccessMessage("送信エラー");
        setTimeout(() => setSuccessMessage(""), 3000);
      });
  };

  const handlePlanTimeChange = (value) => {
    setPlanTime(value);
    setValidationError("");

    if (planDate && value) {
      fetch(`https://fastapi-backend-dot2.onrender.com/get-work-code?date=${planDate}`)
        .then((res) => res.json())
        .then((data) => {
          const workCode = data.work_code;
          const planMinutes = parseInt(value.split(":")[0]) * 60 + parseInt(value.split(":")[1]);
          let limitMinutes = null;

          if (workCode === "★07A") limitMinutes = 7 * 60;
          if (workCode === "★11A") limitMinutes = 11 * 60;

          if (limitMinutes !== null && planMinutes >= limitMinutes) {
            setValidationError(`勤務指定(${workCode})より遅い時刻は登録できません。`);
          }
        });
    }
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
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setMode("actual")}
            className={`px-4 py-2 rounded font-semibold ${mode === "actual" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            実績入力
          </button>
          <button
            onClick={() => setMode("plan")}
            className={`px-4 py-2 rounded font-semibold ${mode === "plan" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            計画入力
          </button>
        </div>

        {mode === "actual" && (
          <div className="text-center">
            <button
              onClick={handleRecordLogin}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded"
            >
              🎯 今日のログイン実績を記録する
            </button>
            {successMessage && (
              <p className="mt-4 text-green-600 font-medium">{successMessage}</p>
            )}
          </div>
        )}

        {mode === "plan" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">📝 ログイン計画入力</h2>
            <div className="space-y-2">
              <label className="block font-semibold">対象日を選択（翌日以降のみ）:</label>
              <input
                type="date"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
                className="border rounded px-2 py-1"
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">出勤予定時刻を入力:</label>
              <input
                type="time"
                value={planTime}
                onChange={(e) => handlePlanTimeChange(e.target.value)}
                className="border rounded px-2 py-1"
              />
              {validationError && (
                <p className="text-red-600 text-sm font-medium">{validationError}</p>
              )}
            </div>
          </div>
        )}
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
