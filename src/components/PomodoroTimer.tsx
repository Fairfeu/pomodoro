import { usePomodoro } from "../hooks/usePomodoro";
import { Controls } from "./Controls";
import { RoundCounter } from "./RoundCounter";
import { Settings } from "./Settings";
import { TimerDisplay } from "./TimerDisplay";

export function PomodoroTimer() {
  const {
    phase,
    currentRound,
    completedPomodoros,
    secondsLeft,
    progress,
    status,
    settings,
    start,
    pause,
    reset,
    skip,
    setSettings,
    resetCompletedCount,
  } = usePomodoro();

  return (
    <div className="pomodoro">
      <header className="pomodoro__header">
        <div className="pomodoro__logo" aria-hidden="true">
          🍅
        </div>
        <h1>Pomodoro</h1>
        <p className="pomodoro__tagline">Focus. Rest. Repeat — endlessly.</p>
      </header>

      <RoundCounter
        currentRound={currentRound}
        totalRounds={settings.roundsBeforeLongBreak}
        completedPomodoros={completedPomodoros}
        onResetCount={resetCompletedCount}
        disabled={status === "running"}
      />

      <TimerDisplay
        phase={phase}
        secondsLeft={secondsLeft}
        progress={progress}
        currentRound={currentRound}
        totalRounds={settings.roundsBeforeLongBreak}
      />

      <Controls
        status={status}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />

      <Settings settings={settings} status={status} onChange={setSettings} />
    </div>
  );
}
