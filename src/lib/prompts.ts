export const SYSTEM_PROMPT = `You are TeachWeaver AI, an intelligent assistant built specifically for educators. You help K-12 and higher education teachers create engaging, effective learning experiences.

Your capabilities:
- Generating comprehensive lesson plans aligned to learning objectives
- Creating quizzes and assessments with answer keys
- Building student worksheets and practice materials
- Designing engaging classroom activities and projects
- Analyzing lessons and providing improvement feedback

Always use your specialized tools when generating educational content. Be encouraging, supportive, and pedagogically sound. Tailor all content to the specified grade level and subject. Include differentiation strategies when helpful.`

export const TEACHING_TOOLS = [
  {
    name: 'generate_lesson_plan',
    description: 'Generate a comprehensive lesson plan with objectives, activities, and assessments',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Lesson title' },
        subject: { type: 'string', description: 'Subject area' },
        grade: { type: 'string', description: 'Grade level' },
        duration: { type: 'number', description: 'Duration in minutes' },
        objective: { type: 'string', description: 'Main learning objective' },
        standards: { type: 'string', description: 'Educational standards' },
        warmUp: { type: 'string', description: 'Warm-up activity description' },
        directInstruction: { type: 'string', description: 'Direct instruction content' },
        guidedPractice: { type: 'string', description: 'Guided practice activity' },
        independentPractice: { type: 'string', description: 'Independent practice' },
        closure: { type: 'string', description: 'Lesson closure activity' },
        assessment: { type: 'string', description: 'Assessment method' },
        differentiation: { type: 'string', description: 'Differentiation strategies' },
        materials: { type: 'array', items: { type: 'string' }, description: 'Required materials' },
      },
      required: ['title', 'subject', 'grade', 'duration', 'objective', 'warmUp', 'directInstruction', 'guidedPractice', 'closure', 'assessment'],
    },
  },
  {
    name: 'create_quiz',
    description: 'Create a quiz or assessment with questions and an answer key',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        subject: { type: 'string' },
        grade: { type: 'string' },
        topic: { type: 'string' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard', 'mixed'] },
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              number: { type: 'number' },
              type: { type: 'string' },
              question: { type: 'string' },
              options: { type: 'array', items: { type: 'string' } },
              answer: { type: 'string' },
              explanation: { type: 'string' },
              points: { type: 'number' },
            },
          },
        },
        totalPoints: { type: 'number' },
        timeLimit: { type: 'number', description: 'Time limit in minutes' },
      },
      required: ['title', 'subject', 'grade', 'topic', 'questions'],
    },
  },
  {
    name: 'create_worksheet',
    description: 'Create a student worksheet with exercises and activities',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        subject: { type: 'string' },
        grade: { type: 'string' },
        topic: { type: 'string' },
        objective: { type: 'string' },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              instructions: { type: 'string' },
              exercises: { type: 'array', items: { type: 'string' } },
            },
          },
        },
        answerKey: { type: 'string' },
      },
      required: ['title', 'subject', 'grade', 'topic', 'sections'],
    },
  },
  {
    name: 'create_activity',
    description: 'Design an engaging classroom activity or project',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        subject: { type: 'string' },
        grade: { type: 'string' },
        type: { type: 'string', enum: ['group', 'individual', 'partner', 'whole_class', 'project'] },
        duration: { type: 'number' },
        objective: { type: 'string' },
        overview: { type: 'string' },
        materials: { type: 'array', items: { type: 'string' } },
        steps: { type: 'array', items: { type: 'string' } },
        rubric: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              criteria: { type: 'string' },
              excellent: { type: 'string' },
              good: { type: 'string' },
              needsWork: { type: 'string' },
            },
          },
        },
        differentiation: { type: 'string' },
        extensions: { type: 'string' },
      },
      required: ['title', 'subject', 'grade', 'type', 'duration', 'objective', 'steps'],
    },
  },
  {
    name: 'analyze_lesson',
    description: 'Analyze a lesson plan or teaching approach and provide improvement feedback',
    input_schema: {
      type: 'object' as const,
      properties: {
        strengths: { type: 'array', items: { type: 'string' } },
        improvements: { type: 'array', items: { type: 'string' } },
        alignmentScore: { type: 'number', description: 'Standards alignment score 1-10' },
        engagementScore: { type: 'number', description: 'Student engagement potential 1-10' },
        differentiationScore: { type: 'number', description: 'Differentiation quality 1-10' },
        overallScore: { type: 'number', description: 'Overall lesson quality 1-10' },
        recommendations: { type: 'array', items: { type: 'string' } },
        summary: { type: 'string' },
      },
      required: ['strengths', 'improvements', 'alignmentScore', 'engagementScore', 'differentiationScore', 'overallScore', 'recommendations'],
    },
  },
]

export const MODE_PROMPTS: Record<string, string> = {
  general: 'You are in general teaching assistant mode. Help with any educational questions or requests.',
  lesson: 'You are in lesson planning mode. Focus on creating comprehensive lesson plans. Use the generate_lesson_plan tool when asked to create a lesson.',
  quiz: 'You are in quiz creation mode. Focus on creating assessments. Use the create_quiz tool when asked to create a quiz or test.',
  worksheet: 'You are in worksheet mode. Focus on student practice materials. Use the create_worksheet tool.',
  activity: 'You are in activity design mode. Focus on engaging classroom activities. Use the create_activity tool.',
}
