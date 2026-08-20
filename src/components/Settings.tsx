import { useEffect, useState } from 'react'
import type { PomodoroSettings, TimerStatus } from '../types/pomodoro'

interface SettingsProps {
  settings: PomodoroSettings
  status: TimerStatus
  onChange: (settings: Partial<PomodoroSettings>) => void
}

interface SettingFieldProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit?: string
  disabled: boolean
  onChange: (value: number) => void
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)))
}

function SettingField({
  id,
  label,
  value,
  min,
  max,
  unit = 'min',
  disabled,
  onChange,
}: SettingFieldProps) {
  const [draft, setDraft] = useState(String(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) {
      setDraft(String(value))
    }
  }, [value, focused])

  const commit = () => {
    const trimmed = draft.trim()

    if (trimmed === '') {
      setDraft(String(value))
      return
    }

    const parsed = Number(trimmed)
    if (Number.isNaN(parsed)) {
      setDraft(String(value))
      return
    }

    const next = clampValue(parsed, min, max)
    onChange(next)
    setDraft(String(next))
  }

  return (
    <label className="setting-field" htmlFor={id}>
      <span className="setting-field__label">{label}</span>
      <div className="setting-field__input-wrap">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={draft}
          disabled={disabled}
          onChange={(e) => {
            const next = e.target.value
            if (next === '' || /^\d+$/.test(next)) {
              setDraft(next)
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            commit()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }
          }}
        />
        {unit && <span className="setting-field__unit">{unit}</span>}
      </div>
    </label>
  )
}

export function Settings({ settings, status, onChange }: SettingsProps) {
  const disabled = status === 'running'

  return (
    <section className="settings" aria-labelledby="settings-heading">
      <h2 id="settings-heading">Settings</h2>
      {disabled && <p className="settings__hint">Pause the timer to edit settings.</p>}

      <label className="setting-toggle">
        <input
          type="checkbox"
          checked={settings.soundsEnabled}
          disabled={disabled}
          onChange={(e) => onChange({ soundsEnabled: e.target.checked })}
        />
        <span>Sound alerts</span>
      </label>

      <div className="settings__grid">
        <SettingField
          id="work-minutes"
          label="Focus time"
          value={settings.workMinutes}
          min={1}
          max={120}
          disabled={disabled}
          onChange={(v) => onChange({ workMinutes: v })}
        />
        <SettingField
          id="short-break-minutes"
          label="Short break"
          value={settings.shortBreakMinutes}
          min={1}
          max={60}
          disabled={disabled}
          onChange={(v) => onChange({ shortBreakMinutes: v })}
        />
        <SettingField
          id="long-break-minutes"
          label="Long break"
          value={settings.longBreakMinutes}
          min={1}
          max={120}
          disabled={disabled}
          onChange={(v) => onChange({ longBreakMinutes: v })}
        />
        <SettingField
          id="rounds-before-long"
          label="Rounds before long break"
          value={settings.roundsBeforeLongBreak}
          min={1}
          max={10}
          unit="rounds"
          disabled={disabled}
          onChange={(v) => onChange({ roundsBeforeLongBreak: v })}
        />
      </div>
    </section>
  )
}
