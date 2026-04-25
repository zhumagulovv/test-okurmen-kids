import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { MdOutlineTaskAlt } from 'react-icons/md'

import SingleChoice from '../components/common/SingleChoice'
import CodeAnswer from '../components/common/CodeAnswer'
import TextAnswer from '../components/common/TextAnswer'
import MultiChoice from '../components/common/MultiChoice'

import {
    incrementTimer,
    nextQuestion,
    prevQuestion,
    setCurrentIndex,
    setQuizAnswer,
    startTimer,
} from '../features/quiz/quizSlice'

import { fetchResult, finishAttempt, submitAnswer } from '../features/attempt/attemptSlice'

import { BLOCKED_COMBINATIONS } from '../constants/constants'

// ✅ FIX: matchHotkey is a plain utility, NOT a hook — renamed to avoid Rules of Hooks violation
import { matchHotkey } from '../helpers/matchHotkey'

import { normalizeLanguage } from '../helpers/normalizeLanguage'
import { formatTime } from '../helpers/formatTime'
import buildAnswerPayload from '../helpers/buildAnswerPayload'

// ✅ NEW: useExamGuard — blocks browser back/forward during exam
import { useExamGuard } from '../hooks/useExamguard'

import logoImage from '../assets/logo.png'


// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const EXAM_DURATION_SECONDS = 40 * 60
const URGENT_THRESHOLD = 5 * 60

const QUESTION_COMPONENTS = {
    single_choice: SingleChoice,
    multiple_choice: MultiChoice,
    code: CodeAnswer,
    text: TextAnswer,
}

const TestPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentIndex, elapsed, answers } = useSelector((s) => s.quiz)
    const { questions, current } = useSelector((s) => s.attempt)

    // ✅ isExamActive controls both useBlocker replacement and useExamGuard
    const [isExamActive, setIsExamActive] = useState(true)

    const isFinishingRef = useRef(false)
    const answersRef = useRef(answers)
    const questionsRef = useRef(questions)
    const currentRef = useRef(current)
    const isExamActiveRef = useRef(true)

    useEffect(() => { answersRef.current = answers }, [answers])
    useEffect(() => { questionsRef.current = questions }, [questions])
    useEffect(() => { currentRef.current = current }, [current])
    useEffect(() => { isExamActiveRef.current = isExamActive }, [isExamActive])

    const total = questions.length
    const isLastQuestion = total > 0 && currentIndex === total - 1
    const progress = total ? Math.round(((currentIndex + 1) / total) * 100) : 0
    const question = questions[currentIndex]
    const normalizedLanguage = normalizeLanguage(question?.language)
    const timerIsUrgent = elapsed >= EXAM_DURATION_SECONDS - URGENT_THRESHOLD

    // ─────────────────────────────────────────────────────────────────────────
    // ✅ NEW: useExamGuard integration
    // Blocks browser back/forward buttons for the entire exam session.
    // releaseGuard() is called before any intentional navigation (finish/auto-finish).
    // ─────────────────────────────────────────────────────────────────────────
    const { releaseGuard } = useExamGuard({
        isActive: isExamActive,
        onIntercepted: () => {
            // Optional: you can show a toast/alert here when back is blocked
            // e.g. toast.warn('Нельзя использовать кнопки браузера во время экзамена')
            console.warn('[ExamGuard] Browser navigation blocked during exam')
        },
    })

    // ─────────────────────────────────────────────────────────────────────────
    // Core finish flow — submit all answers → finish → fetch result
    // ─────────────────────────────────────────────────────────────────────────
    const finishExamFlow = useCallback(async () => {
        if (isFinishingRef.current) return null
        isFinishingRef.current = true

        try {
            const snapshotAnswers = answersRef.current
            const snapshotQuestions = questionsRef.current
            const snapshotCurrent = currentRef.current

            const attemptId = snapshotCurrent?.id ?? snapshotCurrent?.attempt_id
            if (!attemptId) throw new Error('NO_ATTEMPT_ID')

            const payloads = snapshotQuestions
                .map((q, i) => buildAnswerPayload(q, snapshotAnswers, attemptId, i))
                .filter(Boolean)

            await Promise.all(
                payloads.map((payload) => dispatch(submitAnswer(payload)).unwrap())
            )

            await dispatch(finishAttempt(attemptId)).unwrap()
            await dispatch(fetchResult(attemptId)).unwrap()

            // ✅ Disable guard BEFORE navigating — allows intentional navigation
            releaseGuard()
            setIsExamActive(false)

            return attemptId
        } catch (err) {
            isFinishingRef.current = false
            throw err
        }
    }, [dispatch, releaseGuard])

    // ─────────────────────────────────────────────────────────────────────────
    // Manual finish (Submit button)
    // ─────────────────────────────────────────────────────────────────────────
    const handleFinish = useCallback(async () => {
        try {
            await finishExamFlow()
            navigate('/result-page')
        } catch (err) {
            alert(err?.message || 'Ошибка завершения теста')
            console.error('[handleFinish]', err)
        }
    }, [finishExamFlow, navigate])

    // ─────────────────────────────────────────────────────────────────────────
    // Auto finish (timer expiry, tab switch)
    // ─────────────────────────────────────────────────────────────────────────
    const handleAutoFinish = useCallback(async () => {
        try {
            await finishExamFlow()
        } catch (err) {
            console.error('[handleAutoFinish]', err)
        }
    }, [finishExamFlow])

    // ─────────────────────────────────────────────────────────────────────────
    // Timer expiry → auto finish
    // ✅ FIX: separated into its own useEffect with only [elapsed] as dependency
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (elapsed < EXAM_DURATION_SECONDS) return
        if (!isExamActiveRef.current) return

        handleAutoFinish().then(() => navigate('/result-page'))
    }, [elapsed]) // eslint-disable-line react-hooks/exhaustive-deps

    // ─────────────────────────────────────────────────────────────────────────
    // ✅ FIX: Timer + event listeners in ONE effect, mounted once
    // Separated from auto-finish effect to avoid re-registering listeners
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(startTimer())
        const timerInterval = setInterval(() => dispatch(incrementTimer()), 1000)

        // Tab hidden → auto-finish + redirect
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isExamActiveRef.current) {
                handleAutoFinish().then(() => navigate('/result-page'))
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // beforeunload is already handled by useExamGuard — but we still need
        // to attempt saving here as a best-effort before the page unloads
        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = ''
            handleAutoFinish().catch(() => { })
        }
        window.addEventListener('beforeunload', handleBeforeUnload)

        // ✅ FIX: matchHotkey is now a plain function, not a hook — safe inside useEffect
        const preventHotkeys = (e) => {
            if (BLOCKED_COMBINATIONS.some((combo) => matchHotkey(e, combo))) {
                e.preventDefault()
            }
        }
        window.addEventListener('keydown', preventHotkeys)

        const noop = (e) => e.preventDefault()
        document.addEventListener('copy', noop)
        document.addEventListener('paste', noop)
        document.addEventListener('cut', noop)

        return () => {
            clearInterval(timerInterval)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('keydown', preventHotkeys)
            document.removeEventListener('copy', noop)
            document.removeEventListener('paste', noop)
            document.removeEventListener('cut', noop)
        }
    }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps
    // ↑ Only [dispatch] — stable reference, effect runs once on mount

    const QuestionComponent =
        question?.question_type && QUESTION_COMPONENTS[question.question_type]
            ? QUESTION_COMPONENTS[question.question_type]
            : TextAnswer

    return (
        <section className="bg-(--surface-container-lowest) text-(--on-surface) min-h-screen flex flex-col">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <header className="w-full relative top-0 z-50 bg-(--surface-container-lowest) px-4 md:px-6 py-4">
                <div className="max-w-382.5 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="text-(--on-surface-variant) font-label text-xs uppercase tracking-widest mb-1">
                            Текущий прогресс
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="font-headline font-bold text-lg text-(--primary)">
                                Вопрос {currentIndex + 1} из {total}
                            </span>
                            <span className="text-(--on-surface-variant) font-medium text-sm bg-(--surface-container-low) px-2 py-1 rounded-lg">
                                {progress}% завершено
                            </span>
                        </div>
                    </div>

                    <div className="w-full md:flex-1 md:px-6 order-3 md:order-0">
                        <div className="h-2 w-full bg-(--surface-container-high) rounded-full overflow-hidden">
                            <div
                                className="h-full bg-(--primary) rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors duration-500
                            ${timerIsUrgent
                                ? 'bg-(--error)/10 border-(--error)/30 animate-pulse'
                                : 'bg-(--tertiary-container)/10 border-(--tertiary-container)/20'
                            }`}
                        >
                            <span className={`material-symbols-outlined ${timerIsUrgent ? 'text-(--error)' : 'text-(--tertiary-dim)'}`}>
                                timer
                            </span>
                            <span className={`font-headline font-extrabold text-xl tabular-nums
                                ${timerIsUrgent ? 'text-(--error)' : 'text-(--tertiary-dim)'}`}
                            >
                                {formatTime(elapsed)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main ────────────────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-8 max-w-400 mx-auto w-full">

                {/* ── Sidebar ── */}
                <aside className="w-full md:w-80 flex flex-col gap-8">
                    <div className="bg-(--surface-container-low) p-6 rounded-(--xl)">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                <img src={logoImage} alt="logo" loading='lazy' />
                            </div>
                            <span className="text-(--on-surface) font-headline font-black text-xl tracking-tight">
                                Okurmen Kids
                            </span>
                        </div>
                        <h1 className="font-headline font-extrabold text-2xl text-(--on-surface)">Экзамен</h1>
                        <p className="text-(--on-surface-variant) text-sm mt-1">Тестирование знаний</p>
                    </div>

                    <div className="bg-(--surface-container-low) p-6 rounded-(--xl) flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-headline font-bold text-sm text-(--on-surface)">Карта вопросов</span>
                            <span className="text-xs text-(--on-surface-variant)">
                                {Object.keys(answers).length} / {total} Отвечено
                            </span>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, i) => {
                                const ans = answers[i]
                                const isAnswered =
                                    ans !== undefined &&
                                    ans !== '' &&
                                    (Array.isArray(ans) ? ans.length > 0 : true)

                                return (
                                    <button
                                        key={q.id ?? i}
                                        onClick={() => dispatch(setCurrentIndex(i))}
                                        className={`aspect-square flex items-center justify-center rounded-(--xl) font-bold cursor-pointer transition-colors
                                            ${i === currentIndex
                                                ? 'bg-(--primary) text-white shadow-lg ring-4 ring-(--primary)/20'
                                                : isAnswered
                                                    ? 'bg-(--secondary-container) text-(--on-secondary-container) border border-(--secondary)/30'
                                                    : 'bg-(--surface-container-lowest) text-(--on-surface-variant) hover:bg-(--surface-container-high) border border-(--outline-variant)/10'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-sm text-(--on-surface-variant)">
                                <div className="w-3 h-3 rounded-full bg-(--primary)" />
                                <span>Текущая позиция</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-(--on-surface-variant)">
                                <div className="w-3 h-3 rounded-full bg-(--secondary)" />
                                <span>Отвечено</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Question area ── */}
                <section className="flex-1 flex flex-col gap-6">
                    <div className="bg-(--surface-container-low) p-8 md:p-12 rounded-(--xl) flex-1 flex flex-col">
                        {!question ? (
                            <div className="flex-1 flex items-center justify-center text-(--on-surface-variant)">
                                Загрузка вопроса...
                            </div>
                        ) : (
                            <>
                                <div className="mb-12">
                                    {question.language && (
                                        <span className="text-xs font-medium text-(--primary) bg-(--primary)/10 px-2 py-1 rounded-lg uppercase tracking-widest mb-2 inline-block">
                                            {normalizedLanguage}
                                        </span>
                                    )}
                                    <h2 className="font-headline font-bold text-3xl md:text-4xl text-(--on-background) leading-tight">
                                        {question.text}
                                    </h2>
                                </div>

                                <QuestionComponent
                                    options={question.options ?? []}
                                    name={`question_${question.id}`}
                                    language={normalizedLanguage}
                                    value={answers[currentIndex] ?? (question.question_type === 'multiple_choice' ? [] : '')}
                                    onChange={(value) => dispatch(setQuizAnswer({ index: currentIndex, value }))}
                                />
                            </>
                        )}
                    </div>

                    {/* ── Navigation footer ── */}
                    <footer className="flex items-center justify-between gap-4 bg-(--surface-container-low) p-6 rounded-(--xl) w-full">
                        <button
                            onClick={() => dispatch(prevQuestion())}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--on-surface-variant) bg-(--surface-container-highest) hover:bg-(--surface-container-high) transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft />
                            Предыдущий
                        </button>

                        {isLastQuestion ? (
                            <button
                                onClick={handleFinish}
                                className="flex items-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--primary) bg-(--primary)/10 hover:bg-(--primary)/20 transition-all active:scale-95"
                            >
                                Отправить
                                <MdOutlineTaskAlt />
                            </button>
                        ) : (
                            <button
                                onClick={() => dispatch(nextQuestion())}
                                className="flex items-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--primary) bg-(--primary)/10 hover:bg-(--primary)/20 transition-all active:scale-95"
                            >
                                Следующий
                                <FaChevronRight />
                            </button>
                        )}
                    </footer>
                </section>
            </main>

            {/* Subtle exam-mode border */}
            <div className="fixed inset-0 pointer-events-none border-12 border-(--primary)/5 rounded-4xl z-100" />
        </section>
    )
}

export default TestPage