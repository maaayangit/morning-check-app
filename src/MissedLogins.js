import React, { useEffect, useState } from "react";

export default function MissedLogins() {
  const [missedLogins, setMissedLogins] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/login-check")
      .then((res) => res.json())
      .then((data) => {
        console.log("🔍 ログインチェック結果:", data);
        setMissedLogins(data.missed_logins || []);
      })
      .catch((err) => {
        console.error("取得失敗:", err);
      });
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-4">
      <h2 className="text-lg font-bold mb-2">🚨 未ログイン・遅刻者一覧（本日）</h2>
      {missedLogins.length === 0 ? (
        <p>問題のあるユーザーはいません 🎉</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1">ユーザー名</th>
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
