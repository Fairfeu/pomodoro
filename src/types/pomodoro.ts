export type Phase = 'work' | 'shortBreak' | 'longBreak'

export type TimerStatus = 'idle' | 'running' | 'paused'

export interface PomodoroSettings {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  roundsBeforeLongBreak: number
  soundsEnabled: boolean
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 25,
  roundsBeforeLongBreak: 5,
  soundsEnabled: true,
}

export const PHASE_LABELS: Record<Phase, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}
