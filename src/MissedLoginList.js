import React, { useEffect, useState } from "react";

export default function MissedLoginList() {
  const [missedLogins, setMissedLogins] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⏰ 日本時間で当日を取得
  const todayJST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  )
    .toISOString()
    .slice(0, 10); // "YYYY-MM-DD"

  useEffect(() => {
    fetch(`https://fastapi-backend-dot2.onrender.com/login-check?date=${todayJST}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 未ログインチェック結果:", data);
        setMissedLogins(data.missed_logins || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("取得失敗:", err);
        setLoading(false);
      });
  }, [todayJST]);

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-4">
      <h2 className="text-lg font-bold mb-2">
        🚨 未ログイン・遅刻者一覧（{todayJST}）
      </h2>

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
                <td className="border px-2 py-1">{item.username}</td>
                <td className="border px-2 py-1">{item.date}</td>
                <td className="border px-2 py-1 text-red-600">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
