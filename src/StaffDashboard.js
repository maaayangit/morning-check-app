import React, { useState } from "react";

export default function StaffDashboard() {
  const [mode, setMode] = useState("actual"); // "actual" or "plan"
  const [selectedDate, setSelectedDate] = useState("");
  const [actualLoginTime, setActualLoginTime] = useState("");
  const [message, setMessage] = useState("");

  // 🎯 出勤ボタン（＝当日の実績登録）
  const handleActualLogin = async () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);

    const payload = {
      user_id: 1, // FIXME: 本来はログインユーザーに差し替える
      date: today,
      login_time: time,
    };

    const res = await fetch("https://fastapi-backend-dot2.onrender.com/update-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setMessage(result.message || "記録しました");
  };

  // ⏰ 手入力で実績登録（既存機能）
  const handleSubmit = () => {
    if (!selectedDate || !actualLoginTime) {
      setMessage("⛔ 日付と実績ログイン時刻を入力してください。");
      return;
    }

    // 仮：メッセージのみ
    setMessage(`✅ ${selectedDate} のログイン実績 (${actualLoginTime}) を登録しました。`);
    setActualLoginTime("");
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-bold flex items-center space-x-2">
        <span>🧑‍💼 勤怠支援アプリ</span>
        <span className="text-gray-500 text-base">担当者用ダッシュボード</span>
      </h2>
      <p className="text-sm text-gray-600">
        担当者は「計画」または「実績」を入力できます。
      </p>

      {/* モード切替 */}
      <div className="flex space-x-4">
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

      {/* 実績登録UI */}
      {mode === "actual" && (
        <div className="space-y-4 mt-4">
          <div>
            <p className="font-semibold text-gray-700 mb-2">🎯 本日の出勤実績を記録:</p>
            <button
              onClick={handleActualLogin}
              className="bg-green-600 text-white px-6 py-2 rounded shadow"
            >
              🎯 出勤ボタン（今の時刻で登録）
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-500 mt-4 mb-2">または手動で入力:</p>
            <div className="space-y-2">
              <label className="block font-medium">日付を選択:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>

            <div className="space-y-2 mt-2">
              <label className="block font-medium">ログイン実績時刻を入力:</label>
              <input
                type="time"
                value={actualLoginTime}
                onChange={(e) => setActualLoginTime(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow mt-4"
            >
              実績を登録
            </button>
          </div>

          {message && <p className="text-sm mt-2 text-green-700 font-medium">{message}</p>}
        </div>
      )}

      {/* 計画登録UI（これから実装） */}
      {mode === "plan" && (
        <div className="mt-4 text-gray-500">
          📅 計画登録フォームはこのあと実装します。
        </div>
      )}
    </div>
  );
}
