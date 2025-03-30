import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import MissedLoginList from "./MissedLoginList";

export default function AdminDashboard() {
  const [csvFile, setCsvFile] = useState(null);
  const [schedulePreview, setSchedulePreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [lastUploadTime, setLastUploadTime] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("uploadedFileName");
    const storedTime = localStorage.getItem("lastUploadTime");
    if (storedName) setUploadedFileName(storedName);
    if (storedTime) setLastUploadTime(storedTime);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
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
        setShowPreview(false);

        fetch("https://fastapi-backend-dot2.onrender.com/upload-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            alert(res.message);
            const now = new Date().toLocaleString();
            localStorage.setItem("uploadedFileName", csvFile.name);
            localStorage.setItem("lastUploadTime", now);
            setUploadedFileName(csvFile.name);
            setLastUploadTime(now);
          })
          .catch((err) => {
            console.error("送信エラー:", err);
            alert("送信に失敗しました");
          });
      },
    });
  };

  const handleReset = () => {
    localStorage.removeItem("uploadedFileName");
    localStorage.removeItem("lastUploadTime");
    setUploadedFileName(null);
    setLastUploadTime(null);
    setSchedulePreview([]);
    setShowPreview(false);
    setCsvFile(null);
  };

  return (
    <div className="space-y-6">
      {/* メインカード */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">🛠️ 管理者用ダッシュボード</h2>

        {/* CSV アップロード */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">📂 勤務予定CSVアップロード</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block border border-gray-300 rounded px-3 py-2"
          />

          <div className="flex flex-wrap gap-2 mt-2">
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded shadow">
              アップロード
            </button>
            <button onClick={handleReset} className="bg-gray-300 text-black px-4 py-2 rounded">
              リセット
            </button>
          </div>

          {uploadedFileName && (
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p>📄 アップロード済みファイル: {uploadedFileName}</p>
              <p>🕒 最終アップロード: {lastUploadTime}</p>
            </div>
          )}
        </div>
      </div>

      {/* 📋 CSV プレビュー表示 */}
      {schedulePreview.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center gap-4">
            <label className="font-semibold">CSVプレビュー表示:</label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="preview" checked={showPreview} onChange={() => setShowPreview(true)} />
              <span>表示</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="preview" checked={!showPreview} onChange={() => setShowPreview(false)} />
              <span>非表示</span>
            </label>
          </div>

          {showPreview && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border mt-4">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">ユーザー名</th>
                    <th className="border px-2 py-1">日付</th>
                    <th className="border px-2 py-1">勤務指定</th>
                    <th className="border px-2 py-1">予定時刻</th>
                    <th className="border px-2 py-1">出勤実績</th>
                    <th className="border px-2 py-1">休日</th>
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
      )}

      {/* 🚨 未ログイン・遅刻者一覧 */}
      <MissedLoginList />
    </div>
  );
}
