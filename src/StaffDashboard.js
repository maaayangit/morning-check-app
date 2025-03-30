import React, { useState } from "react";

export default function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [expectedLoginTime, setExpectedLoginTime] = useState("");
  const [workCode, setWorkCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateLoginTime = () => {
    if (workCode === "★07A") {
      return expectedLoginTime < "07:00";
    } else if (workCode === "★11A") {
      return expectedLoginTime < "11:00";
    }
    return true; // それ以外の勤務指定ならバリデーションなし
  };

  const handleSubmit = () => {
    setValidationMessage("");
    setSubmitSuccess(false);

    if (!selectedDate || !expectedLoginTime) {
      setValidationMessage("日付と予定ログイン時刻を入力してください。");
      return;
    }

    if (!validateLoginTime()) {
      setValidationMessage(`勤務指定(${workCode})の条件を満たしていません。`);
      return;
    }

    // API送信
    fetch("https://fastapi-backend-dot2.onrender.com/update-login-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        expected_login_time: expectedLoginTime,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSubmitSuccess(true);
        } else {
          setValidationMessage("更新に失敗しました。");
        }
      })
      .catch(() => {
        setValidationMessage("通信エラーが発生しました。");
      });
  };

  return (
    <div className="bg-white p-4 shadow rounded-xl space-y-4">
      <h2 className="text-lg font-bold">🧑 担当者ダッシュボード</h2>

      <div>
        <label className="font-semibold mr-2">日付選択:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="font-semibold mr-2">予定ログイン時刻:</label>
        <input
          type="time"
          value={expectedLoginTime}
          onChange={(e) => setExpectedLoginTime(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="font-semibold mr-2">勤務指定（例：★07A / ★11A）:</label>
        <input
          type="text"
          value={workCode}
          onChange={(e) => setWorkCode(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      {validationMessage && (
        <p className="text-red-600 font-semibold">{validationMessage}</p>
      )}

      {submitSuccess && (
        <p className="text-green-600 font-semibold">✅ 更新が完了しました！</p>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        更新する
      </button>
    </div>
  );
}
