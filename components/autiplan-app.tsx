'use client'

import { useEffect, useState } from 'react'
import { BrainCircuit, HelpCircle, AlertCircle, Wand2 } from 'lucide-react'
import type { LessonPlan, PlanInput, SavedPlan } from '@/lib/types'
import { LessonForm } from '@/components/lesson-form'
import { LessonPlanOutput } from '@/components/lesson-plan-output'
import { SavedPlansSidebar } from '@/components/saved-plans-sidebar'
import { InfoModal } from '@/components/info-modal'

const STORAGE_KEY = 'autiplan.saved-plans'

export function AutiPlanApp() {
  const [infoOpen, setInfoOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null)
  const [currentInput, setCurrentInput] = useState<PlanInput | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])

  // Load saved plans from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSavedPlans(JSON.parse(raw))
    } catch {
      // ignore malformed storage
    }
  }, [])

  const persist = (plans: SavedPlan[]) => {
    setSavedPlans(plans)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
    } catch {
      // ignore quota errors
    }
  }

  const handleGenerate = async (input: PlanInput) => {
    setIsLoading(true)
    setError(null)
    setActiveId(null)
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to generate plan.')
      setCurrentPlan(data.plan as LessonPlan)
      setCurrentInput(input)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setCurrentPlan(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!currentPlan || !currentInput) return
    const saved: SavedPlan = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      input: currentInput,
      plan: currentPlan,
    }
    persist([saved, ...savedPlans])
    setActiveId(saved.id)
  }

  const handleOpen = (saved: SavedPlan) => {
    setCurrentPlan(saved.plan)
    setCurrentInput(saved.input)
    setActiveId(saved.id)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    persist(savedPlans.filter((p) => p.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const isSaved = activeId !== null && savedPlans.some((p) => p.id === activeId)

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/70 backdrop-blur-sm no-print">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BrainCircuit className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-heading text-lg font-extrabold leading-tight text-foreground sm:text-xl">
                AutiPlan
              </h1>
              <p className="text-xs text-muted-foreground">
                Adaptive Lesson Planner for Autistic Children
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <HelpCircle className="size-4 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">How it works</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_18rem]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-secondary/40 px-5 py-5 no-print sm:px-6">
            <h2 className="font-heading text-xl font-extrabold text-balance text-foreground sm:text-2xl">
              Build a calm, structured lesson in moments
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
              Tell us about the child and the session. AutiPlan crafts a sensory-friendly plan with
              clear steps, accommodations, and a gentle cool-down for teachers, therapists, and
              parents.
            </p>
          </section>

          <LessonForm onGenerate={handleGenerate} isLoading={isLoading} />

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3.5 text-sm text-destructive no-print"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {currentPlan && currentInput ? (
            <LessonPlanOutput
              plan={currentPlan}
              input={currentInput}
              onSave={handleSave}
              isSaved={isSaved}
            />
          ) : (
            !error && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center no-print">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Wand2 className="size-6" aria-hidden="true" />
                </span>
                <p className="font-heading text-base font-bold text-foreground">
                  Your lesson plan will appear here
                </p>
                <p className="max-w-sm text-sm text-muted-foreground text-pretty">
                  Fill in the details above and generate a tailored, sensory-friendly plan.
                </p>
              </div>
            )
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start no-print">
          <SavedPlansSidebar
            plans={savedPlans}
            activeId={activeId}
            onOpen={handleOpen}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  )
}
