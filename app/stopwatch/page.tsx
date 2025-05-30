"use client";
import { useRef, useState } from "react";
import "./style.scss";

export default function StopwatchPage() {
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const firstFun = () => {
    if (timer && isRunning) {
      setIsRunning(false);
      if (timerId.current !== null) {
        clearInterval(timerId.current);
      }
    } else {
      setIsRunning(true);
      timerId.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
  };
  const resetTimer = () => {
    if (timerId.current !== null) {
      clearInterval(timerId.current);
    }
    setTimer(0);
  };
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const minPrint = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secPrint = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return (
    <div className="stopwatch">
      <div className="display">
        <h3>
          {minPrint}:{secPrint}
        </h3>
      </div>
      <div className="controls">
        <button
          onClick={() => {
            firstFun();
          }}
        >
          Start / Pause
        </button>
        <button
          onClick={() => {
            resetTimer();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
