import type { Phase } from '../types/pomodoro'
import { PHASE_LABELS } from '../types/pomodoro'

interface TimerDisplayProps {
  phase: Phase
  secondsLeft: number
  progress: number
  currentRound: number
  totalRounds: number
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerDisplay({
  phase,
  secondsLeft,
  progress,
  currentRound,
  totalRounds,
}: TimerDisplayProps) {
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`timer-display timer-display--${phase}`}>
      <svg className="timer-ring" viewBox="0 0 280 280" aria-hidden="true">
        <circle className="timer-ring__track" cx="140" cy="140" r={radius} />
        <circle
          className="timer-ring__progress"
          cx="140"
          cy="140"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="timer-display__content">
        <span className="timer-display__phase">{PHASE_LABELS[phase]}</span>
        <span className="timer-display__time" aria-live="polite">
          {formatTime(secondsLeft)}
        </span>
        <div className="timer-display__rounds" aria-label={`Round ${currentRound} of ${totalRounds}`}>
          {Array.from({ length: totalRounds }, (_, i) => (
            <span
              key={i}
              className={`round-dot ${i < currentRound ? 'round-dot--active' : ''} ${
                phase === 'work' && i + 1 === currentRound ? 'round-dot--current' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
