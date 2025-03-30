// src/AdminDashboard.js
import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import MissedLoginList from "./MissedLoginList";

export default function AdminDashboard() {
  const [csvFile, setCsvFile] = useState(null);
  const [schedulePreview, setSchedulePreview] = useState([]);
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
            setSchedulePreview(data);
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
    setCsvFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">🛠️ 管理者用ダッシュボード</h2>

        <div className="space-y-2">
          <h3 className="font-semibold">🗂️ 勤務予定CSVアップロード</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border rounded px-2 py-1"
          />

          <div className="flex gap-3 mt-2">
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded shadow">
              アップロード
            </button>
            <button onClick={handleReset} className="bg-gray-300 px-4 py-2 rounded shadow">
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

      {/* 🚨 遅刻者一覧 */}
      <MissedLoginList />
    </div>
  );
}
