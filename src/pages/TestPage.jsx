import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useBlocker, useNavigate } from 'react-router-dom'

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
import { useMatchHotkey } from '../hooks/useMatchHotkey'
import { normalizeLanguage } from '../helpers/normalizeLanguage'
import { formatTime } from '../helpers/formatTime'
import logoImage from '../assets/logo.png'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const EXAM_DURATION_SECONDS = 40 * 60   // 2400 s — strict limit
const URGENT_THRESHOLD = 5 * 60   // last 5 min → timer turns red

const QUESTION_COMPONENTS = {
    single_choice: SingleChoice,
    multiple_choice: MultiChoice,
    code: CodeAnswer,
    text: TextAnswer,
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure helper — no component deps, safe to call from anywhere
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the submit payload for one question.
 * Returns null when the question is unanswered so callers can filter it out.
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const TestPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentIndex, elapsed, answers } = useSelector((s) => s.quiz)
    const { questions, current } = useSelector((s) => s.attempt)

    // Controls whether the router blocker is active.
    // Set to false just before navigating so the blocker doesn't re-intercept
    // our own programmatic navigation to /result-page.
    const [isExamActive, setIsExamActive] = useState(true)

    // ── Refs: always-current snapshots safe inside stale async closures ──────
    // A ref never causes a re-render and is always in sync — perfect for values
    // read inside event listeners, timeouts, and async continuations.
    const isFinishingRef = useRef(false)   // ← the single-execution lock
    const answersRef = useRef(answers)
    const questionsRef = useRef(questions)
    const currentRef = useRef(current)
    const isExamActiveRef = useRef(true)

    useEffect(() => { answersRef.current = answers }, [answers])
    useEffect(() => { questionsRef.current = questions }, [questions])
    useEffect(() => { currentRef.current = current }, [current])
    useEffect(() => { isExamActiveRef.current = isExamActive }, [isExamActive])

    // ── Derived ──────────────────────────────────────────────────────────────
    const total = questions.length
    const isLastQuestion = total > 0 && currentIndex === total - 1  // ① gate for submit button
    const progress = total ? Math.round(((currentIndex + 1) / total) * 100) : 0
    const question = questions[currentIndex]
    const normalizedLanguage = normalizeLanguage(question?.language)
    const timerIsUrgent = elapsed >= EXAM_DURATION_SECONDS - URGENT_THRESHOLD

    // ─────────────────────────────────────────────────────────────────────────
    // ③ Core finish flow — THE single source of truth for ending an attempt
    // ─────────────────────────────────────────────────────────────────────────
    //
    // Design decisions:
    //   • Reads everything from refs so it's race-condition-safe in any async
    //     context (visibility handler, blocker effect, timer effect).
    //   • The isFinishingRef lock ensures it executes at most once, no matter
    //     how many triggers fire simultaneously (tab switch + timer + blocker).
    //   • On failure the lock is released so the user can retry manually.
    //   • On success the lock stays true — all subsequent triggers are no-ops.
    //   • Does NOT navigate — callers own the navigation decision.
    //
    const finishExamFlow = useCallback(async () => {
        // ── LOCK ─────────────────────────────────────────────────────────────
        if (isFinishingRef.current) return null   // already running or done → bail
        isFinishingRef.current = true

        try {
            const snapshotAnswers = answersRef.current
            const snapshotQuestions = questionsRef.current
            const snapshotCurrent = currentRef.current

            const attemptId = snapshotCurrent?.id ?? snapshotCurrent?.attempt_id
            if (!attemptId) throw new Error('NO_ATTEMPT_ID')

            // ── ① Submit all non-empty answers in parallel ────────────────
            const payloads = snapshotQuestions
                .map((q, i) => buildAnswerPayload(q, snapshotAnswers, attemptId, i))
                .filter(Boolean)

            await Promise.all(
                payloads.map((payload) => dispatch(submitAnswer(payload)).unwrap())
            )

            // ── ② Finish the attempt ──────────────────────────────────────
            await dispatch(finishAttempt(attemptId)).unwrap()

            // ── ③ Pre-fetch result so /result-page renders immediately ────
            await dispatch(fetchResult(attemptId)).unwrap()

            // Deactivate blocker BEFORE navigating so our own navigation
            // doesn't get intercepted by the useBlocker below.
            setIsExamActive(false)

            return attemptId

        } catch (err) {
            // Release the lock so the user can retry on manual submit
            isFinishingRef.current = false
            throw err
        }
        // On success: lock stays true. Every subsequent trigger is a no-op.
    }, [dispatch])   // stable — all live data comes from refs

    // ─────────────────────────────────────────────────────────────────────────
    // Public handlers — thin wrappers that own navigation / error reporting
    // ─────────────────────────────────────────────────────────────────────────

    /** ① Manual submit button on the last question */
    const handleFinish = useCallback(async () => {
        try {
            await finishExamFlow()
            navigate('/result-page')
        } catch (err) {
            alert(err?.message || 'Ошибка завершения теста')
            console.error('[handleFinish]', err)
        }
    }, [finishExamFlow, navigate])

    /**
     * Automatic triggers (tab switch, beforeunload, timer, blocker).
     * Swallows errors — the specific trigger decides what to do next.
     */
    const handleAutoFinish = useCallback(async () => {
        try {
            await finishExamFlow()
        } catch (err) {
            console.error('[handleAutoFinish]', err)
        }
    }, [finishExamFlow])

    // ─────────────────────────────────────────────────────────────────────────
    // ② Timer auto-finish — fires exactly once at the 2400-second mark
    // ─────────────────────────────────────────────────────────────────────────
    //
    // This effect re-runs every second (elapsed changes via incrementTimer).
    // The early returns make it a near-zero-cost no-op on the first 2399 ticks.
    // At tick 2400 it finishes the exam and navigates.
    //
    useEffect(() => {
        if (elapsed < EXAM_DURATION_SECONDS) return   // not yet
        if (!isExamActiveRef.current) return          // already finished

        // Time's up — finish silently and redirect
        handleAutoFinish().then(() => navigate('/result-page'))
    }, [elapsed, handleAutoFinish, navigate])

    // ─────────────────────────────────────────────────────────────────────────
    // React Router blocker — intercepts programmatic + user navigation
    // ─────────────────────────────────────────────────────────────────────────
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isExamActive && currentLocation.pathname !== nextLocation.pathname
    )

    useEffect(() => {
        if (blocker.state !== 'blocked') return

        handleAutoFinish()
            .then(() => blocker.proceed())
            .catch(() => blocker.reset())
    }, [blocker, handleAutoFinish])

    // ─────────────────────────────────────────────────────────────────────────
    // Global event listeners — mounted once, cleaned up on unmount
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        dispatch(startTimer())
        const timerInterval = setInterval(() => dispatch(incrementTimer()), 1000)

        // A) Tab hidden → auto-finish + redirect
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleAutoFinish().then(() => navigate('/result-page'))
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // B) Page unload — best-effort async + native dialog
        //    The browser may kill the async flow before it completes;
        //    this is a known limitation without a dedicated beacon endpoint.
        const handleBeforeUnload = (e) => {
            e.preventDefault()
            e.returnValue = ''   // triggers native "Leave site?" dialog
            handleAutoFinish().catch(() => { })
        }
        window.addEventListener('beforeunload', handleBeforeUnload)

        // C) Block Ctrl+R, F5, etc.
        const preventRefresh = (e) => {
            if (BLOCKED_COMBINATIONS.some((combo) => useMatchHotkey(e, combo))) {
                e.preventDefault()
            }
        }
        window.addEventListener('keydown', preventRefresh)

        // D) Clipboard lock
        const noop = (e) => e.preventDefault()
        document.addEventListener('copy', noop)
        document.addEventListener('paste', noop)
        document.addEventListener('cut', noop)

        return () => {
            clearInterval(timerInterval)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('keydown', preventRefresh)
            document.removeEventListener('copy', noop)
            document.removeEventListener('paste', noop)
            document.removeEventListener('cut', noop)
        }
    }, [dispatch, handleAutoFinish, navigate])
    // handleAutoFinish and navigate are stable (useCallback + stable deps),
    // so this effect correctly runs only once on mount.

    // ─────────────────────────────────────────────────────────────────────────
    // Question component resolution
    // ─────────────────────────────────────────────────────────────────────────
    const QuestionComponent =
        question?.question_type && QUESTION_COMPONENTS[question.question_type]
            ? QUESTION_COMPONENTS[question.question_type]
            : TextAnswer

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <section className="bg-(--surface-container-lowest) text-(--on-surface) min-h-screen flex flex-col">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <header className="w-full relative top-0 z-50 bg-(--surface-container-lowest) px-4 md:px-6 py-4">
                <div className="max-w-382.5 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Progress label */}
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

                    {/* Progress bar */}
                    <div className="w-full md:flex-1 md:px-6 order-3 md:order-0">
                        <div className="h-2 w-full bg-(--surface-container-high) rounded-full overflow-hidden">
                            <div
                                className="h-full bg-(--primary) rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Timer + conditional submit button */}
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">

                        {/*
                         * Timer — turns red + pulses in the final 5 minutes
                         * so students get a visual warning before hard cutoff.
                         */}
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

                        {/* Prev — disabled on first question */}
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