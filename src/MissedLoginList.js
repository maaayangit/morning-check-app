import React, { useEffect, useState } from "react";

export default function MissedLoginList({ selectedDate }) {
  const [missedLogins, setMissedLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fastapi-backend-dot2.onrender.com/login-check")
      .then((res) => res.json())
      .then((data) => {
        setMissedLogins(data.missed_logins || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("取得失敗:", err);
        setLoading(false);
      });
  }, []); // ← selectedDate を依存配列から削除

  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  return (
    <>
      <h2 className="text-lg font-bold mb-2">🚨 未ログイン・遅刻者一覧（{todayStr}）</h2>

      {loading ? (
        <p>読み込み中...</p>
      ) : missedLogins.length === 0 ? (
        <p>🎉 問題のあるユーザーはいません</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1">社員番号</th>
              <th className="border px-2 py-1">日付</th>
              <th className="border px-2 py-1">理由</th>
            </tr>
          </thead>
          <tbody>
            {missedLogins.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.user_id}</td>
                <td className="border px-2 py-1">{item.date}</td>
                <td className="border px-2 py-1 text-red-600">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
