import { FastifyInstance } from 'fastify';
import Anthropic from '@anthropic-ai/sdk';
import {
    breakdownRequestSchema,
    draftCommunicationSchema,
    validateRequest,
    type BreakdownRequestInput,
    type DraftCommunicationInput,
} from '../schemas/validation.js';

// Initialize Anthropic client (uses ANTHROPIC_API_KEY env var automatically)
const getAnthropicClient = () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new Anthropic({ apiKey });
};

/**
 * Agent System Prompts
 */
const AGENT_PROMPTS = {
    fragmento: {
        system: `You are Fragmento, a friendly AI assistant specialized in breaking down big goals into manageable tasks for neurodivergent users.

Your personality:
- Encouraging and supportive
- Clear and explicit in your explanations
- You understand executive function challenges
- You avoid overwhelming users with too much at once

When breaking down events into tasks:
1. Work backwards from the event date
2. Create clear, actionable tasks (not vague goals)
3. Estimate realistic hours (account for ND challenges like task initiation)
4. Identify dependencies between tasks
5. Group tasks into logical phases
6. Use simple, concrete language

Output format: Return valid JSON with this structure:
{
  "tasks": [
    {
      "title": "Task title in Spanish",
      "titleEn": "Task title in English",
      "description": "Brief description",
      "estimatedHours": number,
      "difficulty": "easy" | "medium" | "hard" | "expert",
      "phase": number (1-5),
      "section": "Section name",
      "dependencies": ["title of prerequisite task"],
      "daysBeforeEvent": number
    }
  ],
  "phases": [
    {
      "number": 1,
      "name": "Phase name",
      "nameEn": "Phase name in English",
      "description": "What this phase accomplishes"
    }
  ],
  "warnings": ["Any concerns or suggestions"],
  "totalEstimatedHours": number
}`,
    },
    palabras: {
        system: `You are Palabras, a friendly AI assistant that helps neurodivergent users draft communications.

Your personality:
- Neutral and professional
- You understand that writing can cause paralysis for ND folks
- You provide clear templates that users can customize
- You match the requested tone perfectly

Guidelines:
- Keep messages concise but complete
- Use clear structure (greeting, body, closing)
- Avoid ambiguity
- Include all necessary information
- Respect cultural norms for Spanish/English

Output format: Return valid JSON with this structure:
{
  "draft": "The full message text",
  "subject": "Email subject if applicable",
  "keyPoints": ["Main points covered"],
  "alternativeOpenings": ["2-3 alternative first sentences"],
  "tone": "Description of the tone used"
}`,
    },
};

export async function agentRoutes(fastify: FastifyInstance) {
    /**
     * POST /api/agents/breakdown
     * Fragmento agent: Break down an event into tasks
     */
    fastify.post<{ Body: BreakdownRequestInput }>(
        '/agents/breakdown',
        async (request, reply) => {
            // Validate request
            const validation = validateRequest(breakdownRequestSchema, request.body);
            if (!validation.success) {
                return reply.code(400).send({
                    success: false,
                    error: 'Validation failed',
                    details: validation.errors,
                });
            }

            const { eventName, eventDescription, eventDate, eventType, teamSize, constraints, preferences } =
                validation.data;

            const anthropic = getAnthropicClient();
            if (!anthropic) {
                // Return mock response for development without API key
                return reply.send({
                    success: true,
                    agent: 'fragmento',
                    data: getMockBreakdownResponse(validation.data),
                    mock: true,
                });
            }

            try {
                const language = preferences?.language || 'es';
                const detailLevel = preferences?.detailLevel || 'moderate';

                const userPrompt = `Break down this event into tasks:

Event: ${eventName}
Description: ${eventDescription}
Date: ${eventDate}
Type: ${eventType}
Team Size: ${teamSize} people
${constraints?.length ? `Constraints:\n${constraints.map((c) => `- ${c}`).join('\n')}` : ''}

Requirements:
- Primary language: ${language === 'es' ? 'Spanish' : 'English'}
- Detail level: ${detailLevel}
- ${preferences?.includeTimeEstimates ? 'Include time estimates' : 'Skip time estimates'}

Please generate a comprehensive task breakdown.`;

                const response = await anthropic.messages.create({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 4096,
                    system: AGENT_PROMPTS.fragmento.system,
                    messages: [{ role: 'user', content: userPrompt }],
                });

                // Extract text content from response
                const textContent = response.content.find((block) => block.type === 'text');
                if (!textContent || textContent.type !== 'text') {
                    throw new Error('No text response from AI');
                }

                // Parse JSON from response
                let parsedResponse;
                try {
                    // Extract JSON from potential markdown code blocks
                    const jsonMatch = textContent.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                        textContent.text.match(/\{[\s\S]*\}/);
                    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : textContent.text;
                    parsedResponse = JSON.parse(jsonStr);
                } catch {
                    fastify.log.error('Failed to parse AI response as JSON');
                    return reply.code(500).send({
                        success: false,
                        error: 'Failed to parse AI response',
                        rawResponse: textContent.text,
                    });
                }

                return reply.send({
                    success: true,
                    agent: 'fragmento',
                    data: parsedResponse,
                    usage: {
                        inputTokens: response.usage.input_tokens,
                        outputTokens: response.usage.output_tokens,
                    },
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({
                    success: false,
                    error: 'AI agent request failed',
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    );

    /**
     * POST /api/agents/draft
     * Palabras agent: Draft communications
     */
    fastify.post<{ Body: DraftCommunicationInput }>(
        '/agents/draft',
        async (request, reply) => {
            const validation = validateRequest(draftCommunicationSchema, request.body);
            if (!validation.success) {
                return reply.code(400).send({
                    success: false,
                    error: 'Validation failed',
                    details: validation.errors,
                });
            }

            const { type, context, recipients, tone, language } = validation.data;

            const anthropic = getAnthropicClient();
            if (!anthropic) {
                return reply.send({
                    success: true,
                    agent: 'palabras',
                    data: getMockDraftResponse(validation.data),
                    mock: true,
                });
            }

            try {
                const userPrompt = `Draft a ${type} communication:

Context: ${context}
Recipients: ${recipients.join(', ')}
Tone: ${tone}
Language: ${language === 'es' ? 'Spanish' : 'English'}

Please draft an appropriate message.`;

                const response = await anthropic.messages.create({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 2048,
                    system: AGENT_PROMPTS.palabras.system,
                    messages: [{ role: 'user', content: userPrompt }],
                });

                const textContent = response.content.find((block) => block.type === 'text');
                if (!textContent || textContent.type !== 'text') {
                    throw new Error('No text response from AI');
                }

                let parsedResponse;
                try {
                    const jsonMatch = textContent.text.match(/```json\n?([\s\S]*?)\n?```/) ||
                        textContent.text.match(/\{[\s\S]*\}/);
                    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : textContent.text;
                    parsedResponse = JSON.parse(jsonStr);
                } catch {
                    // If not JSON, return as plain text draft
                    parsedResponse = {
                        draft: textContent.text,
                        keyPoints: [],
                        tone: tone,
                    };
                }

                return reply.send({
                    success: true,
                    agent: 'palabras',
                    data: parsedResponse,
                    usage: {
                        inputTokens: response.usage.input_tokens,
                        outputTokens: response.usage.output_tokens,
                    },
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({
                    success: false,
                    error: 'AI agent request failed',
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    );

    /**
     * GET /api/agents/status
     * Check agent availability and configuration
     */
    fastify.get('/agents/status', async (_request, reply) => {
        const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

        return reply.send({
            success: true,
            agents: {
                fragmento: {
                    available: true,
                    aiEnabled: hasApiKey,
                    description: 'Task breakdown agent',
                },
                palabras: {
                    available: true,
                    aiEnabled: hasApiKey,
                    description: 'Communication drafting agent',
                },
                timely: {
                    available: false,
                    aiEnabled: false,
                    description: 'Reminder agent (coming soon)',
                },
                calma: {
                    available: false,
                    aiEnabled: false,
                    description: 'Overwhelm detection agent (coming soon)',
                },
                enfoque: {
                    available: true,
                    aiEnabled: false,
                    description: 'Focus session agent (client-side only)',
                },
                fiesta: {
                    available: true,
                    aiEnabled: false,
                    description: 'Celebration agent (client-side only)',
                },
            },
            configuration: {
                aiProvider: 'anthropic',
                model: 'claude-sonnet-4-20250514',
                apiKeyConfigured: hasApiKey,
            },
        });
    });
}

/**
 * Mock responses for development without API key
 */
function getMockBreakdownResponse(input: { eventDate: string; eventName?: string }) {
    const daysUntilEvent = Math.ceil(
        (new Date(input.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return {
        tasks: [
            {
                title: 'Definir objetivos y alcance',
                titleEn: 'Define objectives and scope',
                description: 'Establecer metas claras y definir el alcance del evento',
                estimatedHours: 2,
                difficulty: 'easy',
                phase: 1,
                section: 'Planificación',
                dependencies: [],
                daysBeforeEvent: daysUntilEvent,
            },
            {
                title: 'Crear lista de tareas detallada',
                titleEn: 'Create detailed task list',
                description: 'Desglosar todas las actividades necesarias',
                estimatedHours: 3,
                difficulty: 'medium',
                phase: 1,
                section: 'Planificación',
                dependencies: ['Definir objetivos y alcance'],
                daysBeforeEvent: daysUntilEvent - 2,
            },
            {
                title: 'Asignar responsabilidades',
                titleEn: 'Assign responsibilities',
                description: 'Distribuir tareas entre los miembros del equipo',
                estimatedHours: 2,
                difficulty: 'medium',
                phase: 2,
                section: 'Organización',
                dependencies: ['Crear lista de tareas detallada'],
                daysBeforeEvent: daysUntilEvent - 4,
            },
            {
                title: 'Preparar materiales',
                titleEn: 'Prepare materials',
                description: 'Reunir y preparar todo lo necesario',
                estimatedHours: 5,
                difficulty: 'medium',
                phase: 3,
                section: 'Preparación',
                dependencies: ['Asignar responsabilidades'],
                daysBeforeEvent: Math.floor(daysUntilEvent / 2),
            },
            {
                title: 'Ensayo general',
                titleEn: 'General rehearsal',
                description: 'Practicar y revisar todos los detalles',
                estimatedHours: 4,
                difficulty: 'hard',
                phase: 4,
                section: 'Ejecución',
                dependencies: ['Preparar materiales'],
                daysBeforeEvent: 2,
            },
            {
                title: 'Día del evento',
                titleEn: 'Event day',
                description: 'Ejecutar el plan y disfrutar el momento',
                estimatedHours: 8,
                difficulty: 'hard',
                phase: 5,
                section: 'Ejecución',
                dependencies: ['Ensayo general'],
                daysBeforeEvent: 0,
            },
        ],
        phases: [
            { number: 1, name: 'Planificación', nameEn: 'Planning', description: 'Definir metas y estructura' },
            { number: 2, name: 'Organización', nameEn: 'Organization', description: 'Asignar recursos y roles' },
            { number: 3, name: 'Preparación', nameEn: 'Preparation', description: 'Preparar materiales y logística' },
            { number: 4, name: 'Pre-evento', nameEn: 'Pre-event', description: 'Últimos preparativos y ensayos' },
            { number: 5, name: 'Ejecución', nameEn: 'Execution', description: 'El gran día' },
        ],
        warnings: [
            'Este es un desglose de ejemplo. Con la API de Claude configurada, obtendrás un plan personalizado.',
        ],
        totalEstimatedHours: 24,
        mock: true,
    };
}

function getMockDraftResponse(input: { language?: string; context: string; tone?: string }) {
    const isSpanish = input.language === 'es';

    return {
        draft: isSpanish
            ? `Hola equipo,\n\nQuería compartir una actualización sobre ${input.context}.\n\nSaludos`
            : `Hi team,\n\nI wanted to share an update about ${input.context}.\n\nBest regards`,
        subject: isSpanish ? 'Actualización del proyecto' : 'Project Update',
        keyPoints: [
            isSpanish ? 'Contexto proporcionado' : 'Context provided',
            isSpanish ? 'Tono apropiado' : 'Appropriate tone',
        ],
        alternativeOpenings: [
            isSpanish ? 'Espero que estén bien.' : 'Hope you are doing well.',
            isSpanish ? 'Les escribo para informarles...' : 'I am writing to inform you...',
        ],
        tone: input.tone || 'casual',
        mock: true,
    };
}
