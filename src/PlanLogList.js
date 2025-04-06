import React, { useEffect, useState } from "react";

export default function PlanLogList({ userId, refreshTrigger }) {
  const [logs, setLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError("⚠️ 社員番号が正しくありません。");
      setLogs([]);
      setSchedules([]);
      return;
    }

    // PlanLog取得
    fetch(`https://fastapi-backend-dot2.onrender.com/log-plan?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setError("");
      })
      .catch((err) => {
        console.error("予定ログ取得失敗:", err);
        setError("⛔ 出勤予定データの取得に失敗しました。");
      });

    // Schedule取得（出勤実績用）
    fetch(`https://fastapi-backend-dot2.onrender.com/schedules`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((item) => String(item.user_id) === String(userId));
        setSchedules(filtered);
      })
      .catch((err) => {
        console.error("実績データ取得失敗:", err);
      });
  }, [userId, refreshTrigger]);

  // 日付をキーにマッピング
  const actualLoginMap = {};
  schedules.forEach((s) => {
    if (s.login_time) {
      actualLoginMap[s.date] = s.login_time;
    }
  });

  // 日本時間に変換してフォーマットする関数
  const formatDateTimeJST = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      hour12: false,
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl mt-6">
      <h2 className="font-bold text-lg">📖 出勤予実履歴</h2>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {logs.length > 0 && (
        <table className="w-full text-sm border mt-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">日付</th>
              <th className="border px-2 py-1">予定時刻</th>
              <th className="border px-2 py-1">登録時刻</th>
              <th className="border px-2 py-1">出勤実績</th>
            </tr>
          </thead>
          <tbody>
            {[...logs]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{log.date}</td>
                  <td className="border px-2 py-1">{log.expected_login_time}</td>
                  <td className="border px-2 py-1">
                    {formatDateTimeJST(log.registered_at)}
                  </td>
                  <td className="border px-2 py-1">
                    {actualLoginMap[log.date]
                      ? formatDateTimeJST(`${log.date}T${actualLoginMap[log.date]}`)
                      : "－"}
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
