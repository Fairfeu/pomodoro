import type { TimerStatus } from '../types/pomodoro'

interface ControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

export function Controls({ status, onStart, onPause, onReset, onSkip }: ControlsProps) {
  const isRunning = status === 'running'

  return (
    <div className="controls">
      <button
        type="button"
        className="btn btn--primary"
        onClick={isRunning ? onPause : onStart}
      >
        {isRunning ? 'Pause' : status === 'paused' ? 'Resume' : 'Start'}
      </button>
      <button type="button" className="btn btn--secondary" onClick={onReset}>
        Reset
      </button>
      <button type="button" className="btn btn--ghost" onClick={onSkip}>
        Skip
      </button>
    </div>
  )
}
