import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/ui/header';
import { Logo } from '../components/ui/attributes';

const formatTime = (time) => String(time).padStart(2, '0');

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

  useEffect(() => {
    if (isCounting) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          let newSeconds = prev - 1;
          let newMinutes = minutes;
          if (newSeconds < 0) {
            if (minutes > 0) {
              newMinutes = minutes - 1;
              newSeconds = 59;
              setMinutes(newMinutes);
            } else {
              clearInterval(timerRef.current);
              setIsCounting(false);
              setIsTimeUp(true);
              return 0;
            }
          }
          return newSeconds;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isCounting, minutes]);

  const handleStart = () => {
    const currentMin = parseInt(inputMinutes, 10) || 0;
    const currentSec = parseInt(inputSeconds, 10) || 0;
    if (currentMin === 0 && currentSec === 0) {
      alert('Please set a time greater than zero!');
      return;
    }
    setMinutes(currentMin);
    setSeconds(currentSec);
    setIsCounting(true);
    setIsTimeUp(false);
  };

  const handleRestart = () => {
    setIsTimeUp(false);
    setMinutes(parseInt(inputMinutes, 10) || 0);
    setSeconds(parseInt(inputSeconds, 10) || 0);
    setIsCounting(false);
  };

  const renderTimerContent = () => {
    const timeDisplay = `${formatTime(minutes)}:${formatTime(seconds)}`;
    let title = '';
    let buttonLabel = '';
    let buttonAction = null;
    let buttonStyle = '';

    if (isTimeUp) {
      title = 'Time is up!';
      buttonLabel = 'Restart';
      buttonAction = handleRestart;
      buttonStyle = 'bg-[#1976D2]';
    } else if (isCounting) {
      title = 'Time Left:';
      buttonLabel = 'Pause';
      buttonAction = () => setIsCounting(false);
      buttonStyle = 'bg-orange-600';
    } else {
      title = 'Set Your Time!';
      buttonLabel = 'Start!';
      buttonAction = handleStart;
      buttonStyle = 'bg-[#1976D2]';
    }

    return (
      <div className="flex flex-col justify-between h-full w-full">
        <div className="text-4xl font-semibold text-blue-800 text-center">{title}</div>
        {!isCounting && !isTimeUp ? (
          <div className="flex items-center justify-center gap-4 text-8xl font-black text-blue-900">
            <input
              type="number"
              value={formatTime(inputMinutes)}
              onChange={(e) => setInputMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
              min="0"
              max="99"
              className="w-38 text-center bg-white border-4 border-blue-800 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-blue-500"
            />
            <span className="text-blue-900">:</span>
            <input
              type="number"
              value={formatTime(inputSeconds)}
              onChange={(e) => setInputSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              min="0"
              max="59"
              className="w-38 text-center bg-white border-4 border-blue-800 rounded-lg p-2 focus:outline-none focus:ring-4 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div className="text-8xl font-black text-center text-blue-900">{timeDisplay}</div>
        )}
        <div className="flex justify-center mt-6">
          <button
            onClick={buttonAction}
            className={`${buttonStyle} text-white px-8 py-3 rounded-xl text-2xl font-bold border-2 border-blue-900 shadow-lg hover:opacity-90 transition duration-200`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header role="user" />

      <div className="flex flex-col w-full h-full justify-start items-center mt-10">
        <div className="flex flex-col w-[90%] items-center">
          <div className="w-full flex justify-between items-center">
            <p onClick={() => window.history.back()} className="text-white text-6xl font-bold cursor-pointer hover:opacity-80">‹ back</p>
            <div className="scale-90 mt-5"><Logo size={1.8} /></div>
          </div>

          <div
            className="flex flex-col items-center justify-center bg-white/90 border-4 border-blue-800 rounded-3xl shadow-2xl"
            style={{
              height: '60%',
              width: '30%',
              minHeight: '400px',
              maxHeight: '600px',
              padding: '40px',
              boxSizing: 'border-box',
            }}
          >
            {renderTimerContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
