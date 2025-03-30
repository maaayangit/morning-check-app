import React, { useState } from "react";

export default function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [actualLoginTime, setActualLoginTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!selectedDate || !actualLoginTime) {
      setMessage("⛔ 日付と実績ログイン時刻を入力してください。");
      return;
    }

    // TODO: APIでデータベースに実績ログイン時刻を送信
    setMessage(`✅ ${selectedDate} のログイン実績 (${actualLoginTime}) を登録しました。`);
    setActualLoginTime("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">🕓 ログイン実績入力</h2>

      <div className="space-y-2">
        <label className="block font-medium">日付を選択:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="space-y-2">
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
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        実績を登録
      </button>

      {message && <p className="text-sm mt-2 text-green-700 font-medium">{message}</p>}
    </div>
  );
}
