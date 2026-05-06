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

        case 'code': {
            // Определяем тип вопроса по language
            const lang = question.language?.toLowerCase()

            // Python — отправляем только py код строкой
            if (lang === 'python' || lang === 'py') {
                const code = typeof answer === 'object' ? (answer.py ?? '') : answer
                return { ...base, answer_text: code }
            }

            // JS — отправляем только js код строкой
            if (lang === 'js' || lang === 'javascript') {
                const code = typeof answer === 'object' ? (answer.js ?? '') : answer
                return { ...base, answer_text: code }
            }

            // HTML/CSS или fullstack — отправляем только html и css
            if (lang === 'html' || lang === 'css' || lang === 'layout') {
                const html = typeof answer === 'object' ? (answer.html ?? '') : ''
                const css = typeof answer === 'object' ? (answer.css ?? '') : ''
                return {
                    ...base,
                    answer_text: JSON.stringify({ html, css }),
                }
            }

            // fullstack (html + css + js вместе) — отправляем все три
            if (lang === 'fullstack') {
                const html = typeof answer === 'object' ? (answer.html ?? '') : ''
                const css = typeof answer === 'object' ? (answer.css ?? '') : ''
                const js = typeof answer === 'object' ? (answer.js ?? '') : ''
                return {
                    ...base,
                    answer_text: JSON.stringify({ html, css, js }),
                }
            }

            // Fallback — если язык неизвестен, отправляем как есть
            return {
                ...base,
                answer_text: typeof answer === 'object' ? JSON.stringify(answer) : answer,
            }
        }

        default:
            return null
    }
}

export default buildAnswerPayload