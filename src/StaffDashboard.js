// src/StaffDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlanLogList from "./PlanLogList";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

export default function StaffDashboard() {
  const [userId, setUserId] = useState("");
  const [mode, setMode] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlanDate, setSelectedPlanDate] = useState("");
  const [expectedTime, setExpectedTime] = useState("00:00");
  const [workCode, setWorkCode] = useState("");
  const [workCodeMaster, setWorkCodeMaster] = useState({});
  const [refreshLog, setRefreshLog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !selectedPlanDate) return;
  
    const fetchWorkCodeFromCalendar = async () => {
      const { data: calendarMap } = await supabase
        .from("user_calendars")
        .select("calendar_id")
        .eq("user_id", userId);
  
      if (!calendarMap || calendarMap.length === 0) {
        setWorkCode("（指定なし）");
        return;
      }
  
      const calendarId = calendarMap[0].calendar_id;
  
      const { data: events } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("calendar_id", calendarId)
        .gte("start_time", `${selectedPlanDate}T00:00:00`)
        .lt("start_time", `${selectedPlanDate}T23:59:59`);
  
      if (!events || events.length === 0) {
        setWorkCode("（指定なし）");
        return;
      }
  
      const event = events[0];
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
  
      const formatted = `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}〜${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${event.group_name}`;
      setWorkCode(formatted);
    };
  
    fetchWorkCodeFromCalendar();
  }, [selectedPlanDate, userId]);  
  
  const handleActualLogin = async () => {
    if (!userId || userId.length !== 7) {
      setMessage("⛔ 正しい7桁の社員番号を入力してください");
      return;
    }

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);

    const checkRes = await fetch(`https://fastapi-backend-dot2.onrender.com/schedules?date=${today}`);
    const scheduleData = await checkRes.json();

    const hasTodayPlan = scheduleData.some((item) => String(item.user_id) === String(userId));

    if (!hasTodayPlan) {
      setMessage("⛔ 計画登録日以外なので登録できません！");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const payload = { user_id: Number(userId), date: today, login_time: time };

    const res = await fetch("https://fastapi-backend-dot2.onrender.com/update-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setMessage(result.message || "出勤記録を登録しました");
    setRefreshLog((prev) => !prev);
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePlanSubmit = async () => {
    if (!userId || userId.length !== 7) {
      setMessage("⛔ 正しい7桁の社員番号を入力してください");
      return;
    }

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
      user_id: Number(userId),
      date: selectedPlanDate,
      expected_login_time: expectedTime,
    };

    await fetch("https://fastapi-backend-dot2.onrender.com/update-expected-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetch("https://fastapi-backend-dot2.onrender.com/log-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setRefreshLog((prev) => !prev);
    setMessage("出勤予定を登録しました");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-gray-900">勤怠支援アプリ</h1>
            <p className="text-gray-500 text-sm">担当者用ダッシュボード</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
          >
            ホームに戻る
          </button>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">👤 社員番号（7桁）</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="例: 1234567"
            className="w-40 border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setMode("actual")}
            className={`flex-1 py-2 rounded font-semibold ${
              mode === "actual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            実績登録
          </button>
          <button
            onClick={() => setMode("plan")}
            className={`flex-1 py-2 rounded font-semibold ${
              mode === "plan" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            計画登録
          </button>
        </div>

        {mode === "actual" && (
          <div className="space-y-4">
            <p className="text-gray-700 font-semibold">🎯 本日の出勤実績を記録</p>
            <button
              onClick={handleActualLogin}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded shadow"
            >
              🎯 出勤ボタン
            </button>
            {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          </div>
        )}

        {mode === "plan" && (
          <div className="space-y-4">
            <p className="text-gray-700 font-semibold">📝 出勤予定の登録</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📅 出勤日</label>
              <input
                type="date"
                value={selectedPlanDate}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                onChange={(e) => setSelectedPlanDate(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">⏰ 出勤予定時刻</label>
              <input
                type="time"
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">💼 勤務指定</label>
              <input
                type="text"
                readOnly
                value={workCode || "（指定なし）"}
                className="border px-3 py-2 rounded bg-gray-100 w-full text-gray-700"
              />
            </div>

            <button
              onClick={handlePlanSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded shadow"
            >
              📝 出勤予定を登録する
            </button>

            {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          </div>
        )}
      </div>

      {userId && userId.length === 7 && (
        <div className="w-full max-w-2xl mt-6">
          <PlanLogList userId={userId} refreshTrigger={refreshLog} key={refreshLog} />
        </div>
      )}
    </div>
  );
}
