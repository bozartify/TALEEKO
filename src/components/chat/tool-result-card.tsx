import LessonPlanCard from './lesson-plan-card'
import QuizCard from './quiz-card'
import WorksheetCard from './worksheet-card'
import ActivityCard from './activity-card'
import AnalysisCard from './analysis-card'

interface Props {
  type: string
  data: Record<string, unknown>
}

export default function ToolResultCard({ type, data }: Props) {
  switch (type) {
    case 'generate_lesson_plan': return <LessonPlanCard data={data} />
    case 'create_quiz':          return <QuizCard data={data} />
    case 'create_worksheet':     return <WorksheetCard data={data} />
    case 'create_activity':      return <ActivityCard data={data} />
    case 'analyze_lesson':       return <AnalysisCard data={data} />
    default:                     return null
  }
}
