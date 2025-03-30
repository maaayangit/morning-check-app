import Papa from "papaparse";
import React, { useState } from "react";

export default function AdminDashboard() {
  const [csvFile, setCsvFile] = useState(null);
  const [schedulePreview, setSchedulePreview] = useState([]);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!csvFile) return;
  
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((row) => ({
          user_id: Number(row.user_id),
          username: row.username,
          date: row.date,
          work_code: row.work_code || null,
          expected_login_time: row.expected_login_time || null,
          login_time: row.login_time || null,
          is_holiday: row.is_holiday === "TRUE" || row.is_holiday === "true",
        }));
  
        setSchedulePreview(data);
  
        fetch("https://fastapi-backend-dot2.onrender.com/upload-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("APIレスポンス:", res);
            alert(res.message);
          })
          .catch((err) => {
            console.error("送信エラー:", err);
            alert("送信に失敗しました");
          });
      },
    }); // ← ここでPapa.parse() 終わり
  
  }; // ← ❗ handleUpload の閉じ括弧を忘れずに
  
    

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">管理者ダッシュボード</h1>

      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <h2 className="font-semibold">📂 勤務予定CSVアップロード</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} className="block" />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          アップロード
        </button>
      </div>

      {schedulePreview.length > 0 && (
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="font-semibold mb-2">CSVプレビュー</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th className="text-left border px-2 py-1">ユーザー名</th>
                <th className="text-left border px-2 py-1">日付</th>
                <th className="text-left border px-2 py-1">勤務指定</th>
                <th className="text-left border px-2 py-1">予定ログイン</th>
                <th className="text-left border px-2 py-1">ログイン時刻</th>
                <th className="text-left border px-2 py-1">休日</th>
              </tr>
            </thead>
            <tbody>
              {schedulePreview.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{row.username}</td>
                  <td className="border px-2 py-1">{row.date}</td>
                  <td className="border px-2 py-1">{row.work_code || "-"}</td>
                  <td className="border px-2 py-1">{row.expected_login_time || "-"}</td>
                  <td className="border px-2 py-1">{row.login_time || "-"}</td>
                  <td className="border px-2 py-1">{row.is_holiday ? "✅" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
