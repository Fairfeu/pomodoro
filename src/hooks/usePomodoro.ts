// import { useCallback, useEffect, useRef, useState } from 'react'
// import {
//   DEFAULT_SETTINGS,
//   type Phase,
//   type PomodoroSettings,
//   type TimerStatus,
// } from '../types/pomodoro'
// import { initAudio, playRestStartSound, playWorkCompleteSound } from '../utils/sounds'

// const SETTINGS_KEY = 'pomodoro-settings'
// const COMPLETED_KEY = 'pomodoro-completed-count'

// function loadSettings(): PomodoroSettings {
//   try {
//     const stored = localStorage.getItem(SETTINGS_KEY)
//     if (stored) {
//       return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
//     }
//   } catch {
//     /* ignore */
//   }
//   return DEFAULT_SETTINGS
// }

// function loadCompletedCount(): number {
//   try {
//     const stored = localStorage.getItem(COMPLETED_KEY)
//     if (stored) return Math.max(0, Number(JSON.parse(stored)) || 0)
//   } catch {
//     /* ignore */
//   }
//   return 0
// }

// function minutesToSeconds(minutes: number) {
//   const parsed = Number(minutes)
//   if (!Number.isFinite(parsed)) return 60
//   return Math.max(1, Math.round(parsed * 60))
// }

// function getPhaseDuration(phase: Phase, settings: PomodoroSettings) {
//   switch (phase) {
//     case 'work':
//       return minutesToSeconds(settings.workMinutes)
//     case 'shortBreak':
//       return minutesToSeconds(settings.shortBreakMinutes)
//     case 'longBreak':
//       return minutesToSeconds(settings.longBreakMinutes)
//   }
// }

// interface AdvanceOptions {
//   autoStart?: boolean
//   countWorkRound?: boolean
//   playSounds?: boolean
// }

// export function usePomodoro() {
//   const [settings, setSettingsState] = useState<PomodoroSettings>(loadSettings)
//   const [phase, setPhase] = useState<Phase>('work')
//   const [currentRound, setCurrentRound] = useState(1)
//   const [completedPomodoros, setCompletedPomodoros] = useState(loadCompletedCount)
//   const [secondsLeft, setSecondsLeft] = useState(() =>
//     minutesToSeconds(DEFAULT_SETTINGS.workMinutes),
//   )
//   const [status, setStatus] = useState<TimerStatus>('idle')

//   const intervalRef = useRef<number | null>(null)
//   const completingRef = useRef(false)
//   const phaseRef = useRef(phase)
//   const currentRoundRef = useRef(currentRound)
//   const settingsRef = useRef(settings)
//   const statusRef = useRef(status)

//   phaseRef.current = phase
//   currentRoundRef.current = currentRound
//   settingsRef.current = settings
//   statusRef.current = status

//   const clearTimer = useCallback(() => {
//     if (intervalRef.current !== null) {
//       window.clearInterval(intervalRef.current)
//       intervalRef.current = null
//     }
//   }, [])

//   const persistCompletedCount = useCallback((count: number) => {
//     localStorage.setItem(COMPLETED_KEY, JSON.stringify(count))
//   }, [])

//   const applyPhase = useCallback((nextPhase: Phase, nextRound: number, autoStart: boolean) => {
//     const activeSettings = settingsRef.current
//     setPhase(nextPhase)
//     setCurrentRound(nextRound)
//     setSecondsLeft(getPhaseDuration(nextPhase, activeSettings))
//     setStatus(autoStart ? 'running' : 'idle')
//   }, [])

//   const advancePhase = useCallback((options: AdvanceOptions = {}) => {
//     const { autoStart = true, countWorkRound = false, playSounds = true } = options
//     const activePhase = phaseRef.current
//     const activeRound = currentRoundRef.current
//     const activeSettings = settingsRef.current
//     const soundsOn = playSounds && activeSettings.soundsEnabled

//     if (activePhase === 'work') {
//       if (countWorkRound) {
//         setCompletedPomodoros((prev) => {
//           const next = prev + 1
//           persistCompletedCount(next)
//           return next
//         })
//       }

//       if (soundsOn) {
//         playWorkCompleteSound(true)
//       }

//       const nextPhase: Phase =
//         activeRound >= activeSettings.roundsBeforeLongBreak ? 'longBreak' : 'shortBreak'

//       if (soundsOn) {
//         window.setTimeout(() => playRestStartSound(true), 450)
//       }

//       applyPhase(nextPhase, activeRound, autoStart)
//       return
//     }

//     if (activePhase === 'shortBreak') {
//       applyPhase('work', activeRound + 1, autoStart)
//       return
//     }

//     applyPhase('work', 1, autoStart)
//   }, [applyPhase, persistCompletedCount])

//   const completeCurrentPhase = useCallback(() => {
//     if (completingRef.current) return

//     completingRef.current = true
//     clearTimer()

//     const activePhase = phaseRef.current
//     advancePhase({
//       autoStart: true,
//       countWorkRound: activePhase === 'work',
//       playSounds: true,
//     })
//   }, [advancePhase, clearTimer])

//   useEffect(() => {
//     if (secondsLeft > 0) {
//       completingRef.current = false
//     }
//   }, [secondsLeft, phase])

//   useEffect(() => {
//     if (status !== 'running') {
//       clearTimer()
//       return
//     }

//     intervalRef.current = window.setInterval(() => {
//       setSecondsLeft((prev) => {
//         if (prev <= 1) {
//           window.setTimeout(() => {
//             if (statusRef.current === 'running') {
//               completeCurrentPhase()
//             }
//           }, 0)
//           return 0
//         }
//         return prev - 1
//       })
//     }, 1000)

//     return clearTimer
//   }, [status, clearTimer, completeCurrentPhase])

//   const start = useCallback(() => {
//     initAudio()
//     setSecondsLeft((prev) => {
//       if (prev > 0) return prev
//       return getPhaseDuration(phaseRef.current, settingsRef.current)
//     })
//     setStatus('running')
//   }, [])

//   const pause = useCallback(() => {
//     clearTimer()
//     setStatus('paused')
//   }, [clearTimer])

//   const reset = useCallback(() => {
//     clearTimer()
//     completingRef.current = false
//     setPhase('work')
//     setCurrentRound(1)
//     setSecondsLeft(getPhaseDuration('work', settingsRef.current))
//     setStatus('idle')
//   }, [clearTimer])

//   const skip = useCallback(() => {
//     clearTimer()
//     completingRef.current = false
//     advancePhase({
//       autoStart: statusRef.current === 'running' || statusRef.current === 'paused',
//       countWorkRound: phaseRef.current === 'work',
//       playSounds: true,
//     })
//   }, [advancePhase, clearTimer])

//   const resetCompletedCount = useCallback(() => {
//     setCompletedPomodoros(0)
//     persistCompletedCount(0)
//   }, [persistCompletedCount])

//   const setSettings = useCallback((next: Partial<PomodoroSettings>) => {
//     setSettingsState((prev) => {
//       const merged = { ...prev, ...next }
//       localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
//       return merged
//     })
//   }, [])

//   const phaseDurationKey =
//     phase === 'work'
//       ? settings.workMinutes
//       : phase === 'shortBreak'
//         ? settings.shortBreakMinutes
//         : settings.longBreakMinutes

//   useEffect(() => {
//     if (statusRef.current === 'running') return
//     setSecondsLeft(getPhaseDuration(phase, settings))
//   }, [phase, phaseDurationKey, settings])

//   const totalSeconds = getPhaseDuration(phase, settings)
//   const progress =
//     totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0

//   return {
//     phase,
//     currentRound,
//     completedPomodoros,
//     secondsLeft,
//     totalSeconds,
//     progress,
//     status,
//     settings,
//     start,
//     pause,
//     reset,
//     skip,
//     setSettings,
//     resetCompletedCount,
//   }
// }

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  type Phase,
  type PomodoroSettings,
  type TimerStatus,
} from "../types/pomodoro";
import {
  initAudio,
  playRestStartSound,
  playWorkCompleteSound,
} from "../utils/sounds";

const SETTINGS_KEY = "pomodoro-settings";
const COMPLETED_KEY = "pomodoro-completed-count";

function loadSettings(): PomodoroSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

function loadCompletedCount(): number {
  try {
    const stored = localStorage.getItem(COMPLETED_KEY);
    if (stored) return Math.max(0, Number(JSON.parse(stored)) || 0);
  } catch {
    /* ignore */
  }
  return 0;
}

function minutesToSeconds(minutes: number) {
  const parsed = Number(minutes);
  if (!Number.isFinite(parsed)) return 60;
  return Math.max(1, Math.round(parsed * 60));
}

function getPhaseDuration(phase: Phase, settings: PomodoroSettings) {
  switch (phase) {
    case "work":
      return minutesToSeconds(settings.workMinutes);
    case "shortBreak":
      return minutesToSeconds(settings.shortBreakMinutes);
    case "longBreak":
      return minutesToSeconds(settings.longBreakMinutes);
  }
}

interface AdvanceOptions {
  autoStart?: boolean;
  countWorkRound?: boolean;
  playSounds?: boolean;
}

export function usePomodoro() {
  const loadedSettings = loadSettings();

  const [settings, setSettingsState] =
    useState<PomodoroSettings>(loadedSettings);
  const [phase, setPhase] = useState<Phase>("work");
  const [currentRound, setCurrentRound] = useState(1);
  const [completedPomodoros, setCompletedPomodoros] =
    useState(loadCompletedCount);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getPhaseDuration("work", loadedSettings),
  );
  const [status, setStatus] = useState<TimerStatus>("idle");

  const intervalRef = useRef<number | null>(null);
  const completingRef = useRef(false);
  const phaseRef = useRef(phase);
  const currentRoundRef = useRef(currentRound);
  const settingsRef = useRef(settings);
  const statusRef = useRef(status);

  phaseRef.current = phase;
  currentRoundRef.current = currentRound;
  settingsRef.current = settings;
  statusRef.current = status;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const persistCompletedCount = useCallback((count: number) => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(count));
  }, []);

  const applyPhase = useCallback(
    (nextPhase: Phase, nextRound: number, autoStart: boolean) => {
      const activeSettings = settingsRef.current;
      setPhase(nextPhase);
      setCurrentRound(nextRound);
      setSecondsLeft(getPhaseDuration(nextPhase, activeSettings));
      setStatus(autoStart ? "running" : "idle");
    },
    [],
  );

  const advancePhase = useCallback(
    (options: AdvanceOptions = {}) => {
      const {
        autoStart = true,
        countWorkRound = false,
        playSounds = true,
      } = options;
      const activePhase = phaseRef.current;
      const activeRound = currentRoundRef.current;
      const activeSettings = settingsRef.current;
      const soundsOn = playSounds && activeSettings.soundsEnabled;

      if (activePhase === "work") {
        if (countWorkRound) {
          setCompletedPomodoros((prev) => {
            const next = prev + 1;
            persistCompletedCount(next);
            return next;
          });
        }

        if (soundsOn) {
          playWorkCompleteSound(true);
        }

        const nextPhase: Phase =
          activeRound >= activeSettings.roundsBeforeLongBreak
            ? "longBreak"
            : "shortBreak";

        if (soundsOn) {
          window.setTimeout(() => playRestStartSound(true), 450);
        }

        applyPhase(nextPhase, activeRound, autoStart);
        return;
      }

      if (activePhase === "shortBreak") {
        applyPhase("work", activeRound + 1, autoStart);
        return;
      }

      applyPhase("work", 1, autoStart);
    },
    [applyPhase, persistCompletedCount],
  );

  const completeCurrentPhase = useCallback(() => {
    if (completingRef.current) return;

    completingRef.current = true;
    clearTimer();

    const activePhase = phaseRef.current;
    advancePhase({
      autoStart: true,
      countWorkRound: activePhase === "work",
      playSounds: true,
    });

    completingRef.current = false;
  }, [advancePhase, clearTimer]);

  useEffect(() => {
    if (status !== "running") {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.setTimeout(() => {
            if (statusRef.current === "running") {
              completeCurrentPhase();
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [status, phase, clearTimer, completeCurrentPhase]); // <-- added 'phase' to dependencies

  const start = useCallback(() => {
    initAudio();
    setSecondsLeft((prev) => {
      if (prev > 0) return prev;
      return getPhaseDuration(phaseRef.current, settingsRef.current);
    });
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setStatus("paused");
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    completingRef.current = false;
    setPhase("work");
    setCurrentRound(1);
    setSecondsLeft(getPhaseDuration("work", settingsRef.current));
    setStatus("idle");
  }, [clearTimer]);

  const skip = useCallback(() => {
    clearTimer();
    completingRef.current = false;
    const wasRunning = statusRef.current === "running";
    advancePhase({
      autoStart: wasRunning,
      countWorkRound: phaseRef.current === "work",
      playSounds: true,
    });
  }, [advancePhase, clearTimer]);

  const resetCompletedCount = useCallback(() => {
    setCompletedPomodoros(0);
    persistCompletedCount(0);
  }, [persistCompletedCount]);

  const setSettings = useCallback(
    (next: Partial<PomodoroSettings>) => {
      setSettingsState((prev) => {
        const merged = { ...prev, ...next };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));

        const newDuration = getPhaseDuration(phaseRef.current, merged);
        const oldDuration = getPhaseDuration(phaseRef.current, prev);

        if (statusRef.current !== "running") {
          setSecondsLeft(newDuration);
        } else {
          if (oldDuration > 0 && newDuration > 0) {
            const proportion = Math.min(secondsLeft / oldDuration, 1);
            const newSeconds = Math.max(
              1,
              Math.round(proportion * newDuration),
            );
            setSecondsLeft(Math.min(newSeconds, newDuration));
          } else {
            setSecondsLeft(newDuration);
          }
        }

        return merged;
      });
    },
    [secondsLeft],
  );

  const totalSeconds = getPhaseDuration(phase, settings);
  const progress =
    totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return {
    phase,
    currentRound,
    completedPomodoros,
    secondsLeft,
    totalSeconds,
    progress,
    status,
    settings,
    start,
    pause,
    reset,
    skip,
    setSettings,
    resetCompletedCount,
  };
}
