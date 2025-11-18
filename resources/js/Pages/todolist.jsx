'use client'

import '../../css/app.css'
import { useState, useEffect } from 'react'
import Header from '../components/ui/header'
import { Link } from '@inertiajs/react'
import { PencilEdit, Trash, TimeClock, Calendar, Logo } from '../components/ui/attributes'

export default function ToDoList() {
  const todayDate = new Date().toISOString().split('T')[0]

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Task 1', due: 'Today, 23.59', date: todayDate, completed: false },
    { id: 2, text: 'Task 2', due: 'Today, 20.00', date: todayDate, completed: false },
  ])

  const [input, setInput] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHour, setSelectedHour] = useState(null)
  const [selectedMinute, setSelectedMinute] = useState(null)
  const [tempDate, setTempDate] = useState('')
  const [tempHour, setTempHour] = useState(0)
  const [tempMinute, setTempMinute] = useState(0)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editText, setEditText] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editHour, setEditHour] = useState(null)
  const [editMinute, setEditMinute] = useState(null)
  const [showEditPopup, setShowEditPopup] = useState(false)

  const handleCalendarClick = () => {
    setTempDate(selectedDate || '')
    setShowCalendar(true)
  }

  const handleTimeClick = () => {
    const now = new Date()
    setTempHour(selectedHour ?? now.getHours())
    setTempMinute(selectedMinute ?? now.getMinutes())
    setShowTimer(true)
  }

  const buildFormattedTime = (hour, minute) =>
    hour === null || minute === null ? '' : `${String(hour).padStart(2, '0')}.${String(minute).padStart(2, '0')}`

  const isTomorrowDate = (dateStr) => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    return tomorrow.toISOString().split('T')[0] === dateStr
  }

  // helper: start of given date (local) for safe comparisons
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

 const addTask = () => {
  if (!input.trim()) return;

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const hasTime = selectedHour !== null && selectedMinute !== null;
  const formattedTime = buildFormattedTime(selectedHour, selectedMinute);

  let finalDate = selectedDate || ""; // may be empty

  // RULE 1 — no date + no time → set to today
  if (!finalDate && !hasTime) {
    finalDate = today;
  }

  // RULE 2 — has time but no date
  if (hasTime && !finalDate) {
    const chosenToday = new Date();
    chosenToday.setHours(selectedHour, selectedMinute, 0, 0);

    // If chosen time is > now → allow & assign today
    if (chosenToday > now) {
      finalDate = today;
    } else {
      alert("The time has passed, set for another time.");
      return;
    }
  }

  // If user provided date → check past date
  if (finalDate) {
    const chosenDateStart = new Date(`${finalDate}T00:00:00`);
    const todayStart = startOfDay(now);

    // RULE 4 — past date not allowed
    if (chosenDateStart < todayStart) {
      alert("⛔ You cannot add tasks for past dates.");
      return;
    }

    // RULE 3 — date = today + time is provided
    if (finalDate === today && hasTime) {
      const chosenDateTime = new Date(`${finalDate}T00:00:00`);
      chosenDateTime.setHours(selectedHour, selectedMinute, 0, 0);

      if (chosenDateTime <= now) {
        alert("The time has passed, set for another time.");
        return;
      }
    }
  }

  // Fallback safety
  if (!finalDate) finalDate = today;

  // Build display string
  let displayDue = "";
  if (finalDate === today && formattedTime) {
    displayDue = `Today, ${formattedTime}`;
  } else if (finalDate === today) {
    displayDue = "Today";
  } else if (formattedTime) {
    displayDue = isTomorrowDate(finalDate)
      ? `Tomorrow, ${formattedTime}`
      : `${finalDate}, ${formattedTime}`;
  } else {
    displayDue = isTomorrowDate(finalDate) ? "Tomorrow" : `${finalDate}`;
  }

  const newTask = {
    id: Date.now(),
    text: input,
    due: displayDue,
    date: finalDate,
    time: formattedTime,
    completed: false,
    overdue: false,
  };

  setTasks((prev) => [...prev, newTask]);

  if (finalDate === today) {
  } else if (isTomorrowDate(finalDate)) {
    alert(
      formattedTime
        ? `✅ Your task is set to tomorrow at ${formattedTime}`
        : `✅ Your task is set to tomorrow`
    );
  } else {
    alert(
      formattedTime
        ? `✅ Task added to ${finalDate} at ${formattedTime}`
        : `✅ Task added to ${finalDate}`
    );
  }

  setInput("");
  setSelectedDate("");
  setSelectedHour(null);
  setSelectedMinute(null);
  setTempDate("");
  setTempHour(0);
  setTempMinute(0);
  setShowCalendar(false);
  setShowTimer(false);
};


  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))

  // Auto check overdue tasks every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTasks((prev) =>
        prev.map((task) => {
          if (task.completed) return { ...task, overdue: false }
          const taskDateTime = new Date(task.date)
          if (task.time) {
            const [h, m] = task.time.split('.').map(Number)
            taskDateTime.setHours(h, m, 0, 0)
          } else {
            taskDateTime.setHours(23, 59, 59, 999)
          }
          return { ...task, overdue: now > taskDateTime }
        })
      )
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const todayTasks = tasks.filter((t) => t.date === todayDate)

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-full h-full justify-start items-center mt-10">
          <div className="flex flex-col w-[90%] items-center">
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

            <div className="flex flex-wrap w-full justify-start items-center gap-3 mb-4 -mt-2">
              <div className="relative w-[50%]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a task..."
                  className="pl-4 pr-24 py-3 text-xl rounded-full border border-[#03045E] w-full bg-white/90 text-blue-900 font-light focus:outline-none placeholder:opacity-60"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={handleTimeClick}
                    className="w-8 h-8 flex justify-center items-center hover:opacity-75 transition"
                    title="Set time"
                  >
                    <TimeClock size={2} />
                  </button>
                  <button
                    onClick={handleCalendarClick}
                    className="w-8 h-8 flex justify-center items-center hover:opacity-75 transition"
                    title="Set date"
                  >
                    <Calendar size={2} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addTask}
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
            </div>

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
                    className={`group flex justify-between items-center px-4 py-3 mb-3 bg-white rounded-2xl border transition-all duration-300 ${
                      task.overdue ? 'border-red-600' : 'border-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id
                                ? { ...t, completed: !t.completed, overdue: false }
                                : t
                            )
                          )
                        }
                        disabled={task.overdue}
                        className={`w-5 h-5 accent-blue-700 ${
                          task.overdue ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                      <div className="flex flex-col">
                        <p
                          className={`text-xl transition-all duration-200 ${
                            task.completed
                              ? 'text-green-600 line-through'
                              : task.overdue
                              ? 'text-gray-500 line-through'
                              : 'text-blue-700'
                          }`}
                        >
                          {task.text}
                        </p>
                        <p
                          className={`text-base ${
                            task.overdue ? 'text-red-700 font-medium' : 'text-blue-800 opacity-70'
                          }`}
                        >
                          (Due: {task.due})
                          {task.overdue && (
                            <span className="text-red-700 ml-2">— Unfinished Task ❌</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {!task.overdue && (
                        <button
                          onClick={() => {
                            setEditingTask(task)
                            setEditText(task.text)
                            setEditDate(task.date)
                            if (task.time) {
                              const [h, m] = task.time.split('.').map(Number)
                              setEditHour(h)
                              setEditMinute(m)
                            } else {
                              setEditHour(null)
                              setEditMinute(null)
                            }
                            setShowEditPopup(true)
                          }}
                          className="hover:opacity-70 transition"
                        >
                          <PencilEdit size={2} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`hover:opacity-70 transition ${task.overdue ? 'text-red-600' : ''}`}
                        title={task.overdue ? 'Delete overdue task' : 'Delete task'}
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

      {showEditPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-[#0D47A1] border-4 border-[#1646A9] text-blue-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-white text-2xl font-bold mb-4">Edit Task ✏️</h2>

            <label className="text-white block text-lg mb-1">Task Name:</label>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border border-blue-400 bg-white rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-white block text-lg mb-1">Date:</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full border border-blue-400 bg-white rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-white block text-lg mb-1">Time:</label>
            <div className="flex justify-between gap-2 mb-6">
              <input
                type="number"
                value={editHour ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  setEditHour(val === '' ? null : Math.min(23, Math.max(0, Number(val))))
                }}
                placeholder="HH"
                className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"
              />
              <input
                type="number"
                value={editMinute ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  setEditMinute(val === '' ? null : Math.min(59, Math.max(0, Number(val))))
                }}
                placeholder="MM"
                className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditPopup(false)}
                className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!editText.trim()) return alert('Task name cannot be empty!');

                  const now = new Date();
                  const today = now.toISOString().split('T')[0];
                  const hasTime = editHour !== null && editMinute !== null;
                  let finalDate = editDate;

                  if (!finalDate && !hasTime) {
                    finalDate = today;
                  }
                  if (hasTime && !finalDate) {
                    const chosenToday = new Date();
                    chosenToday.setHours(editHour, editMinute, 0, 0);
                    if (chosenToday > now) {
                      finalDate = today;
                    } else {
                      return alert("The time has passed, set for another time.");
                    }
                  }

                  if (finalDate) {
                    const chosenDateStart = new Date(`${finalDate}T00:00:00`);
                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    if (chosenDateStart < todayStart) {
                      return alert("⛔ You cannot set tasks for past dates.");
                    }

                    if (finalDate === today && hasTime) {
                      const chosenDateTime = new Date(`${finalDate}T00:00:00`);
                      chosenDateTime.setHours(editHour, editMinute, 0, 0);
                      if (chosenDateTime <= now) {
                        return alert("Invalid time.");
                      }
                    }
                  }

                  const formattedTime = hasTime
                    ? `${String(editHour).padStart(2, '0')}.${String(editMinute).padStart(2, '0')}`
                    : '';
                  let displayDue = '';
                  if (finalDate === today && formattedTime) {
                    displayDue = `Today, ${formattedTime}`;
                  } else if (finalDate === today) {
                    displayDue = 'Today';
                  } else if (formattedTime) {
                    const tomorrow = new Date(now);
                    tomorrow.setDate(now.getDate() + 1);
                    displayDue = tomorrow.toISOString().split('T')[0] === finalDate
                      ? `Tomorrow, ${formattedTime}`
                      : `${finalDate}, ${formattedTime}`;
                  } else {
                    const tomorrow = new Date(now);
                    tomorrow.setDate(now.getDate() + 1);
                    displayDue = tomorrow.toISOString().split('T')[0] === finalDate ? 'Tomorrow' : finalDate;
                  }

                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id !== editingTask.id
                        ? t
                        : {
                            ...t,
                            text: editText,
                            date: finalDate,
                            time: formattedTime,
                            due: displayDue,
                          }
                    )
                  );
                  setShowEditPopup(false);
                }}
                className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="fixed inset-0 flex justify-center items-center text-center bg-black/50 z-50">
          <div className="bg-[#0D47A1] border-4 text-white rounded-2xl p-13 shadow-xl">
            <h2 className="text-xl mb-6 font-semibold">Pick a date</h2>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="border-4 border-[#1646A9] rounded-xl p-7 text-blue-900 bg-white font-medium cursor-pointer focus:outline-none hover:border-blue-800 transition"
              min={todayDate}
            />
            <div className="mt-10 flex justify-end gap-5">
              <button
                onClick={() => setShowCalendar(false)}
                className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedDate(tempDate || '')
                  setShowCalendar(false)
                }}
                className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimer && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-[#0D47A1] border-4 text-white rounded-2xl p-10 shadow-xl flex flex-col items-center">
            <h2 className="text-xl mb-3 font-semibold">Select Time</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setTempHour((h) => (h + 1 > 23 ? 0 : h + 1))}
                  className="text-2xl hover:opacity-70"
                >
                  ▲
                </button>
                <div className="text-4xl font-mono">{String(tempHour).padStart(2, '0')}</div>
                <button
                  onClick={() => setTempHour((h) => (h - 1 < 0 ? 23 : h - 1))}
                  className="text-2xl hover:opacity-70"
                >
                  ▼
                </button>
              </div>
              <span className="text-4xl font-bold">:</span>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setTempMinute((m) => (m + 1 > 59 ? 0 : m + 1))}
                  className="text-2xl hover:opacity-70"
                >
                  ▲
                </button>
                <div className="text-4xl font-mono">{String(tempMinute).padStart(2, '0')}</div>
                <button
                  onClick={() => setTempMinute((m) => (m - 1 < 0 ? 59 : m - 1))}
                  className="text-2xl hover:opacity-70"
                >
                  ▼
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowTimer(false)}
                className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedHour(tempHour)
                  setSelectedMinute(tempMinute)
                  setShowTimer(false)
                }}
                className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
