import { generateObject } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import type { PlanInput } from '@/lib/types'

export const maxDuration = 30

// Supports the user-provided Gemini API key. Reads NEXT_PUBLIC_GEMINI_API_KEY
// (as requested) or the standard server-side names, and only uses it on the server.
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY

const planSchema = z.object({
  title: z.string().describe('A short, warm, descriptive title for the lesson plan'),
  objective: z
    .string()
    .describe('One clear paragraph describing the learning objective and the "why" behind it'),
  materials: z.array(z.string()).describe('Concrete list of materials needed'),
  sensoryAccommodations: z
    .array(z.string())
    .describe('Specific sensory accommodations tailored to the child sensory profile'),
  steps: z
    .array(
      z.object({
        title: z.string().describe('Short label for this activity step'),
        detail: z.string().describe('Clear, concrete instruction for carrying out this step'),
      }),
    )
    .describe('Ordered step-by-step activity instructions'),
  coolDown: z
    .array(z.string())
    .describe('Cool-down and transition strategies to end the session calmly'),
})

const SYSTEM_PROMPT =
  "You are an expert pediatric occupational therapist and special education teacher specializing in Autism Spectrum Disorder (ASD). Generate a structured, step-by-step, sensory-friendly lesson plan based on the user's inputs. Include: (1) Objective, (2) Materials Needed, (3) Sensory Accommodations, (4) Step-by-Step Activity Instructions, and (5) Cool-down / Transition Strategy. Use warm, concrete, predictable language. Keep instructions actionable for a caregiver or teacher, and make every accommodation specific to the child's sensory profile."

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return Response.json(
        {
          error:
            'Gemini API key is not configured. Add a NEXT_PUBLIC_GEMINI_API_KEY environment variable to enable plan generation.',
        },
        { status: 500 },
      )
    }

    const input = (await req.json()) as PlanInput

    if (!input?.ageGrade || !input?.focusArea) {
      return Response.json(
        { error: 'Please provide at least the age/grade level and a focus area.' },
        { status: 400 },
      )
    }

    const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY })

    const userPrompt = [
      `Child's Age / Grade Level: ${input.ageGrade}`,
      `Sensory Profile: ${input.sensoryProfile || 'Not specified'}`,
      `Focus Area: ${input.focusArea}`,
      `Activity Duration: ${input.duration || 'Not specified'}`,
      `Main Activity Theme: ${input.theme || 'Teacher/therapist choice'}`,
      '',
      'Create a complete, sensory-friendly lesson plan tailored to these inputs.',
    ].join('\n')

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: planSchema,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
    })

    return Response.json({ plan: object })
  } catch (error) {
    console.log('[v0] generate-plan error:', error instanceof Error ? error.message : error)
    return Response.json(
      { error: 'We could not generate a plan right now. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
