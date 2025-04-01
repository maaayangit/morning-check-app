// src/components/CalendarEvents.js
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
)

export default function CalendarEvents() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true })
      if (error) {
        console.error('データ取得エラー:', error)
      } else {
        setEvents(data)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Googleカレンダー同期予定一覧</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id} className="border-b py-2">
            <p><strong>{event.title}</strong>（{event.group_name}）</p>
            <p>{new Date(event.start_time).toLocaleString()} 〜 {new Date(event.end_time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
