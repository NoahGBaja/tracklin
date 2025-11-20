// resources/js/Pages/Timer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../components/ui/header'; 

// Fungsi helper untuk memformat angka menjadi "00"
const formatTime = (time) => {
  return String(time).padStart(2, '0');
};

const Timer = () => {
  const defaultMinutes = 1;
  const defaultSeconds = 0;
  
  const [inputMinutes, setInputMinutes] = useState(defaultMinutes);
  const [inputSeconds, setInputSeconds] = useState(defaultSeconds);
  const [minutes, setMinutes] = useState(defaultMinutes); 
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isCounting, setIsCounting] = useState(false); 
  const [isTimeUp, setIsTimeUp] = useState(false); 

  const timerRef = useRef(null); 

  
  // LOGIKA COUNTDOWN
  useEffect(() => {
    if (isCounting) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          let newSeconds = prevSeconds - 1;
          let newMinutes = minutes;

          if (newSeconds < 0) {
            if (minutes > 0) {
              newMinutes = minutes - 1;
              newSeconds = 59;
              setMinutes(newMinutes);
            } else {
              // Waktu Habis!
              clearInterval(timerRef.current);
              setIsCounting(false);
              setIsTimeUp(true);
              return 0; 
            }
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isCounting, minutes]); 

  // Handler Tombol START
  const handleStart = () => {
    const currentMin = parseInt(inputMinutes, 10) || 0;
    const currentSec = parseInt(inputSeconds, 10) || 0;
    
    if (currentSec > 59) {
      currentSec = 59;
    }

    if (currentMin === 0 && currentSec === 0) {
        alert('Please set a time greater than zero!');
        return; 
    }

    setMinutes(currentMin);
    setSeconds(currentSec);

    setIsCounting(true);
    setIsTimeUp(false);
  };

  // Handler Tombol RESTART
  const handleRestart = () => {
    setIsTimeUp(false);
    setMinutes(parseInt(inputMinutes, 10) || 0); 
    setSeconds(parseInt(inputSeconds, 10) || 0); 
    setIsCounting(false);
  };
  
  const renderTimerDisplay = () => {
    const timeDisplay = `${formatTime(minutes)}:${formatTime(seconds)}`;
    let title;
    let button;
    let content;

    if (isTimeUp) {
      title = 'Time is up!';
      button = (
        <button className="bg-[#1976D2] text-white px-8 py-3 rounded-xl text-2xl font-bold border-2 border-blue-900 shadow-lg hover:opacity-90 transition duration-200" onClick={handleRestart}>
          Restart
        </button>
      );
      content = <div className="text-8xl font-black text-red-600 tracking-wide">{timeDisplay}</div>;

    } else if (isCounting) {
      title = 'Time Left:'; 
      button = (
        <button className="bg-orange-600 text-white px-8 py-3 rounded-xl text-2xl font-bold border-2 border-orange-900 shadow-lg hover:opacity-90 transition duration-200" onClick={() => setIsCounting(false)}>
          Pause
        </button>
      );
      content = <div className="text-8xl font-black text-blue-900 tracking-wide">{timeDisplay}</div>;

    } else {
      title = 'Set Your Time!';
      button = (
        <button className="bg-[#1976D2] text-white px-8 py-3 rounded-xl text-2xl font-bold border-2 border-blue-900 shadow-lg hover:opacity-90 transition duration-200" onClick={handleStart}>
          Start!
        </button>
      );
      
      content = (
        <div className="flex items-center gap-4 text-8xl font-black text-blue-900"> 
          <input
            type="number"
            value={formatTime(inputMinutes)}
            onChange={(e) => setInputMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
            min="0"
            max="99"
            className="w-32 text-center bg-white border-4 border-blue-800 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-blue-500"
          />
          <span className="text-blue-900">:</span>
          <input
            type="number"
            value={formatTime(inputSeconds)}
            onChange={(e) => setInputSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            min="0"
            max="59"
            className="w-32 text-center bg-white border-4 border-blue-800 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-blue-500"
          />
        </div>
      );
    }
    
    return (
        <>
          <div className="text-4xl font-semibold text-blue-800 mb-6">
            {title}
          </div>
          {content}
          <div className="mt-8">
            {button}
          </div>
        </>
      );
  };
  
  return (
    // Wrapper Full Screen menggunakan class kustom untuk background gambar
    <div className="fixed inset-0 flex flex-col timer-background"> 
      <Header role="user" />

      <div className="flex flex-col w-full h-full justify-start items-center pt-12">
        <div className="w-[90%] flex justify-between items-center mb-6">
        <Link href="/home">
            <span className="text-white text-6xl font-bold cursor-pointer hover:opacity-80">
              ‹ back
            </span>
          </Link>
        </div>
        
        {/* Konten Timer di dalam Card */}
        <div className="flex flex-col items-center justify-center bg-white/95 border-4 border-blue-800 rounded-3xl p-10 shadow-2xl" style={{ height: '60vh', width: '400px' }}>
          {renderTimerDisplay()}
        </div>

      </div>
    </div>
  );
};

export default Timer;