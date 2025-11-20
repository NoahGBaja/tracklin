'use client'

import '../../css/app.css'
import { useState } from 'react'
import Header from '../components/ui/header'
import { Trash, Calendar, Logo } from '../components/ui/attributes'
import { Link } from '@inertiajs/react'
// Ambil CSRF token dari meta tag di layout Blade
const csrfToken =
  typeof document !== 'undefined'
    ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    : null

export default function ToDoList({ tasks: initialTasks }) {
  // ====== STATE ======
  const [tasks, setTasks] = useState(initialTasks || [])
  const [text, setText] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [time, setTime] = useState('') // optional, format HH.MM

  // ====== HELPERS ======
  function todayLocal() {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const pad = (n) => String(n).padStart(2, '0')

  // ====== BACKEND CALLS ======
  const addTaskToDB = async (payload) => {
    const res = await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('Create task failed:', await res.text())
      throw new Error('Failed to create task')
    }

    return await res.json()
  }

  const updateTaskInDB = async (id, payload) => {
    const res = await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('Update task failed:', await res.text())
      throw new Error('Failed to update task')
    }

    return await res.json()
  }

  const deleteTaskFromDB = async (id) => {
    const res = await fetch(`/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
    })

    if (!res.ok) {
      console.error('Delete task failed:', await res.text())
      throw new Error('Failed to delete task')
    }
  }

  // ====== HANDLERS ======

  const handleAddTask = async () => {
    if (!text.trim()) {
      alert('Task cannot be empty.')
      return
    }

    const payload = {
      text: text.trim(),
      date: date || todayLocal(),
      time: time ? time : null, // kirim null kalau kosong
    }

    try {
      const saved = await addTaskToDB(payload)
      setTasks((prev) => [...prev, saved])
      setText('')
      setDate(todayLocal())
      setTime('')
    } catch (err) {
      console.error(err)
      alert('Failed to add task.')
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      const updated = await updateTaskInDB(task.id, {
        completed: !task.completed,
      })

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated : t))
      )
    } catch (err) {
      console.error(err)
      alert('Failed to update task.')
    }
  }

  const handleDelete = async (task) => {
    if (!confirm('Delete this task?')) return

    try {
      await deleteTaskFromDB(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete task.')
    }
  }

  // Filter hanya task untuk hari ini (kalau mau semua, hapus filter ini)
  const today = todayLocal()
  const todayTasks = (tasks || []).filter((t) => t.date === today)

  // ====== UI ======
  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-full h-full justify-start items-center mt-10">
          <div className="flex flex-col w-[90%] items-center">
            {/* Top bar */}
            <div className="w-full flex justify-between items-center mb-4">
              <p
                onClick={() => window.history.back()}
                className="text-white text-6xl font-bold cursor-pointer hover:opacity-80"
              >
                ‹ back
              </p>
              <div className="scale-90 mt-5">
                <Logo size={1.8} />
              </div>
            </div>

            {/* Input row */}
            <div className="flex flex-wrap w-full justify-start items-center gap-3 mb-4 -mt-2">
              <div className="relative w-[60%]">
                <p
                  className="text-white absolute -top-15 left-4 text-4xl"
                  style={{
                    textShadow:
                      '-2.5px -2.5px 0 #0D277B, 2.5px -2.5px 0 #0D277B, -2.5px  2.5px 0 #0D277B, 2.5px  2.5px 0 #0D277B',
                  }}
                >
                  Today&apos;s to-do-list:
                </p>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter a task..."
                  className="pl-4 pr-4 py-3 text-xl rounded-full border border-[#03045E] w-full bg-white/90 text-blue-900 font-light focus:outline-none placeholder:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-[#03045E] rounded-xl px-3 py-2 text-blue-900 bg-white/90"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg">Time:</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="HH"
                    value={time ? time.split('.')[0] : ''}
                    onChange={(e) => {
                      const hh = e.target.value
                      if (hh === '') {
                        setTime('')
                        return
                      }
                      const num = Math.min(23, Math.max(0, Number(hh)))
                      const mm = time ? time.split('.')[1] || '00' : '00'
                      setTime(`${pad(num)}.${mm}`)
                    }}
                    className="w-16 border border-[#03045E] rounded-xl px-2 py-1 text-blue-900 bg-white/90 text-center"
                  />
                  <span className="text-white text-lg">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={time ? time.split('.')[1] || '' : ''}
                    onChange={(e) => {
                      const mm = e.target.value
                      if (mm === '') {
                        setTime(time ? time.split('.')[0] + '.00' : '')
                        return
                      }
                      const num = Math.min(59, Math.max(0, Number(mm)))
                      const hh = time ? time.split('.')[0] || '00' : '00'
                      setTime(`${hh}.${pad(num)}`)
                    }}
                    className="w-16 border border-[#03045E] rounded-xl px-2 py-1 text-blue-900 bg-white/90 text-center"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddTask}
                  className="bg-[#1976D2] text-white px-5 py-3 rounded-full text-xl border-3 border-[#03045E] hover:opacity-80 transition"
                >
                  Add Task
                </button>
              </div>
              <div className="flex gap-3">
                <Link href="/schedule" className="bg-[#78B3F0] text-white px-5 py-3 rounded-full text-xl border-3 border-[#03045E] hover:opacity-80 transition">See Schedule</Link>
              </div>
            </div>

            {/* Task list */}
            <div
              className="flex flex-col w-full bg-white/90 border-4 border-blue-800 rounded-3xl p-6 overflow-y-auto shadow-xl"
              style={{ height: '55vh' }}
            >
              {todayTasks.length === 0 ? (
                <p className="text-blue-900 text-center text-xl opacity-70">
                  No tasks for today!
                </p>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex justify-between items-center px-4 py-3 mb-3 bg-white rounded-2xl border border-blue-700"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!task.completed}
                        onChange={() => handleToggleComplete(task)}
                        className="w-5 h-5 accent-blue-700"
                      />
                      <div className="flex flex-col">
                        <p
                          className={`text-xl ${
                            task.completed
                              ? 'text-green-600 line-through'
                              : 'text-blue-700'
                          }`}
                        >
                          {task.text}
                        </p>
                        <p className="text-base text-blue-800 opacity-70">
                          Due:{' '}
                          {task.time
                            ? `${task.date} • ${task.time}`
                            : task.date || 'Anytime'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(task)}
                      className="hover:opacity-70 transition text-red-600"
                    >
                      <Trash size={2} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
