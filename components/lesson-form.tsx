'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import type { PlanInput } from '@/lib/types'

const SENSORY_OPTIONS = [
  'Sensitive to loud sounds',
  'Visual learner',
  'Needs tactile stimulation',
  'Avoids bright lights',
  'Seeks movement / proprioceptive input',
  'Prefers predictable routines',
  'Sensitive to certain textures',
  'Needs frequent breaks',
]

const FOCUS_AREAS = [
  'Social Skills',
  'Motor Skills',
  'Communication',
  'Emotional Regulation',
  'Sensory Integration',
  'Daily Living Skills',
]

const DURATIONS = ['15 mins', '30 mins', '45 mins', '60 mins']

const THEMES = [
  'Outdoor exploration',
  'Arts & Crafts',
  'Storytelling',
  'Music & Movement',
  'Cooking / Food play',
  'Water play',
  'Building & Construction',
]

interface LessonFormProps {
  onGenerate: (input: PlanInput) => void
  isLoading: boolean
}

export function LessonForm({ onGenerate, isLoading }: LessonFormProps) {
  const [ageGrade, setAgeGrade] = useState('')
  const [sensory, setSensory] = useState<string[]>([])
  const [focusArea, setFocusArea] = useState(FOCUS_AREAS[0])
  const [duration, setDuration] = useState(DURATIONS[1])
  const [theme, setTheme] = useState(THEMES[0])

  const toggleSensory = (value: string) => {
    setSensory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ageGrade.trim() || isLoading) return
    onGenerate({
      ageGrade: ageGrade.trim(),
      sensoryProfile: sensory.join(', '),
      focusArea,
      duration,
      theme,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-5">
        {/* Age / Grade */}
        <div className="flex flex-col gap-2">
          <label htmlFor="ageGrade" className="font-heading text-sm font-bold text-foreground">
            Child&apos;s Age / Grade Level
          </label>
          <input
            id="ageGrade"
            type="text"
            required
            value={ageGrade}
            onChange={(e) => setAgeGrade(e.target.value)}
            placeholder="e.g. 6 years old / Grade 1"
            className="h-11 rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>

        {/* Sensory Profile */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-heading text-sm font-bold text-foreground">
            Sensory Profile
          </legend>
          <p className="mb-1 text-xs text-muted-foreground">
            Select everything that applies. Accommodations will be tailored to these.
          </p>
          <div className="flex flex-wrap gap-2">
            {SENSORY_OPTIONS.map((option) => {
              const active = sensory.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleSensory(option)}
                  className={
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ' +
                    (active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground')
                  }
                >
                  {option}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Focus Area */}
          <SelectField
            id="focusArea"
            label="Focus Area"
            value={focusArea}
            onChange={setFocusArea}
            options={FOCUS_AREAS}
          />
          {/* Duration */}
          <SelectField
            id="duration"
            label="Activity Duration"
            value={duration}
            onChange={setDuration}
            options={DURATIONS}
          />
        </div>

        {/* Theme */}
        <SelectField
          id="theme"
          label="Main Activity Theme"
          value={theme}
          onChange={setTheme}
          options={THEMES}
        />

        <button
          type="submit"
          disabled={isLoading || !ageGrade.trim()}
          className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Generating plan…
            </>
          ) : (
            <>
              <Sparkles className="size-5" aria-hidden="true" />
              Generate Lesson Plan
            </>
          )}
        </button>
      </div>
    </form>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

function SelectField({ id, label, value, onChange, options }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-heading text-sm font-bold text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
