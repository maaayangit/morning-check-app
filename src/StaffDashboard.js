import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const [mode, setMode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleActualLogin = async () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);

    const payload = {
      user_id: 1, // FIXME: 実際のログインユーザーに
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

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        {/* ヘッダー＋右上ホームボタン */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <span>🧑‍💼 勤怠支援アプリ</span>
              <span className="text-gray-500 text-base">担当者用ダッシュボード</span>
            </h1>
            <p className="text-sm text-gray-600">
              実績または計画を選択して出勤記録を行ってください。
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 text-sm text-black px-4 py-1 rounded"
          >
            ホームに戻る
          </button>
        </div>

        {/* モード切替ボタン */}
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

        {/* 実績登録モード */}
        {mode === "actual" && (
          <div className="mt-6 space-y-4">
            <p className="font-semibold text-gray-700">🎯 本日の出勤実績を記録:</p>
            <button
              onClick={handleActualLogin}
              className="bg-green-600 text-white px-6 py-2 rounded shadow"
            >
              🎯 出勤ボタン
            </button>
            {message && (
              <p className="text-green-700 font-semibold mt-2">{message}</p>
            )}
          </div>
        )}

        {/* 計画登録モード */}
        {mode === "plan" && (
          <div className="mt-6 text-gray-500">
            📅 計画登録フォームはこのあと実装します。
          </div>
        )}
      </div>
    </div>
  );
}
