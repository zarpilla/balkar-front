<template>
  <div class="content-quiz">
    <!-- <component v-if="data.quiz.title" :is="props.titleAs || 'h2'" class="content-quiz__title">
      {{ data.quiz.title }}
    </component> -->

    <div v-if="data.quiz.introduction" class="content-quiz__introduction">
      <template v-for="(item, index) in data.quiz.introduction" :key="index">
        <RichTextElement :element="item" />
      </template>
    </div>

    <div class="content-quiz__questions">
      <div
        v-for="(question, questionIndex) in data.quiz.questions"
        :key="question.id"
        class="quiz-question"
        :class="{ 'quiz-question--answered': isQuestionAnswered(questionIndex) }"
      >
        <h3 class="quiz-question__title">{{ questionIndex + 1 }}. {{ question.title }}</h3>
        <p class="quiz-question__text">{{ question.question }}</p>

        <div class="quiz-question__options">
          <RadioOption
            v-for="(option, optionIndex) in question.options"
            :key="option.id"
            :name="`question-${question.id}`"
            :value="option.id"
            :text="`${getOptionPrefix(optionIndex)} ${option.option}`"
            :is-selected="selectedAnswers[questionIndex] === option.id"
            :is-correct="option.correct"
            :is-answered="isQuestionAnswered(questionIndex) && isQuizSubmitted && !changedAfterSubmit[questionIndex]"
            @change="onOptionChange(questionIndex, option.id)"
          />
        </div>

        <div
          v-if="isQuestionAnswered(questionIndex) && isQuizSubmitted"
          class="quiz-question__answer"
          :class="{
            'quiz-question__answer--correct': isQuestionCorrect(questionIndex),
            'quiz-question__answer--incorrect': !isQuestionCorrect(questionIndex)
          }"
        >
          <div 
            v-if="!changedAfterSubmit[questionIndex]"
            class="quiz-answer__feedback"
          >
            <span class="quiz-answer__text">
              {{ isQuestionCorrect(questionIndex) ? $t('correct-answer') : $t('incorrect-answer') }}
            </span>
          </div>
          <div 
            v-if="isQuestionCorrect(questionIndex) && !changedAfterSubmit[questionIndex]" 
            class="quiz-answer__correct-option"
          >
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_96_412"
                style="mask-type: alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="21"
              >
                <rect y="0.348755" width="20" height="20" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_96_412)">
                <path
                  d="M10.0058 18.3488C8.90472 18.3488 7.86806 18.1404 6.89583 17.7238C5.92361 17.3071 5.07292 16.7342 4.34375 16.005C3.61458 15.2758 3.04167 14.4254 2.625 13.4538C2.20833 12.4821 2 11.4439 2 10.3392C2 9.23445 2.20833 8.19945 2.625 7.23417C3.04167 6.26889 3.61458 5.42167 4.34375 4.6925C5.07292 3.96334 5.92333 3.39042 6.895 2.97375C7.86667 2.55709 8.90486 2.34875 10.0096 2.34875C11.1143 2.34875 12.1493 2.55709 13.1146 2.97375C14.0799 3.39042 14.9271 3.96334 15.6562 4.6925C16.3854 5.42167 16.9583 6.27042 17.375 7.23875C17.7917 8.20723 18 9.24195 18 10.3429C18 11.444 17.7917 12.4807 17.375 13.4529C16.9583 14.4251 16.3854 15.2758 15.6562 16.005C14.9271 16.7342 14.0783 17.3071 13.11 17.7238C12.1415 18.1404 11.1068 18.3488 10.0058 18.3488ZM10 16.8488C11.8056 16.8488 13.3403 16.2168 14.6042 14.9529C15.8681 13.689 16.5 12.1543 16.5 10.3488C16.5 8.5432 15.8681 7.00848 14.6042 5.74459C13.3403 4.4807 11.8056 3.84875 10 3.84875C8.19444 3.84875 6.65972 4.4807 5.39583 5.74459C4.13194 7.00848 3.5 8.5432 3.5 10.3488C3.5 12.1543 4.13194 13.689 5.39583 14.9529C6.65972 16.2168 8.19444 16.8488 10 16.8488Z"
                  fill="#1C1B1F"
                />
                <circle cx="10.0001" cy="10.3488" r="3.34875" fill="#44B08E" />
              </g>
            </svg>
            {{ getCorrectAnswerWithPrefix(question) }}
          </div>
          <!-- Explanation is always visible once submitted, regardless of answer changes -->
          <div class="quiz-answer__explanation">
            {{ question.answer }}
          </div>
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <div v-if="!isQuizSubmitted || Object.keys(changedAfterSubmit).length > 0" class="content-quiz__submit">
      <button @click="submitQuiz" class="btn btn-primary btn-primary-hover-green" :disabled="!allQuestionsAnswered">
        {{ isQuizSubmitted ? ($t('resubmit-quiz') || 'Resubmit Quiz') : ($t('submit-quiz') || 'Submit Quiz') }}
      </button>
    </div>

    <div v-if="isQuizSubmitted" class="content-quiz__completion">
      <div v-if="allQuestionsCorrect" class="quiz-completion quiz-completion--success">
        <!-- <span class="quiz-completion__icon">🎉</span> -->
        <span class="quiz-completion__text">
          <span class="fw-bold">{{ $t('congratulations') }}</span>
          <template v-if="data.quiz.minToPass && data.quiz.minToPass > 0 && data.quiz.minToPass < 100">
            You've achieved {{ data.quiz.minToPass }}% correct answers ({{ correctAnswersCount }} out of {{ data.quiz.questions.length }} questions)!
          </template>
          <template v-else>
            {{ $t('you-ve-answered-all-questions-correctly') }}
          </template>
        </span>
      </div>
      <!-- <div v-else class="quiz-completion quiz-completion--partial">
        <span class="quiz-completion__icon">📝</span>
        <span class="quiz-completion__text">
          You've completed the quiz. Correct answers: {{ correctAnswersCount }}/{{
            data.quiz.questions.length
          }}
        </span>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue'
import RichTextElement from './RichTextElement.vue'
import RadioOption from './RadioOption.vue'

interface QuizOption {
  id: number
  option: string
  correct: boolean
}

interface QuizQuestion {
  id: number
  title: string
  question: string
  answer: string
  options: QuizOption[]
}

interface RichTextElementData {
  type: string
  children: Array<{
    text: string
    type: string
  }>
}

interface Quiz {
  id: number
  title: string
  introduction?: RichTextElementData[]
  questions: QuizQuestion[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  minToPass?: number
}

interface ContentQuizData {
  __component: string
  id: number
  quiz: Quiz
}

interface Props {
  data: ContentQuizData
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4'
  spaceTitle?: string
  spaceSubTitle?: string
  isCompleted?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'quiz-completed', payload: { 
    quizId: number; 
    allCorrect: boolean; 
    score: number;
    minToPass?: number;
    correctAnswers: number;
    totalQuestions: number;
  }): void
}>()

// Track selected answers for each question
const selectedAnswers = ref<Record<number, number>>({})
const questionResults = ref<Record<number, boolean>>({})
const isQuizSubmitted = ref<boolean>(false)
const changedAfterSubmit = ref<Record<number, boolean>>({})

// Initialize with correct answers if content is completed
onMounted(() => {
  if (props.isCompleted) {
    // Generate correct answers for completed content
    props.data.quiz.questions.forEach((question, questionIndex) => {
      const correctOption = question.options.find((option) => option.correct)
      if (correctOption) {
        selectedAnswers.value[questionIndex] = correctOption.id
        questionResults.value[questionIndex] = true
      }
    })
    isQuizSubmitted.value = true
  }
})

const isQuestionAnswered = (questionIndex: number): boolean => {
  return selectedAnswers.value[questionIndex] !== undefined
}

const isQuestionCorrect = (questionIndex: number): boolean => {
  return questionResults.value[questionIndex] === true
}

const allQuestionsAnswered = computed(() => {
  return props.data.quiz.questions.every((_, index) => isQuestionAnswered(index))
})

const correctAnswersCount = computed(() => {
  return Object.values(questionResults.value).filter((result) => result).length
})

const requiredCorrectAnswers = computed(() => {
  if (props.data.quiz.minToPass && props.data.quiz.minToPass > 0) {
    const totalQuestions = props.data.quiz.questions.length
    return Math.ceil((props.data.quiz.minToPass / 100) * totalQuestions)
  }
  // Default: all questions must be correct
  return props.data.quiz.questions.length
})

const allQuestionsCorrect = computed(() => {
  if (!allQuestionsAnswered.value) return false
  
  // If minToPass is defined, use it as the percentage threshold
  if (props.data.quiz.minToPass && props.data.quiz.minToPass > 0) {
    return correctAnswersCount.value >= requiredCorrectAnswers.value
  }
  
  // Default behavior: all questions must be correct (100%)
  return correctAnswersCount.value === props.data.quiz.questions.length
})

const onOptionChange = (questionIndex: number, optionId: number) => {
  selectedAnswers.value[questionIndex] = optionId
  
  // If quiz has already been submitted, mark this question as changed
  if (isQuizSubmitted.value) {
    changedAfterSubmit.value[questionIndex] = true
  }
}

// Helper function to generate option prefixes (A), B), C), D))
const getOptionPrefix = (optionIndex: number): string => {
  const letters = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)', 'G)', 'H)']
  return letters[optionIndex] || `${optionIndex + 1})`
}

// Helper function to get the correct answer text with prefix
const getCorrectAnswerWithPrefix = (question: QuizQuestion): string => {
  const correctOption = question.options.find((option) => option.correct)
  if (correctOption) {
    const correctOptionIndex = question.options.findIndex((option) => option.correct)
    return `${getOptionPrefix(correctOptionIndex)} ${correctOption.option}`
  }
  return ''
}

// Submit quiz and calculate results
const submitQuiz = () => {
  // Calculate results for all answered questions
  props.data.quiz.questions.forEach((question, questionIndex) => {
    if (selectedAnswers.value[questionIndex] !== undefined) {
      const selectedOption = question.options.find(
        (option) => option.id === selectedAnswers.value[questionIndex]
      )
      questionResults.value[questionIndex] = selectedOption?.correct || false
    }
  })
  
  // Reset the changed after submit tracking
  changedAfterSubmit.value = {}
  isQuizSubmitted.value = true
}

// Watch for quiz completion
watch([allQuestionsAnswered, allQuestionsCorrect, isQuizSubmitted], ([answered, correct, submitted]) => {
  if (answered && submitted) {
    emit('quiz-completed', {
      quizId: props.data.quiz.id,
      allCorrect: correct, // This now reflects whether the quiz passes (either all correct or meets minToPass percentage)
      score: correctAnswersCount.value / props.data.quiz.questions.length,
      minToPass: props.data.quiz.minToPass, // This is now a percentage (0-100)
      correctAnswers: correctAnswersCount.value,
      totalQuestions: props.data.quiz.questions.length
    })
  }
})
</script>

<style scoped>
.content-quiz {
  margin: 2rem 0;
}

.content-quiz__title {
  color: var(--Green, #44b08e);
  font-family: Inter;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 1rem;
}

.content-quiz__introduction {
  margin-bottom: 2rem;
  /* padding: 1rem;
  background: #f0f9ff;
  border-left: 4px solid var(--Green, #44b08e);
  border-radius: 4px; */
}

.content-quiz__questions {
  margin: 2rem 0;
}

.quiz-question {
  /* margin-bottom: 2rem; */
  padding: 10px 0 10px 0;
  background: white;
  border-radius: 8px;

  border-bottom: 1px solid #797979;
  border-radius: 0;
}

.quiz-question__title {
  color: var(--Green, #44b08e);

  /* Subtitle H4 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  letter-spacing: 0.2px;
}

.quiz-question__text {
  color: var(--Negre, #000);

  /* Text */
  color: var(--Negre, #000);

  /* Subtitle H4 */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%; /* 26px */
  letter-spacing: 0.2px;

  margin-bottom: 30px;
}

.quiz-question__options {
  margin: 30px 0;
}

.quiz-question__answer {
  margin-top: 30px;
  padding: 0rem 0 10px;
  border-radius: 6px;
  /* border-left: 4px solid; */
}

/* .quiz-question__answer--correct {
  background-color: #d4edda;
  border-left-color: #28a745;
}

.quiz-question__answer--incorrect {
  background-color: #f8d7da;
  border-left-color: #dc3545;
} */

.quiz-answer__feedback {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.quiz-answer__icon {
  margin-right: 0.5rem;
  font-size: 18px;
}

.quiz-answer__icon--correct {
  color: #28a745;
}

.quiz-answer__icon--incorrect {
  color: #dc3545;
}

.quiz-answer__text {
  color: var(--Negre, #000);

  /* Text - Bold */
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 25.5px */
}

.quiz-answer__correct-option {
  color: var(--Negre, #000);

  /* Text */
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 25.5px */

  margin-bottom: 10px;
}

.quiz-answer__explanation {
  color: var(--Negre, #000);

  /* Text */
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 25.5px */
  margin: 0;
  padding-bottom: 20px;
}

.content-quiz__completion {
  margin-top: 2rem;
  text-align: center;
}

.quiz-completion {
  padding: 1.5rem;
  border-radius: 8px;
  font-family: Inter;
  font-weight: 600;
}

.quiz-completion--success {
  background-color: #d4edda;
  color: #000;

  color: var(--Black, #000);

  /* Text */
  font-family: Inter;
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 25.5px */
}

.quiz-completion--partial {
  background-color: #fff3cd;
  color: #856404;
  border: 2px solid #ffc107;
}

.quiz-completion__icon {
  font-size: 24px;
  margin-right: 0.5rem;
}

.quiz-completion__text {
  font-size: 16px;
}

.content-quiz__submit {
  margin: 2rem 0;
  text-align: left;
}

.quiz-submit-button {
  background-color: var(--Green, #44b08e);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quiz-submit-button:hover {
  background-color: #3a9a7a;
}

.quiz-submit-button:active {
  transform: translateY(1px);
}
</style>
