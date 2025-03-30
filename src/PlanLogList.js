import React, { useEffect, useState } from "react";

export default function PlanLogList({ userId, refreshTrigger }) {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError("⚠️ 社員番号が正しくありません。");
      setLogs([]);
      return;
    }

    fetch(`https://fastapi-backend-dot2.onrender.com/log-plan?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setError("⚠️ 入力された社員番号に一致するデータが見つかりません。");
          setLogs([]);
        } else {
          setError("");
          setLogs(data);
        }
      })
      .catch((err) => {
        console.error("取得失敗:", err);
        setError("⛔ データ取得に失敗しました。");
      });
  }, [userId, refreshTrigger]); // 👈 ここに refreshTrigger を追加！

  return (
    <div className="p-4 bg-white shadow rounded-xl mt-6">
      <h2 className="font-bold text-lg">📖 出勤予定履歴</h2>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {logs.length > 0 && (
        <table className="w-full text-sm border mt-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">日付</th>
              <th className="border px-2 py-1">出勤予定時刻</th>
              <th className="border px-2 py-1">登録時刻</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{log.date}</td>
                <td className="border px-2 py-1">{log.expected_login_time}</td>
                <td className="border px-2 py-1">{log.registered_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
