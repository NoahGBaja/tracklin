import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/ui/header';
import { Logo } from '../components/ui/attributes';

const STORAGE_KEY = 'tracklin_timer_state';

const formatTime = (time) => String(time).padStart(2, '0');
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

const DigitColumn = ({ value, onInc, onDec }) => (
  <div className="flex flex-col items-center mx-2">
    <button
      type="button"
      onClick={onInc}
      className="text-3xl md:text-4xl leading-none select-none hover:opacity-80"
    >
      ▲
    </button>
    <div
      className="text-[3rem] md:text-[4rem] font-black text-white text-center min-w-[3ch]"
      style={{ lineHeight: 1 }}
    >
      {formatTime(value)}
    </div>
    <button
      type="button"
      onClick={onDec}
      className="text-3xl md:text-4xl leading-none select-none hover:opacity-80"
    >
      ▼
    </button>
  </div>
);

const Timer = () => {
  const defaultHours = 0;
  const defaultMinutes = 1;
  const defaultSeconds = 0;

  const [inputHours, setInputHours] = useState(defaultHours);
  const [inputMinutes, setInputMinutes] = useState(defaultMinutes);
  const [inputSeconds, setInputSeconds] = useState(defaultSeconds);

  const defaultTotalSeconds =
    defaultHours * 3600 + defaultMinutes * 60 + defaultSeconds;

  const [initialSeconds, setInitialSeconds] = useState(defaultTotalSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultTotalSeconds);

  const [isCounting, setIsCounting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());

  const [toast, setToast] = useState(null); 
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);

      const savedInputHours = saved.inputHours ?? defaultHours;
      const savedInputMinutes = saved.inputMinutes ?? defaultMinutes;
      const savedInputSeconds = saved.inputSeconds ?? defaultSeconds;

      let initSec = saved.initialSeconds ?? defaultTotalSeconds;
      let remSec = saved.remainingSeconds ?? initSec;
      let counting = !!saved.isCounting;
      let timeUp = !!saved.isTimeUp;
      const savedLast = saved.lastUpdatedAt ?? Date.now();

      if (counting && !timeUp && remSec > 0) {
        const now = Date.now();
        const elapsedSec = Math.floor((now - savedLast) / 1000);
        remSec = remSec - elapsedSec;

        if (remSec <= 0) {
          remSec = 0;
          counting = false;
          timeUp = true;
          setToast({ type: 'success', message: 'Time is up!' });
        }
      }

      setInputHours(savedInputHours);
      setInputMinutes(savedInputMinutes);
      setInputSeconds(savedInputSeconds);

      setInitialSeconds(initSec);
      setRemainingSeconds(remSec);
      setIsCounting(counting);
      setIsTimeUp(timeUp);
      setLastUpdatedAt(Date.now());
    } catch (e) {
      console.error('Failed to parse timer state', e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const payload = {
      inputHours,
      inputMinutes,
      inputSeconds,
      initialSeconds,
      remainingSeconds,
      isTimeUp,
      isCounting,
      lastUpdatedAt,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    inputHours,
    inputMinutes,
    inputSeconds,
    initialSeconds,
    remainingSeconds,
    isTimeUp,
    isCounting,
    lastUpdatedAt,
  ]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!isCounting) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsCounting(false);
          setIsTimeUp(true);
          setLastUpdatedAt(Date.now());
          setToast({ type: 'success', message: 'Time is up!' });
          return 0;
        }
        const next = prev - 1;
        setLastUpdatedAt(Date.now());
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCounting]);

  const formatFromSeconds = (total) => {
    const h = Math.floor(total / 3600);
    const rem = total % 3600;
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    return `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`;
  };

  const handleStart = () => {
    const h = clamp(parseInt(inputHours, 10) || 0, 0, 23);
    const m = clamp(parseInt(inputMinutes, 10) || 0, 0, 59);
    const s = clamp(parseInt(inputSeconds, 10) || 0, 0, 59);

    const total = h * 3600 + m * 60 + s;

    if (total === 0) {
      setToast({ type: 'error', message: 'Please set a time greater than zero!' });
      return;
    }

    setInitialSeconds(total);
    setRemainingSeconds(total);
    setIsCounting(true);
    setIsTimeUp(false);
    setLastUpdatedAt(Date.now());
    setToast(null);
  };

  const handlePause = () => {
    setIsCounting(false);
    setLastUpdatedAt(Date.now());
  };

  const handleResume = () => {
    if (remainingSeconds <= 0) return;
    setIsCounting(true);
    setIsTimeUp(false);
    setLastUpdatedAt(Date.now());
  };

  const handleReset = () => {
    setRemainingSeconds(initialSeconds);
    setIsCounting(false);
    setIsTimeUp(false);
    setLastUpdatedAt(Date.now());
    setToast(null);
  };

  const handleRestart = () => {
    setRemainingSeconds(initialSeconds);
    setIsCounting(false);
    setIsTimeUp(false);
    setLastUpdatedAt(Date.now());
    setToast(null);
  };

  const incHours = () => setInputHours((prev) => clamp(prev + 1, 0, 23));
  const decHours = () => setInputHours((prev) => clamp(prev - 1, 0, 23));

  const incMinutes = () => setInputMinutes((prev) => clamp(prev + 1, 0, 59));
  const decMinutes = () => setInputMinutes((prev) => clamp(prev - 1, 0, 59));

  const incSeconds = () => setInputSeconds((prev) => clamp(prev + 1, 0, 59));
  const decSeconds = () => setInputSeconds((prev) => clamp(prev - 1, 0, 59));

  const setupDisplay = `${formatTime(inputHours)}:${formatTime(
    inputMinutes,
  )}:${formatTime(inputSeconds)}`;
  const runningDisplay = formatFromSeconds(remainingSeconds);

  const isSetupState =
    !isCounting && !isTimeUp && remainingSeconds === initialSeconds;

  const isPausedState =
    !isCounting &&
    !isTimeUp &&
    remainingSeconds > 0 &&
    remainingSeconds < initialSeconds;

  const renderTimerContent = () => {
    let title = '';
    let primaryLabel = '';
    let primaryAction = null;
    let primaryStyle = '';
    let showResetButton = false;

    if (isTimeUp) {
      title = 'Time is up!';
      primaryLabel = 'Restart';
      primaryAction = handleRestart;
      primaryStyle = 'bg-[#1976D2]';
    } else if (isCounting) {
      title = 'Time Left!';
      primaryLabel = 'Pause';
      primaryAction = handlePause;
      primaryStyle = 'bg-orange-600';
    } else if (isPausedState) {
      title = 'Paused';
      primaryLabel = 'Resume';
      primaryAction = handleResume;
      primaryStyle = 'bg-[#1976D2]';
      showResetButton = true;
    } else {
      title = 'Set Your Time!';
      primaryLabel = 'Start!';
      primaryAction = handleStart;
      primaryStyle = 'bg-[#1976D2]';
    }

    return (
      <div className="flex flex-col items-center justify-between h-full w-full">
        <div className="text-3xl md:text-4xl font-semibold text-white text-center mb-4 px-4">
          {title}
        </div>

        {isSetupState ? (
          <div className="flex items-center justify-center text-white mt-2 mb-4">
            <DigitColumn value={inputHours} onInc={incHours} onDec={decHours} />
            <span className="text-[3rem] md:text-[4rem] font-black mx-1 md:mx-2">
              :
            </span>
            <DigitColumn
              value={inputMinutes}
              onInc={incMinutes}
              onDec={decMinutes}
            />
            <span className="text-[3rem] md:text-[4rem] font-black mx-1 md:mx-2">
              :
            </span>
            <DigitColumn
              value={inputSeconds}
              onInc={incSeconds}
              onDec={decSeconds}
            />
          </div>
        ) : (
          <div className="text-[3.5rem] md:text-[4.5rem] font-black text-center text-white mb-6 px-4">
            {runningDisplay}
          </div>
        )}

        <div className="flex justify-center mt-2 gap-4">
          <button
            onClick={primaryAction}
            className={`${primaryStyle} text-white px-8 py-3 rounded-full text-2xl font-bold border-2 border-blue-900 shadow-lg hover:opacity-90 transition duration-200`}
          >
            {primaryLabel}
          </button>

        {isPausedState && (
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-6 py-3 rounded-full text-xl font-semibold border-2 border-blue-900 shadow-lg hover:opacity-90 transition duration-200"
          >
            Reset
          </button>
        )}
        </div>

        {isSetupState && (
          <div className="mt-3 text-sm text-blue-100 opacity-70">
            Current setting: {setupDisplay}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header role="user" />

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-[90%] flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
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

          <div
            className="flex flex-col items-center justify-center rounded-[40px] shadow-2xl border-4 border-blue-800 bg-[#001b5e]/80 backdrop-blur-md"
            style={{
              width: '40%',
              minWidth: '420px',
              maxWidth: '520px',
              minHeight: '360px',
              maxHeight: '520px',
              padding: '40px',
              boxSizing: 'border-box',
            }}
          >
            {renderTimerContent()}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white/95 border border-blue-300 shadow-lg rounded-xl px-4 py-3 text-sm md:text-base text-blue-900 max-w-xs">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Timer;
