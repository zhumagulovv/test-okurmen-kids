const buildAnswerPayload = (question, answers, attemptId, index) => {
    const answer = answers[index]
    const isEmpty =
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)

    if (isEmpty) return null

    const base = { attempt_id: attemptId, question_id: question.id }

    switch (question.question_type) {
        case 'single_choice': {
            const optionId = question.options[answer]?.id
            return { ...base, selected_options: [optionId] }
        }
        case 'multiple_choice':
            return { ...base, selected_options: Array.isArray(answer) ? answer : [answer] }
        case 'text':
            return { ...base, answer_text: answer }
        case 'code':
            return {
                ...base,
                answer_text: typeof answer === 'object' ? JSON.stringify(answer) : answer,
            }
        default:
            return null
    }
}

export default buildAnswerPayload