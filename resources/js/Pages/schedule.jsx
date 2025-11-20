'use client';

import "../../css/app.css";
import { useState, useEffect } from "react";
import Header from "../components/ui/header";
import { Link } from "@inertiajs/react";
import { PencilEdit, Trash, Logo, TimeClock, CalendarImage } from "../components/ui/attributes";

export default function SchedulePage() {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [startDate, setStartDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupHour, setPopupHour] = useState(null);
  const [popupMinute, setPopupMinute] = useState(null);
  const [tempHour, setTempHour] = useState(today.getHours());
  const [tempMinute, setTempMinute] = useState(today.getMinutes());

  const [editingTask, setEditingTask] = useState(null);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(today);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getWeekDates = (refDate) => {
    const weekDates = [];
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - refDate.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDates.push(d);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(startDate);
  const handleSelect = (d) => setSelectedDate(d);

  const goPrev = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() - 7);
    setStartDate(newStart);
    const newSelected = new Date(selectedDate);
    newSelected.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newSelected);
  };

  const goNext = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 7);
    setStartDate(newStart);
    const newSelected = new Date(selectedDate);
    newSelected.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newSelected);
  };

  useEffect(() => {
    const selectedDateStr = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    const filtered = tasks
      .filter((t) => t.date === selectedDateStr)
      .sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return -1;
        if (!b.time) return 1;
        return parseInt(a.time.replace(".", ""), 10) - parseInt(b.time.replace(".", ""), 10);
      });

    setTasksForSelectedDate(filtered);
  }, [selectedDate, tasks]);

  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      setTasks((prev) =>
        prev.map((task) => {
          if (task.completed) return { ...task, overdue: false };
          if (!task.date) return { ...task, overdue: false };
          const dt = new Date(task.date);
          if (task.time) {
            const [h, m] = task.time.split(".").map(Number);
            dt.setHours(h, m, 0, 0);
          } else dt.setHours(23, 59, 59, 999);
          return { ...task, overdue: now > dt };
        })
      );
    };
    checkOverdue();
    const id = setInterval(checkOverdue, 60000);
    return () => clearInterval(id);
  }, []);

  const toggleComplete = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const openPopup = (task = null) => {
    const now = new Date();

    if (!task && selectedDate < new Date(today.setHours(0, 0, 0, 0))) {
      alert("You cannot add task to a past date");
      return; 
    }

    if (task) {
      setEditingTask(task);
      setPopupText(task.text);
      if (task.time) {
        const [h, m] = task.time.split(".").map(Number);
        setPopupHour(h);
        setPopupMinute(m);
        setTempHour(h);
        setTempMinute(m);
      } else {
        setPopupHour(null);
        setPopupMinute(null);
        setTempHour(today.getHours());
        setTempMinute(today.getMinutes());
      }
    } else {
      setEditingTask(null);
      setPopupText("");
      setPopupHour(null);
      setPopupMinute(null);
      setTempHour(today.getHours());
      setTempMinute(today.getMinutes());
    }
    setShowPopup(true);
  };


  const savePopup = () => {
    if (!popupText.trim()) return alert("Task cannot be empty!");

    const selectedDateStr = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

    const now = new Date();
    if (
      selectedDate.toDateString() === now.toDateString() &&
      popupHour !== null &&
      popupMinute !== null
    ) {
      const chosen = new Date(selectedDate);
      chosen.setHours(popupHour, popupMinute, 0, 0);
      if (chosen <= now) return alert("⛔ Cannot set time in the past for today!");
    }

    const formattedTime =
      popupHour !== null && popupMinute !== null
        ? `${pad(popupHour)}.${pad(popupMinute)}`
        : "";

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? { ...t, text: popupText, time: formattedTime }
          : t
      );
      setTasks(updated);
      localStorage.setItem("tasks", JSON.stringify(updated));
    } else {
      const newTask = {
        id: Date.now(),
        text: popupText,
        date: selectedDateStr,
        time: formattedTime,
        completed: false,
        overdue: false,
      };
      setTasks((prev) => [...prev, newTask]);
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
    }

    setShowPopup(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full justify-start items-center mt-10">
        <div className="flex flex-col w-[90%] items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <p onClick={() => window.history.back()} className="text-white text-6xl font-bold cursor-pointer hover:opacity-80">
              ‹ back
            </p>
            <div className="scale-90 mt-5">
              <Logo size={1.8} />
            </div>
          </div>

          <div className="w-full flex justify-start mb-5 -mt-5">
            <div className="relative w-[50%]">
              <p className="absolute -top-10 left-4 text-white text-2xl font-bold"
                style={{ textShadow: `-2.5px -2.5px 0 #0D277B, 2.5px -2.5px 0 #0D277B, -2.5px  2.5px 0 #0D277B, 2.5px  2.5px 0 #0D277B`}}>
                Your schedule
              </p>
              <p className="absolute -top-10 right-4 text-white text-2xl font-bold cursor-pointer hover:text-blue-300 transition-colors duration-200"
                style={{textShadow: `-2.5px -2.5px 0 #0D277B, 2.5px -2.5px 0 #0D277B, -2.5px  2.5px 0 #0D277B, 2.5px  2.5px 0 #0D277B`}}
                onClick={() => setShowCalendar(true)}>
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>

              <div className="pl-12 pr-12 py-3 rounded-full border border-[#03045E] w-full bg-white/90 font-light flex items-center justify-between relative">
                <button onClick={goPrev} className="px-2 text-3xl hover:opacity-50">
                  ‹
                </button>
                <div className="flex gap-10 text-center">
                  {weekDates.map((d, i) => {
                    const isToday = d.toDateString() === today.toDateString();
                    const isSelected = d.toDateString() === selectedDate.toDateString();
                    const blue = isToday || isSelected;
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleSelect(d)}
                      >
                        <span
                          className={`text-sm font-medium ${
                            blue ? "text-[#1976D2]" : "text-gray-400"
                          }`}
                        >
                          {isToday ? "Today" : daysOfWeek[d.getDay()]}
                        </span>
                        <span
                          className={`text-lg font-semibold w-10 h-10 flex items-center justify-center rounded-full ${
                            isSelected
                              ? "bg-[#1976D2] text-white"
                              : blue
                              ? "text-[#1976D2]"
                              : "text-gray-400"
                          }`}
                        >
                          {d.getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={goNext} className="px-2 text-3xl hover:opacity-50">
                  ›
                </button>
                  <button
                  onClick={() => openPopup()}
                  className="absolute right-[-200px] mt-2 bg-[#1976D2] text-white text-2xl px-5 py-3 rounded-full border-3 border-[#03045E] hover:opacity-80 transition"
                >
                  Add New Task
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full items-start">
            <div
              className="bg-white/90 border-4 border-blue-800 rounded-3xl shadow-xl p-6 overflow-y-auto mr-25"
              style={{ width: "68%", height: "53vh" }}
            >
              <div className="space-y-4">
                {tasksForSelectedDate.length === 0 ? (
                  <p className="text-blue-900 text-center text-xl opacity-70">
                    No task in this schedule.
                  </p>
                ) : (
                  tasksForSelectedDate.map((task) => (
                    <div key={task.id} className="flex items-center group relative min-h-[60px]">
                      <div className="flex flex-col items-center justify-center mr-3">
                        <span className="text-blue-900 text-lg font-normal w-12 text-center">
                          {task.time || "-"}
                        </span>
                      </div>
                      <div
                        className={`border-l-8 rounded-r-2xl shadow-md p-3 flex-grow flex justify-between items-center relative
                          ${task.completed
                            ? "bg-blue-50/90 border-green-600"
                            : task.overdue
                            ? "bg-blue-50/90 border-red-600"
                            : "bg-blue-50/90 border-blue-800"}`}>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-lg font-normal ${
                              task.completed || task.overdue ? "line-through" : "text-blue-900"
                            } ${task.completed ? "text-green-600" : task.overdue ? "text-red-600" : "text-blue-900"}`}>
                            {task.text}
                          </p>
                          {task.overdue && (
                            <span className="text-red-600 font-normal">— Unfinished Task ❌</span>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          {!task.overdue && (
                            <button
                              onClick={() => openPopup(task)}
                              className="hover:opacity-70 text-blue-600"
                            >
                              <PencilEdit size={2} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const updated = tasks.filter((t) => t.id !== task.id);
                              setTasks(updated);
                              localStorage.setItem("tasks", JSON.stringify(updated));
                            }}
                            className="hover:opacity-70 text-red-600"
                          >
                            <Trash size={2} />
                          </button>
                        </div>
                      </div>

                      <div className="ml-3 w-7 h-7 flex justify-center items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task.id)}
                          disabled={task.overdue} 
                          className={`w-7 h-7 accent-blue-700 ${task.overdue ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className="bg-white/90 border-4 border-blue-800 rounded-3xl shadow-xl p-6 mt-[-108px]"
              style={{ width: "30%", height: "64vh" }}
            >
              <div className="flex flex-col items-center w-full h-full">
                <p className="text-white text-3xl font-bold mb-8 mt-6"
                  style={{textShadow: `-2px -2px 0 #0D277B, 2px -2px 0 #0D277B, -2px  2px 0 #0D277B, 2px  2px 0 #0D277B` }}>
                  Daily Progress
                </p>

                {(() => {
                  const total = tasksForSelectedDate.length;
                  const done = tasksForSelectedDate.filter(t => t.completed).length;
                  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

                  return (
                    <>
                      <div className="h-10 flex items-center justify-center">
                        {percent === 100 && (
                          <p className="text-blue-900 font-size font-semibold animate-pulse text-center text-[20px]">
                            Amazing, you have done all the works! 🎉
                          </p>
                        )}
                      </div>
                      <div className="flex-grow flex items-center justify-center w-full">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg className="absolute inset-0" viewBox="0 0 36 36">
                            <path
                              className="text-blue-200"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="none"
                              d="
                                M18 2
                                a 16 16 0 1 1 0 32
                                a 16 16 0 1 1 0 -32
                              "
                            />
                          </svg>
                          <svg
                            className="absolute inset-0 transform -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <path
                              className="text-[#3063BA] transition-all duration-500"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="none"
                              strokeDasharray="100"
                              strokeDashoffset={100 - percent}
                              d="
                                M18 2
                                a 16 16 0 1 1 0 32
                                a 16 16 0 1 1 0 -32
                              "
                            />
                          </svg>
                          <span className="text-blue-900 text-3xl font-bold">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full text-blue-900 text-lg space-y-2 mt-4">
                        <p><strong>Total Tasks:</strong> {total}</p>
                        <p><strong>Completed:</strong> {done}</p>
                        <p><strong>Remaining:</strong> {total - done}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white border-4 text-[#0D47A1] p-4 rounded-2xl shadow-xl w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <select
                value={calendarMonth.getMonth()}
                onChange={(e) => {
                  const newDate = new Date(calendarMonth);
                  newDate.setMonth(parseInt(e.target.value));
                  setCalendarMonth(newDate);
                }}
                className="border px-2 py-1 rounded"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>

              <select
                value={calendarMonth.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(calendarMonth);
                  newDate.setFullYear(parseInt(e.target.value));
                  setCalendarMonth(newDate);
                }}
                className="border px-2 py-1 rounded"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = today.getFullYear() - 5 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center font-bold">{d}</div>
              ))}

              {Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate() }, (_, i) => {
                const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i + 1);
                const isSelected = date.toDateString() === calendarMonth.toDateString();
                return (
                  <div
                    key={i}
                    className={`text-center cursor-pointer hover:bg-blue-200 rounded ${
                      isSelected ? "bg-blue-300 font-bold" : ""
                    }`}
                    onClick={() => setCalendarMonth(date)}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70 mr-3"
                onClick={() => setShowCalendar(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70"
                onClick={() => {
                  setSelectedDate(calendarMonth);
                  setStartDate(calendarMonth);
                  setShowCalendar(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-[#0D47A1] border-4 border-[#1646A9] text-blue-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-white text-2xl font-bold mb-4">
              {editingTask ? "Edit Task ✏️" : "Add Task ➕"}
            </h2>
            <label className="text-white block text-lg mb-1">Enter Task:</label>
            <input
              type="text"
              value={popupText}
              onChange={(e) => setPopupText(e.target.value)}
              className="w-full border border-blue-400 bg-white rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-white block text-lg mb-1">Time:</label>
            <div className="flex justify-between gap-2 mb-6">
              <input
                type="number"
                value={popupHour ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setPopupHour(val === "" ? null : Math.min(23, Math.max(0, Number(val))));
                }}
                placeholder="HH"
                className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"
              />
              <input
                type="number"
                value={popupMinute ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setPopupMinute(val === "" ? null : Math.min(59, Math.max(0, Number(val))));
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
  );
}
