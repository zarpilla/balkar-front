import service from '@/service/index'

const resource: string = 'quiz-attempts'

export interface QuizAttemptPayload {
  spaceUid: string
  quizId: number
  pageUid: string
  // Selected option id per question index (null if unanswered)
  answers: (number | null)[]
}

export const quizAttempts = {
  submit: (payload: QuizAttemptPayload) =>
    service({ requiresAuth: true }).post(`${resource}/submit`, { data: payload })
}
