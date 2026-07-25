'use client'

import { useEffect } from 'react'
import { X, Info, ListChecks, HeartHandshake, Printer } from 'lucide-react'

interface InfoModalProps {
  open: boolean
  onClose: () => void
}

export function InfoModal({ open, onClose }: InfoModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-start justify-between border-b border-border bg-secondary/40 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Info className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="info-title" className="font-heading text-lg font-extrabold text-foreground">
                How AutiPlan works
              </h2>
              <p className="text-xs text-muted-foreground">Sensory-friendly planning, made simple</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-6">
          <Step
            icon={<ListChecks className="size-5" />}
            title="1. Describe the child"
            text="Enter the age/grade, sensory profile, focus area, session length, and an activity theme. The more detail you add, the more tailored the plan."
          />
          <Step
            icon={<HeartHandshake className="size-5" />}
            title="2. Generate a tailored plan"
            text="AutiPlan creates a structured plan with an objective, materials, sensory accommodations, step-by-step instructions, and a calming cool-down."
          />
          <Step
            icon={<Printer className="size-5" />}
            title="3. Save, print, or share"
            text="Save plans to revisit later, or print/download them as a PDF to use in the classroom, clinic, or at home."
          />

          <div className="rounded-xl border border-border bg-accent/50 p-4">
            <h3 className="font-heading text-sm font-bold text-accent-foreground">
              Why sensory-friendly planning matters
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              Autistic children process sensory input differently. Plans that anticipate sensory
              needs — reducing overwhelm, offering predictable structure, and building in regulation
              breaks — help children stay calm, engaged, and ready to learn. AutiPlan is a starting
              point to support, not replace, your professional judgment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
