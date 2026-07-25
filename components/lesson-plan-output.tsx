'use client'

import {
  Target,
  Package,
  HeartHandshake,
  ListChecks,
  Wind,
  Printer,
  BookmarkPlus,
  Check,
} from 'lucide-react'
import type { LessonPlan, PlanInput } from '@/lib/types'

interface LessonPlanOutputProps {
  plan: LessonPlan
  input: PlanInput
  onSave: () => void
  isSaved: boolean
}

export function LessonPlanOutput({ plan, input, onSave, isSaved }: LessonPlanOutputProps) {
  const tags = [input.ageGrade, input.focusArea, input.duration, input.theme].filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2 no-print">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaved}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-70"
        >
          {isSaved ? (
            <>
              <Check className="size-4 text-primary" aria-hidden="true" /> Saved
            </>
          ) : (
            <>
              <BookmarkPlus className="size-4" aria-hidden="true" /> Save Plan
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Printer className="size-4" aria-hidden="true" /> Print / Download PDF
        </button>
      </div>

      <article
        id="printable-plan"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <header className="border-b border-border bg-secondary/40 px-6 py-5">
          <p className="font-heading text-xs font-bold uppercase tracking-wide text-secondary-foreground">
            AutiPlan Lesson Plan
          </p>
          <h2 className="mt-1 font-heading text-2xl font-extrabold text-balance text-foreground">
            {plan.title}
          </h2>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="flex flex-col gap-7 px-6 py-6">
          <Section icon={<Target className="size-5" />} title="Objective">
            <p className="leading-relaxed text-foreground">{plan.objective}</p>
          </Section>

          <Section icon={<Package className="size-5" />} title="Materials Needed">
            <BulletList items={plan.materials} />
          </Section>

          <Section icon={<HeartHandshake className="size-5" />} title="Sensory Accommodations">
            <BulletList items={plan.sensoryAccommodations} accent />
          </Section>

          <Section icon={<ListChecks className="size-5" />} title="Step-by-Step Activity">
            <ol className="flex flex-col gap-3">
              {plan.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-heading font-bold text-foreground">{step.title}</p>
                    <p className="leading-relaxed text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section icon={<Wind className="size-5" />} title="Cool-down / Transition Strategy">
            <BulletList items={plan.coolDown} accent />
          </Section>
        </div>
      </article>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="flex items-center gap-2 font-heading text-lg font-extrabold text-foreground">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h3>
      <div className="pl-1 text-sm">{children}</div>
    </section>
  )
}

function BulletList({ items, accent }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 leading-relaxed text-foreground">
          <span
            className={
              'mt-2 size-1.5 shrink-0 rounded-full ' + (accent ? 'bg-secondary-foreground' : 'bg-primary')
            }
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
