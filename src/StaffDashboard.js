// StaffDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const [mode, setMode] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlanDate, setSelectedPlanDate] = useState("");
  const [expectedTime, setExpectedTime] = useState("00:00");
  const [workCode, setWorkCode] = useState("");
  const navigate = useNavigate();

  // 📌 勤務指定 → 出勤指定時刻マスター（仮にフロントに定義）
  const workCodeMaster = {
    "★07A": "07:00",
    "★08A": "08:00",
    "★11A": "11:00",
  };

  // ✅ 実績登録送信
  const handleActualLogin = async () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);

    const payload = {
      user_id: 1, // FIXME: ログインユーザーIDに差し替え
      date: today,
      login_time: time,
    };

    const res = await fetch("https://fastapi-backend-dot2.onrender.com/update-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setMessage(result.message || "出勤記録を登録しました");
  };

  // ✅ 計画登録送信
  const handlePlanSubmit = async () => {
    if (!selectedPlanDate || !expectedTime) {
      setMessage("⛔ 日付と出勤予定時刻を入力してください");
      return;
    }

    const requiredTime = workCodeMaster[workCode];
    if (requiredTime && expectedTime > requiredTime) {
      setMessage(`⛔ 勤務指定 (${workCode}) の ${requiredTime} より遅い出勤は登録できません`);
      return;
    }

    const payload = {
      user_id: 1,
      date: selectedPlanDate,
      expected_login_time: expectedTime,
    };

    const res = await fetch("https://fastapi-backend-dot2.onrender.com/update-expected-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setMessage(result.message || "出勤予定を登録しました");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">📊 勤怠支援アプリ</h1>
            <span className="text-gray-500 text-base">担当者用ダッシュボード</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 text-sm text-black px-4 py-1 rounded"
          >
            ホームに戻る
          </button>
        </div>

        {/* モード切り替え */}
        <div className="flex flex-wrap gap-4 mt-2">
          <button
            onClick={() => setMode("actual")}
            className={`px-4 py-2 rounded font-semibold ${
              mode === "actual" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            実績登録
          </button>
          <button
            onClick={() => setMode("plan")}
            className={`px-4 py-2 rounded font-semibold ${
              mode === "plan" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            計画登録
          </button>
        </div>

        {/* 実績登録 */}
        {mode === "actual" && (
          <div className="mt-6 space-y-4">
            <p className="font-semibold text-gray-700">🎯 本日の出勤実績を記録:</p>
            <button
              onClick={handleActualLogin}
              className="bg-green-600 text-white px-6 py-2 rounded shadow"
            >
              🎯 出勤ボタン
            </button>
            {message && <p className="text-green-700 font-semibold mt-2">{message}</p>}
          </div>
        )}

        {/* 計画登録 */}
        {mode === "plan" && (
          <div className="mt-6 space-y-4">
            <p className="font-semibold text-gray-700">📝 出勤予定の登録:</p>

            <div>
              <label className="block text-sm font-medium mb-1">📅 出勤日を選択（明日以降）</label>
              <input
                type="date"
                value={selectedPlanDate}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                onChange={(e) => setSelectedPlanDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">⏰ 出勤予定時刻</label>
              <input
                type="time"
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">💼 勤務指定（任意）</label>
              <select
                value={workCode}
                onChange={(e) => setWorkCode(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">選択してください</option>
                {Object.entries(workCodeMaster).map(([code, time]) => (
                  <option key={code} value={code}>
                    {code}（{time}）
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePlanSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow"
            >
              📝 出勤予定を登録する
            </button>

            {message && <p className="text-green-700 font-semibold mt-2">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
