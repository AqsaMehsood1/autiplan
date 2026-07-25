export interface PlanInput {
  ageGrade: string
  sensoryProfile: string
  focusArea: string
  duration: string
  theme: string
}

export interface LessonPlan {
  title: string
  objective: string
  materials: string[]
  sensoryAccommodations: string[]
  steps: { title: string; detail: string }[]
  coolDown: string[]
}

export interface SavedPlan {
  id: string
  createdAt: number
  input: PlanInput
  plan: LessonPlan
}
