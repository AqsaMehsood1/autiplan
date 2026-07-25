'use client'

import { BookmarkCheck, Trash2, FileText } from 'lucide-react'
import type { SavedPlan } from '@/lib/types'

interface SavedPlansSidebarProps {
  plans: SavedPlan[]
  activeId: string | null
  onOpen: (plan: SavedPlan) => void
  onDelete: (id: string) => void
}

export function SavedPlansSidebar({ plans, activeId, onOpen, onDelete }: SavedPlansSidebarProps) {
  return (
    <aside className="rounded-2xl border border-border bg-sidebar p-4">
      <h2 className="flex items-center gap-2 font-heading text-sm font-extrabold text-sidebar-foreground">
        <BookmarkCheck className="size-4 text-primary" aria-hidden="true" />
        Saved Plans
        <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
          {plans.length}
        </span>
      </h2>

      {plans.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <FileText className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground text-pretty">
            Your saved lesson plans will appear here for quick access.
          </p>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {plans.map((saved) => {
            const active = saved.id === activeId
            return (
              <li key={saved.id}>
                <div
                  className={
                    'group flex items-start gap-2 rounded-xl border p-3 transition-colors ' +
                    (active
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/40')
                  }
                >
                  <button
                    type="button"
                    onClick={() => onOpen(saved)}
                    className="flex-1 text-left"
                  >
                    <p className="line-clamp-2 font-heading text-sm font-bold text-foreground">
                      {saved.plan.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {saved.input.focusArea} · {saved.input.duration}
                    </p>
                    <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                      {new Date(saved.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(saved.id)}
                    aria-label={`Delete ${saved.plan.title}`}
                    className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
