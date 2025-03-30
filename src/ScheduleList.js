import React, { useEffect, useState } from "react";

// ✅ selectedDate を props で受け取る
export default function ScheduleList({ selectedDate }) {
    const [schedules, setSchedules] = useState([]);
  
    useEffect(() => {
      if (!selectedDate) return;
  
      fetch(`https://fastapi-backend-dot2.onrender.com/schedules?date=${selectedDate}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("取得したスケジュール:", data);
          setSchedules(data);
        })
        .catch((err) => {
          console.error("取得失敗:", err);
        });
    }, [selectedDate]);
  
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-bold">📋 勤務予定一覧</h2>
  
        {/* 選択された日付を明示的に表示 */}
        {selectedDate && (
          <p className="text-sm text-gray-600">表示中の日付: {selectedDate}</p>
        )}
  
        {schedules.length === 0 ? (
          <p>データがありません。</p>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th className="border px-2 py-1">ユーザー名</th>
                <th className="border px-2 py-1">日付</th>
                <th className="border px-2 py-1">勤務指定</th>
                <th className="border px-2 py-1">ログイン時刻</th>
                <th className="border px-2 py-1">休日</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{item.username}</td>
                  <td className="border px-2 py-1">{item.date}</td>
                  <td className="border px-2 py-1">{item.work_code || "-"}</td>
                  <td className="border px-2 py-1">{item.login_time || "-"}</td>
                  <td className="border px-2 py-1">{item.is_holiday ? "✅" : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  