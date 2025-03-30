import Papa from "papaparse";
import React, { useState } from "react";

export default function AdminDashboard() {
  const [csvFile, setCsvFile] = useState(null);
  const [schedulePreview, setSchedulePreview] = useState([]);
  const [showPreview, setShowPreview] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState(""); // ← ファイル名
  const [lastUploadTime, setLastUploadTime] = useState(null);   // ← アップロード時刻

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    if (file) {
      setUploadedFileName(file.name); // ← ファイル名を保存
    }
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

            // アップロード時間を保存
            const now = new Date();
            const formatted = now.toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });
            setLastUploadTime(formatted);
          })
          .catch((err) => {
            console.error("送信エラー:", err);
            alert("送信に失敗しました");
          });
      },
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">管理者ダッシュボード</h1>

      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <h2 className="font-semibold">📂 勤務予定CSVアップロード</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} className="block" />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          アップロード
        </button>

        {/* ✅ ファイル名・日時を表示 */}
        {uploadedFileName && (
          <p className="text-sm text-gray-600 mt-2">📄 アップロード済みファイル: {uploadedFileName}</p>
        )}
        {lastUploadTime && (
          <p className="text-sm text-gray-500">🕒 最終アップロード: {lastUploadTime}</p>
        )}
      </div>

      {/* ✅ 表示切り替え */}
      {schedulePreview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="font-semibold">CSVプレビュー表示:</label>
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
      )}
    </div>
  );
}
