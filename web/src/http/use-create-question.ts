import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateQuestionRequest } from './types/create-question-request'
import type { CreateQuestionResponse } from './types/create-question-response'
import type { GetRoomQuestionsResponse } from './types/get-room-questions-response'

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient()

  return useMutation<
    CreateQuestionResponse,
    unknown,
    CreateQuestionRequest,
    { newQuestion: GetRoomQuestionsResponse[number]; questions: GetRoomQuestionsResponse | undefined }
  >({
    mutationFn: async (data: CreateQuestionRequest): Promise<CreateQuestionResponse> => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      const result: CreateQuestionResponse = await response.json()

      return result
    },

    // Executa no momento que for feita a chamada p/ API
    onMutate({ question }: { question: string }) {
      const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
        'get-questions',
        roomId,
      ])

      const questionsArray = questions ?? []

      const newQuestion: GetRoomQuestionsResponse[number] = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      }

      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-questions', roomId],
        [newQuestion, ...questionsArray]
      )

      return { newQuestion, questions }
    },

    onSuccess(
      data: CreateQuestionResponse,
      _variables: CreateQuestionRequest,
      context: { newQuestion: GetRoomQuestionsResponse[number]; questions: GetRoomQuestionsResponse | undefined }
    ) {
      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-questions', roomId],
        (questions: GetRoomQuestionsResponse | undefined) => {
          if (!questions) {
            return questions
          }

          if (!context.newQuestion) {
            return questions
          }

          return questions.map((question: GetRoomQuestionsResponse[number]) => {
            if (question.id === context.newQuestion.id) {
              return {
                ...context.newQuestion,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false,
              }
            }

            return question
          })
        }
      )
    },

    onError(
      _error: unknown,
      _variables: CreateQuestionRequest,
      context: { newQuestion: GetRoomQuestionsResponse[number]; questions: GetRoomQuestionsResponse | undefined } | undefined
    ) {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomQuestionsResponse>(
          ['get-questions', roomId],
          context.questions
        )
      }
    },

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['get-questions', roomId] })
    // },
  })
}
