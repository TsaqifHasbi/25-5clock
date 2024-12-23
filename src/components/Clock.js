import React, { useState, useEffect, useRef } from 'react';

const Clock = () => {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 0) {
                        const audio = document.getElementById('beep');
                        audio.currentTime = 0; // Rewind to the start
                        audio.play();
                        if (isSession) {
                            setIsSession(false);
                            return breakLength * 60;
                        } else {
                            setIsSession(true);
                            return sessionLength * 60;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (!isRunning && timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, breakLength, sessionLength, isSession]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setIsSession(true);
        const audio = document.getElementById('beep');
        audio.pause();
        audio.currentTime = 0;
    };

    const handleIncrement = (type) => {
        if (type === 'break' && breakLength < 60) {
            setBreakLength(breakLength + 1);
        } else if (type === 'session' && sessionLength < 60) {
            setSessionLength(sessionLength + 1);
            if (isSession) {
                setTimeLeft((sessionLength + 1) * 60);
            }
        }
    };

    const handleDecrement = (type) => {
        if (type === 'break' && breakLength > 1) {
            setBreakLength(breakLength - 1);
        } else if (type === 'session' && sessionLength > 1) {
            setSessionLength(sessionLength - 1);
            if (isSession) {
                setTimeLeft((sessionLength - 1) * 60);
            }
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div id="clock">
            <div id="break-label">Break Length</div>
            <div id="session-label">Session Length</div>
            <button id="break-decrement" onClick={() => handleDecrement('break')}>-</button>
            <button id="break-increment" onClick={() => handleIncrement('break')}>+</button>
            <div id="break-length">{breakLength}</div>
            <button id="session-decrement" onClick={() => handleDecrement('session')}>-</button>
            <button id="session-increment" onClick={() => handleIncrement('session')}>+</button>
            <div id="session-length">{sessionLength}</div>
            <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
            <div id="time-left">{formatTime(timeLeft)}</div>
            <button id="start_stop" onClick={handleStartStop}>Start/Stop</button>
            <button id="reset" onClick={handleReset}>Reset</button>
            <audio id="beep" preload="auto" src="https://www.soundjay.com/button/beep-09.wav"></audio>
        </div>
    );
};

export default Clock;