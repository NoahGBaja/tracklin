'use client'

import '../../css/app.css'
import { useState } from 'react'
import Header from '../components/ui/header'
import { Trash, Calendar, Logo, PencilEdit } from '../components/ui/attributes'
import { Link } from '@inertiajs/react'
import { router } from '@inertiajs/react';

// Ambil CSRF token dari meta tag
const csrfToken =
  typeof document !== 'undefined'
    ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    : null

export default function ToDoList({ tasks: initialTasks }) {
  // ====== STATE ======
  const [tasks, setTasks] = useState(initialTasks || [])
  const [text, setText] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [time, setTime] = useState('')

  // ====== POPUP STATES ======
  const [showPopup, setShowPopup] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [popupText, setPopupText] = useState('')
  const [popupHour, setPopupHour] = useState(null)
  const [popupMinute, setPopupMinute] = useState(null)

  // ====== HELPERS ======
  function todayLocal() {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const pad = (n) => String(n).padStart(2, '0')

  const goBackFresh = () => {
  window.history.back();
  setTimeout(() => {
    router.reload({
      preserveScroll: true,
      preserveState: false
    });
  }, 80);
};


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

    if (!res.ok) throw new Error(await res.text())
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

    if (!res.ok) throw new Error(await res.text())
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

    if (!res.ok) throw new Error(await res.text())
  }

  // ====== ACTIONS ======

  const handleAddTask = async () => {
    if (!text.trim()) return alert('Task cannot be empty.')

    const payload = {
      text: text.trim(),
      date: date || todayLocal(),
      time: time ? time : null,
    }

    try {
      const saved = await addTaskToDB(payload)
      setTasks((prev) => [...prev, saved])
      setText('')
      setDate(todayLocal())
      setTime('')
    } catch (err) {
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
      alert('Failed to update task.')
    }
  }

  const handleDelete = async (task) => {
    if (!confirm('Delete this task?')) return

    try {
      await deleteTaskFromDB(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch (err) {
      alert('Failed to delete task.')
    }
  }

  // ====== POPUP HANDLERS ======

  const openPopup = (task) => {
    setEditingTask(task)
    setPopupText(task.text)

    if (task.time) {
      const [h, m] = task.time.split('.').map(Number)
      setPopupHour(h)
      setPopupMinute(m)
    } else {
      setPopupHour(null)
      setPopupMinute(null)
    }

    setShowPopup(true)
  }

  const savePopup = async () => {
    if (!popupText.trim()) return alert('Task cannot be empty!')

    const formattedTime =
      popupHour !== null && popupMinute !== null
        ? `${pad(popupHour)}.${pad(popupMinute)}`
        : null

    try {
      const updated = await updateTaskInDB(editingTask.id, {
        text: popupText.trim(),
        time: formattedTime,
      })

      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t))
      )

      setShowPopup(false)
    } catch (err) {
      alert('Failed to save changes.')
    }
  }

  // ====== FILTER TODAY TASKS ======
  const today = todayLocal()
  const todayTasks = (tasks || []).filter((t) => t.date === today)

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-full h-full justify-start items-center mt-10">
          <div className="flex flex-col w-[90%] items-center">

            {/* Top bar */}
            <div className="w-full flex justify-between items-center mb-4">
              <p
                onClick={goBackFresh}
                className="text-white text-5xl font-bold cursor-pointer hover:opacity-80"
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
                    value={time ? time.split('.')[1] : ''}
                    onChange={(e) => {
                      const mm = e.target.value
                      if (mm === '') {
                        setTime(time ? time.split('.')[0] + '.00' : '')
                        return
                      }
                      const num = Math.min(59, Math.max(0, Number(mm)))
                      const hh = time ? time.split('.')[0] : '00'
                      setTime(`${hh}.${pad(num)}`)
                    }}
                    className="w-16 border border-[#03045E] rounded-xl px-2 py-1 text-blue-900 bg-white/90 text-center"
                  />
                </div>
              </div>

              <button
                onClick={handleAddTask}
                className="bg-[#1976D2] text-white px-5 py-3 rounded-full text-xl border-3 border-[#03045E] hover:opacity-80 transition"
              >
                Add Task
              </button>

              <Link
                href="/schedule"
                className="bg-[#78B3F0] text-white px-5 py-3 rounded-full text-xl border-3 border-[#03045E] hover:opacity-80 transition"
              >
                See Schedule
              </Link>
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
                          Due: {task.time ? `${task.date} • ${task.time}` : task.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-100">
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => openPopup(task)}
                        className="hover:opacity-70 text-blue-600"
                      >
                        <PencilEdit size={2} />
                      </button>


                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(task)}
                        className="hover:opacity-70 transition text-red-600"
                      >
                        <Trash size={2} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================= POPUP MODAL ======================= */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-[#0D47A1] border-4 border-[#1646A9] text-blue-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">

            <h2 className="text-white text-2xl font-bold mb-4">
              Edit Task ✏️
            </h2>

            <label className="text-white block text-lg mb-1">Task:</label>
            <input
              type="text"
              value={popupText}
              onChange={(e) => setPopupText(e.target.value)}
              className="w-full border border-blue-400 bg-white rounded-xl p-2 mb-4"
            />

            <label className="text-white block text-lg mb-1">Time:</label>
            <div className="flex justify-between gap-2 mb-6">
              <input
                type="number"
                value={popupHour ?? ""}
                onChange={(e) => {
                  const v = e.target.value
                  setPopupHour(v === "" ? null : Math.min(23, Math.max(0, Number(v))))
                }}
                placeholder="HH"
                className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"
              />

              <input
                type="number"
                value={popupMinute ?? ""}
                onChange={(e) => {
                  const v = e.target.value
                  setPopupMinute(v === "" ? null : Math.min(59, Math.max(0, Number(v))))
                }}
                placeholder="MM"
                className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Cancel
              </button>

              <button
                onClick={savePopup}
                className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
