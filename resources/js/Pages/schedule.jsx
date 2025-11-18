'use client'

import '../../css/app.css'
import { useState, useEffect } from 'react'
import Header from '../components/ui/header'
import { Link } from '@inertiajs/react'
import { PencilEdit, Trash, TimeClock, Calendar, Logo } from '../components/ui/attributes'

export default function SchedulePage() {
  const today = new Date()
  const [startDate, setStartDate] = useState(today)     
  const [selectedDate, setSelectedDate] = useState(today) 

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getWeekDates = (refDate) => {
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(refDate)
      const currentDay = d.getDay()
      const diff = i - currentDay
      d.setDate(d.getDate() + diff)
      weekDates.push(d)
    }
    return weekDates
  }

  const weekDates = getWeekDates(startDate)

  const handleSelect = (d) => {
    setSelectedDate(d)
  }

  const goPrev = () => {
    const newStart = new Date(startDate)
    newStart.setDate(newStart.getDate() - 7)
    setStartDate(newStart)

    const newSelected = new Date(selectedDate)
    newSelected.setDate(newSelected.getDate() - 7)
    setSelectedDate(newSelected)
  }

  const goNext = () => {
    const newStart = new Date(startDate)
    newStart.setDate(newStart.getDate() + 7)
    setStartDate(newStart)

    const newSelected = new Date(selectedDate)
    newSelected.setDate(newSelected.getDate() + 7)
    setSelectedDate(newSelected)
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full justify-start items-center mt-10">
        <div className="flex flex-col w-[90%] items-center">

          <div className="w-full flex justify-between items-center mb-4">
            <p onClick={() => window.history.back()}
              className="text-white text-6xl font-bold cursor-pointer hover:opacity-80">
              ‹ back
            </p>
  
            <div className="scale-90 mt-5">
              <Logo size={1.8} />
            </div>
          </div>

          {/* DATE BAR */}
          <div className="w-full flex justify-start mb-4 -mt-2">
            <div className="relative w-[55%]">
              <div className="pl-4 pr-24 py-3 text-xl rounded-full border border-[#03045E] w-full bg-white/90 font-light flex items-center justify-between">
                
                <button onClick={goPrev} className="px-2 text-3xl hover:opacity-70">‹</button>

                <div className="flex gap-10 text-center">
                  {weekDates.map((d, i) => {
                    const isToday = d.toDateString() === today.toDateString()
                    const isSelected = d.toDateString() === selectedDate.toDateString()
                    const showBlue = isToday || isSelected

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handleSelect(d)}
                      >
                        <span className={`text-sm font-medium ${showBlue ? 'text-blue-500' : 'text-gray-400'}`}>
                          {isToday ? 'Today' : daysOfWeek[i]}
                        </span>

                        <span className={`text-lg font-semibold w-8 h-8 flex items-center justify-center rounded-full
                          ${isSelected ? 'bg-blue-500 text-white' : showBlue ? 'text-blue-500' : 'text-gray-400'}
                        `}>
                          {d.getDate()}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <button onClick={goNext} className="px-2 text-3xl hover:opacity-70">›</button>
              </div>
            </div>
          </div>

          <div className="flex w-full items-start">
            <div 
              className="bg-white/90 border-4 border-blue-800 rounded-3xl shadow-xl p-6"
              style={{ width: '55%', height: '53vh' }}
            >
              <p className="text-blue-900 text-center text-xl opacity-70">
                Schedule will appear here...
              </p>
            </div>

            <div className="flex items-end mx-4" style={{ height: '55vh' }}>
              <button className=" mb-5 w-14 h-14 rounded-full bg-[#1976D2] text-white text-5xl flex items-center justify-center border-4 border-[#03045E] shadow-xl hover:opacity-80 transition">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}