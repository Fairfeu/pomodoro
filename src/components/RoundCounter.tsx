interface RoundCounterProps {
  currentRound: number
  totalRounds: number
  completedPomodoros: number
  onResetCount: () => void
  disabled: boolean
}

export function RoundCounter({
  currentRound,
  totalRounds,
  completedPomodoros,
  onResetCount,
  disabled,
}: RoundCounterProps) {
  return (
    <section className="round-counter" aria-label="Pomodoro round statistics">
      <div className="round-counter__card">
        <span className="round-counter__label">Current cycle</span>
        <strong className="round-counter__value">
          Round {currentRound} / {totalRounds}
        </strong>
      </div>

      <div className="round-counter__card round-counter__card--total">
        <span className="round-counter__label">Completed pomodoros</span>
        <strong className="round-counter__value">
          <span aria-hidden="true">🍅</span> {completedPomodoros}
        </strong>
        <button
          type="button"
          className="round-counter__reset"
          onClick={onResetCount}
          disabled={disabled || completedPomodoros === 0}
          title="Reset completed count"
        >
          Reset count
        </button>
      </div>
    </section>
  )
}
