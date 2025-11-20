'use client'

import '../../css/app.css'
import { useState, useEffect } from 'react'
import Header from '../components/ui/header'
import { Link } from '@inertiajs/react'
import { PencilEdit, Trash, TimeClock, Calendar, Logo } from '../components/ui/attributes'

export default function ToDoList() {
  const localDateString = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  const parseYMD = (ymd) => { if(!ymd) return null; const [y,m,d] = ymd.split('-').map(Number); return new Date(y,m-1,d) }
  const startOfDay = (d) => new Date(d.getFullYear(),d.getMonth(),d.getDate())
  const pad = (n) => String(n).padStart(2,'0')
  const buildFormattedTime = (hour,minute) => (hour===null||minute===null?'':`${pad(hour)}.${pad(minute)}`)
  const todayDate = localDateString(new Date())

  const [tasks,setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [input,setInput] = useState('')
  const [selectedDate,setSelectedDate] = useState('')
  const [selectedHour,setSelectedHour] = useState(null)
  const [selectedMinute,setSelectedMinute] = useState(null)
  const [tempDate,setTempDate] = useState('')
  const [tempHour,setTempHour] = useState(0)
  const [tempMinute,setTempMinute] = useState(0)
  const [showCalendar,setShowCalendar] = useState(false)
  const [showTimer,setShowTimer] = useState(false)
  const [editingTask,setEditingTask] = useState(null)
  const [editText,setEditText] = useState('')
  const [editDate,setEditDate] = useState('')
  const [editHour,setEditHour] = useState(null)
  const [editMinute,setEditMinute] = useState(null)
  const [showEditPopup,setShowEditPopup] = useState(false)

  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)) }, [tasks])

  const validateAndBuildTask = ({text,dateStr,hour,minute,now=new Date()}) => {
    if(!text.trim()) return {error:'Task name cannot be empty!'}
    const today = localDateString(now)
    const hasTime = hour!==null && minute!==null
    let finalDate = dateStr || ''

    if(!finalDate && !hasTime) finalDate = today
    if(hasTime && !finalDate){
      const chosenToday=new Date(now.getFullYear(),now.getMonth(),now.getDate())
      chosenToday.setHours(hour,minute,0,0)
      if(chosenToday<=now) return {error:'⛔ The time has passed, set for another time.'}
      finalDate = today
    }

    if(finalDate){
      const chosenStart=parseYMD(finalDate)
      const todayStart=startOfDay(now)
      if(chosenStart<todayStart) return {error:'⛔ You cannot set tasks for past dates.'}
      if(finalDate===today && hasTime){
        const chosenDateTime=parseYMD(finalDate)
        chosenDateTime.setHours(hour,minute,0,0)
        if(chosenDateTime<=now) return {error:'⛔ The time has passed, set for another time.'}
      }
    }

    const formattedTime = hasTime?buildFormattedTime(hour,minute):''
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate()+1)
    const tomorrowDate = localDateString(tomorrow)
    let displayDue='', alertMessage=''
    if(finalDate===today && formattedTime) displayDue=`Today, ${formattedTime}`
    else if(finalDate===today) displayDue='Today'
    else if(finalDate===tomorrowDate && formattedTime){ displayDue=`Tomorrow, ${formattedTime}`; alertMessage=`✅ Your task is moved to tomorrow at ${formattedTime}` }
    else if(finalDate===tomorrowDate){ displayDue='Tomorrow'; alertMessage='✅ Your task is moved to tomorrow' }
    else if(formattedTime){ displayDue=`${finalDate}, ${formattedTime}`; alertMessage=`✅ Your task is moved to ${finalDate} at ${formattedTime}` }
    else{ displayDue=finalDate; alertMessage=`✅ Your task is moved to ${finalDate}` }
    return { task:{text,date:finalDate,time:formattedTime,due:displayDue,completed:false,overdue:false}, alertMessage }
  }

  const addTask = () => {
    const {error,task,alertMessage} = validateAndBuildTask({text:input,dateStr:selectedDate,hour:selectedHour,minute:selectedMinute})
    if(error) return alert(error)
    setTasks(prev=>[...prev,{...task,id:Date.now()}])
    if(alertMessage) alert(alertMessage)
    setInput(''); setSelectedDate(''); setSelectedHour(null); setSelectedMinute(null)
    setTempDate(''); setTempHour(0); setTempMinute(0); setShowCalendar(false); setShowTimer(false)
  }

  const deleteTask = (id) => setTasks(prev=>prev.filter(t=>t.id!==id))
  const saveEdit = () => {
    const {error,task,alertMessage} = validateAndBuildTask({text:editText,dateStr:editDate,hour:editHour,minute:editMinute})
    if(error) return alert(error)
    setTasks(prev=>prev.map(t=>t.id!==editingTask.id?t:{...t,...task}))
    if(alertMessage) alert(alertMessage)
    setShowEditPopup(false)
  }

  useEffect(()=>{
    const check=()=>{
      const now=new Date()
      setTasks(prev=>prev.map(task=>{
        if(task.completed) return {...task,overdue:false}
        if(!task.date) return {...task,overdue:false}
        const dt=parseYMD(task.date)
        if(task.time){ const [h,m]=task.time.split('.').map(Number); dt.setHours(h,m,0,0) } else dt.setHours(23,59,59,999)
        return {...task,overdue:now>dt}
      }))
    }
    check()
    const id=setInterval(check,60000)
    return ()=>clearInterval(id)
  },[])

  const handleCalendarClick = () => { setTempDate(selectedDate||''); setShowCalendar(true) }
  const handleTimeClick = () => { const now=new Date(); setTempHour(selectedHour??now.getHours()); setTempMinute(selectedMinute??now.getMinutes()); setShowTimer(true) }

  const todayTasks = tasks
    .filter(t => t.date === todayDate)
    .sort((a, b) => {
      if (!a.time && b.time) return -1;
      if (a.time && !b.time) return 1;
      return 0; 
    })
    .map(t => ({
      ...t,
      due: t.time ? `Today, ${t.time}` : 'Today'
    }));

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col w-full h-full justify-start items-center mt-10">
          <div className="flex flex-col w-[90%] items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <p onClick={() => window.history.back()} className="text-white text-6xl font-bold cursor-pointer hover:opacity-80">‹ back</p>
              <div className="scale-90 mt-5"><Logo size={1.8} /></div>
            </div>

            <div className="flex flex-wrap w-full justify-start items-center gap-3 mb-4 -mt-2">
              <div className="relative w-[50%]">
                <p className="text-white absolute -top-15 left-4 text-4xl"
                  style={{textShadow: `-2.5px -2.5px 0 #0D277B, 2.5px -2.5px 0 #0D277B, -2.5px  2.5px 0 #0D277B, 2.5px  2.5px 0 #0D277B`}}>
                  Today's to-do-list:
                </p>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a task..."
                  className="pl-4 pr-24 py-3 text-xl rounded-full border border-[#03045E] w-full bg-white/90 text-blue-900 font-light focus:outline-none placeholder:opacity-60"
                />
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button onClick={handleTimeClick} className="w-8 h-8 flex justify-center items-center hover:opacity-75 transition" title="Set time"><TimeClock size={2} /></button>
                  <button onClick={handleCalendarClick} className="w-8 h-8 flex justify-center items-center hover:opacity-75 transition" title="Set date"><Calendar size={2} /></button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addTask} className="bg-[#1976D2] text-white px-5 py-3 rounded-full text-xl border-3 border-[#03045E] hover:opacity-80 transition">Add Task</button>
                <Link href="/schedule" className="bg-[#78B3F0] text-white px-5 py-3 rounded-full text-xl border-3 border-[#03045E] hover:opacity-80 transition">See Schedule</Link>
              </div>
            </div>

            <div className="flex flex-col w-full bg-white/90 border-4 border-blue-800 rounded-3xl p-6 overflow-y-auto shadow-xl" style={{ height: '55vh' }}>
              {todayTasks.length === 0 ? (
                <p className="text-blue-900 text-center text-xl opacity-70">No tasks for today!</p>
              ) : (
                todayTasks.map((task) => (
                  <div key={task.id} className={`group flex justify-between items-center px-4 py-3 mb-3 bg-white rounded-2xl border transition-all duration-300 ${task.overdue ? 'border-red-600' : 'border-blue-700'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: !t.completed, overdue: false } : t))}
                        disabled={task.overdue}
                        className={`w-5 h-5 accent-blue-700 ${task.overdue ? 'opacity-80 cursor-not-allowed' : ''}`}
                      />
                      <div className="flex flex-col">
                        <p className={`text-xl transition-all duration-200 ${task.completed ? 'text-green-600 line-through' : task.overdue ? 'text-gray-500 line-through' : 'text-blue-700'}`}>{task.text}</p>
                        <p className={`text-base ${task.overdue ? 'text-red-700 font-medium' : 'text-blue-800 opacity-70'}`}>
                          (Due: {task.due})
                          {task.overdue && <span className="text-red-700 ml-2">— Unfinished Task ❌</span>}
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
                        ><PencilEdit size={2} /></button>
                      )}
                      <button onClick={() => deleteTask(task.id)} className={`hover:opacity-70 transition ${task.overdue ? 'text-red-600' : ''}`} title={task.overdue ? 'Delete overdue task' : 'Delete task'}><Trash size={2} /></button>
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
            <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full border border-blue-400 bg-white rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <label className="text-white block text-lg mb-1">Date:</label>
            <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full border border-blue-400 bg-white rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" min={todayDate}/>
            <label className="text-white block text-lg mb-1">Time:</label>
            <div className="flex justify-between gap-2 mb-6">
              <input type="number" value={editHour ?? ''} onChange={(e) => {
                const val = e.target.value
                setEditHour(val === '' ? null : Math.min(23, Math.max(0, Number(val))))
              }} placeholder="HH" className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"/>
              <input type="number" value={editMinute ?? ''} onChange={(e) => {
                const val = e.target.value
                setEditMinute(val === '' ? null : Math.min(59, Math.max(0, Number(val))))
              }} placeholder="MM" className="bg-white w-1/2 border border-blue-400 rounded-xl p-2 text-blue-800"/>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditPopup(false)} className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70">Cancel</button>
              <button onClick={saveEdit} className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70">Save</button>
            </div>
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="fixed inset-0 flex justify-center items-center text-center bg-black/50 z-50">
          <div className="bg-[#0D47A1] border-4 text-white rounded-2xl p-13 shadow-xl">
            <h2 className="text-xl mb-6 font-semibold">Pick a date</h2>
            <input type="date" value={tempDate} onChange={(e) => setTempDate(e.target.value)} className="border-4 border-[#1646A9] rounded-xl p-7 text-blue-900 bg-white font-medium cursor-pointer focus:outline-none hover:border-blue-800 transition" min={todayDate}/>
            <div className="mt-10 flex justify-end gap-5">
              <button onClick={() => setShowCalendar(false)} className="bg-[#1646A9] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70">Cancel</button>
              <button onClick={() => { setSelectedDate(tempDate || ''); setShowCalendar(false) }} className="bg-[#1976D2] text-white border-2 px-4 py-2 rounded-xl hover:opacity-70">Confirm</button>
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
                <button onClick={() => setTempHour((h) => (h + 1) % 24)} className="text-3xl font-bold hover:opacity-70">▲</button>
                <span className="text-2xl">{pad(tempHour)}</span>
                <button onClick={() => setTempHour((h) => (h + 23) % 24)} className="text-3xl font-bold hover:opacity-70">▼</button>
              </div>
              <span className="text-3xl">:</span>
              <div className="flex flex-col items-center">
                <button onClick={() => setTempMinute((m) => (m + 1) % 60)} className="text-3xl font-bold hover:opacity-70">▲</button>
                <span className="text-2xl">{pad(tempMinute)}</span>
                <button onClick={() => setTempMinute((m) => (m + 59) % 60)} className="text-3xl font-bold hover:opacity-70">▼</button>
              </div>
            </div>
            <div className="flex gap-5 mt-5">
              <button onClick={() => setShowTimer(false)} className="bg-[#1646A9] text-white border-2 px-5 py-2 rounded-xl hover:opacity-70">Cancel</button>
              <button onClick={() => { setSelectedHour(tempHour); setSelectedMinute(tempMinute); setShowTimer(false) }} className="bg-[#1976D2] text-white border-2 px-5 py-2 rounded-xl hover:opacity-70">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
