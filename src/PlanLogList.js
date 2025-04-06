import React, { useEffect, useState } from "react";

export default function PlanLogList({ userId, refreshTrigger }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!userId) return;
  
    fetch(`https://fastapi-backend-dot2.onrender.com/log-plan?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.logs || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(sorted);
      })
      .catch((err) => console.error("取得エラー:", err));
  }, [userId, refreshTrigger]);  

  return (
    <div className="bg-white shadow rounded p-4 mt-4">
      <h3 className="text-lg font-bold mb-2">🕓 出勤予定・実績履歴</h3>
  
      {logs.length === 0 ? (
        <p className="text-gray-500">登録された履歴はありません</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1">日付</th>
              <th className="border px-2 py-1">予定時刻</th>
              <th className="border px-2 py-1">登録時刻</th>
              <th className="border px-2 py-1">出勤実績</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{log.date}</td>
  
                <td className="border px-2 py-1">
                  {log.expected_login_time
                    ? new Date(log.expected_login_time).toLocaleString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).replace(/\//g, "-")
                    : "－"}
                </td>
  
                <td className="border px-2 py-1">
                  {log.registered_at
                    ? new Date(log.registered_at).toLocaleString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).replace(/\//g, "-")
                    : "－"}
                </td>
  
                <td className="border px-2 py-1">
                  {log.login_time
                    ? new Date(log.login_time).toLocaleString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }).replace(/\//g, "-")
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
