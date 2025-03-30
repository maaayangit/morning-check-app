// src/AdminDashboard.js

import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import MissedLoginList from "./MissedLoginList";

export default function AdminDashboard({ today }) {
  const [csvFile, setCsvFile] = useState(null);
  const [schedulePreview, setSchedulePreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [lastUploadTime, setLastUploadTime] = useState(null);

  // ⏱ ローカルストレージからファイル名・時刻読み込み
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
      {/* 📂 CSVアップロード */}
      <div className="bg-white shadow rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-bold">📋 勤務予定CSVアップロード</h2>
        <p className="text-sm text-gray-600">CSVファイルを選択してアップロードしてください。</p>

        <input type="file" accept=".csv" onChange={handleFileChange} className="block" />

        <div className="flex items-center space-x-4 mt-2">
          <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
            アップロード
          </button>
          <button onClick={handleReset} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
            リセット
          </button>
        </div>

        {uploadedFileName && (
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p>📄 ファイル名: {uploadedFileName}</p>
            <p>🕒 最終アップロード: {lastUploadTime}</p>
          </div>
        )}
      </div>

      {/* 🚨 当日分の未ログイン・遅刻一覧 */}
      <div className="bg-white shadow rounded-xl p-4">
        <MissedLoginList selectedDate={today} />
      </div>

      {/* 🖥️ CSVプレビュー表示（任意） */}
      {schedulePreview.length > 0 && (
        <div className="bg-white shadow rounded-xl p-4 space-y-4">
          <h2 className="font-semibold">CSVプレビュー</h2>

          <div className="flex items-center space-x-4">
            <label className="font-semibold">プレビュー表示:</label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="preview"
                checked={showPreview === true}
                onChange={() => setShowPreview(true)}
              />
              <span>表示</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="preview"
                checked={showPreview === false}
                onChange={() => setShowPreview(false)}
              />
              <span>非表示</span>
            </label>
          </div>

          {showPreview && (
            <table className="w-full text-sm border mt-2">
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
          )}
        </div>
      )}
    </div>
  );
}
