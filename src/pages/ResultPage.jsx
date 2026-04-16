import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { BsFillCheckCircleFill } from 'react-icons/bs'
import { MdOutlineErrorOutline, MdOutlineQuiz } from 'react-icons/md'
import { clearAttempt } from '../features/attempt/attemptSlice'

const ResultPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { result, loading, error } = useSelector((s) => s.attempt)

    // If someone lands here with no result, send them home
    useEffect(() => {
        if (!loading && !result) {
            navigate('/')
        }
    }, [result, loading, navigate])

    const handleGoHome = () => {
        dispatch(clearAttempt())
        navigate('/')
    }

    if (loading || !result) {
        return (
            <main className="min-h-screen flex items-center justify-center text-(--on-surface-variant)">
                Загрузка результатов...
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center text-(--error)">
                Ошибка загрузки результатов: {error}
            </main>
        )
    }

    const scorePercent = Math.round(result.score ?? 0)

    // --- Derive display values from result ---
    // Adjust field names below to match your actual API response shape
    const total = result.answers.length ?? 0
    const correct = result.answers.filter(a => a.is_correct === true).length ?? 0
    const wrong = result.answers.filter(a => a.is_correct === false).length ?? 0
    const pending = result.answers.filter(a => a.grading_status === "processing").length ?? 0

    // Circular SVG progress maths (r = 45% of viewBox = ~126 for 280px circle)
    const RADIUS = 45          // percent-based radius used in the SVG
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS   // ≈ 282.7
    const offset = CIRCUMFERENCE - (scorePercent / 100) * CIRCUMFERENCE

    const scoreLabel =
        scorePercent >= 90 ? 'Превосходно!' :
            scorePercent >= 75 ? 'Отличная работа!' :
                scorePercent >= 60 ? 'Хороший результат' :
                    'Продолжайте стараться'

    return (
        <main className="max-w-5xl mx-auto px-6 pt-12 pb-32">
            <section className="relative mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Circular score ring */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r={RADIUS}
                                    fill="transparent"
                                    stroke="var(--surface-container-high)"
                                    strokeWidth="6"
                                />
                                <circle
                                    cx="50" cy="50" r={RADIUS}
                                    fill="transparent"
                                    stroke="var(--primary)"
                                    strokeWidth="6"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-6xl md:text-7xl font-black font-headline tracking-tighter text-(--on-surface)">
                                    {scorePercent}%
                                </span>
                                <span className="text-sm font-bold uppercase tracking-widest text-(--primary-fixed-dim) font-headline">
                                    Счёт
                                </span>
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-(--tertiary-fixed) rounded-full blur-xl opacity-40" />
                            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-(--secondary) rounded-full blur-2xl opacity-20" />
                        </div>
                    </div>

                    {/* Text summary */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-(--secondary-container) text-(--on-secondary-container) text-sm font-bold font-label mb-4">
                                {result.test_title ?? result.quiz_title ?? result.title ?? 'Экзамен'}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black font-headline text-(--on-background) leading-tight">
                                {scorePercent}% — {scoreLabel}
                            </h1>
                            <p className="text-lg text-(--on-surface-variant) max-w-md mt-4 font-medium">
                                {result.message ?? 'Тест завершён. Проверьте свои результаты ниже.'}
                            </p>

                            {pending > 0 && (
                                <p className="text-sm text-(--on-surface-variant) mt-3 bg-(--surface-container-low) px-4 py-2 rounded-xl inline-block">
                                    ⏳ {pending} ответ(а) ещё проверяются — итоговый балл может обновиться
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                            <button
                                className="px-8 py-4 rounded-xl bg-(--surface-container-highest) text-(--on-primary-container) font-bold text-lg hover:bg-(--surface-container-high) transition-all active:scale-95"
                                onClick={handleGoHome}
                            >
                                Вернуться на главную
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-(--surface-container-lowest) p-8 rounded-(--xl) flex flex-col justify-between group hover:bg-(--surface-container) transition-colors duration-300 min-h-45">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-(--surface-container-high) text-(--on-surface-variant) rounded-xl group-hover:bg-(--surface-container-highest) transition-colors">
                            <MdOutlineQuiz />
                        </span>
                        <span className="text-xs font-black text-(--outline-variant) font-headline uppercase tracking-widest">Вопросы</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold font-headline text-(--on-surface)">{total}</div>
                        <div className="text-sm font-semibold text-(--on-surface-variant)">Всего элементов оценки</div>
                    </div>
                </div>

                <div className="bg-(--primary-container) p-8 rounded-(--xl) flex flex-col justify-between min-h-45">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-white text-(--primary) rounded-(--xl)">
                            <BsFillCheckCircleFill />
                        </span>
                        <span className="text-xs font-black text-(--on-primary-container) font-headline uppercase tracking-widest">Успех</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold font-headline text-(--on-primary-container)">{correct}</div>
                        <div className="text-sm font-semibold text-(--on-primary-container)/80">Правильные ответы</div>
                    </div>
                </div>

                <div className="bg-(--surface-container-lowest) p-8 rounded-(--xl) flex flex-col justify-between group hover:bg-(--surface-container) transition-colors duration-300 min-h-45">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-(--error-container)/10 text-(--error) rounded-xl">
                            <MdOutlineErrorOutline />
                        </span>
                        <span className="text-xs font-black text-(--outline-variant) font-headline uppercase tracking-widest">Области для роста</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold font-headline text-(--error)">{wrong}</div>
                        <div className="text-sm font-semibold text-(--on-surface-variant)">Возможности для обучения</div>
                    </div>
                </div>
            </section>

            {/* <section>
                <h2 className="font-headline font-bold text-2xl text-(--on-surface) mb-6">Разбор ответов</h2>
                <div className="flex flex-col gap-4">
                    {result.answers?.map((a, i) => {
                        const isPending = a.grading_status === 'processing'
                        const isCorrect = a.is_correct === true
                        const isWrong = a.is_correct === false

                        return (
                            <div
                                key={a.question_id}
                                className={`p-6 rounded-(--xl) border-2 transition-colors ${isPending
                                        ? 'bg-(--surface-container-low) border-(--outline-variant)/20'
                                        : isCorrect
                                            ? 'bg-(--primary)/5 border-(--primary)/20'
                                            : 'bg-(--error)/5 border-(--error)/20'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-lg bg-(--surface-container-high) flex items-center justify-center text-sm font-bold text-(--on-surface-variant) shrink-0">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-(--on-surface) mb-1">{a.question_text}</p>
                                            <span className="text-xs font-medium text-(--on-surface-variant) uppercase tracking-widest">
                                                {a.question_type}
                                            </span>
                                            {a.answer_text && (
                                                <p className="mt-2 text-sm text-(--on-surface-variant) bg-(--surface-container-high) px-3 py-2 rounded-lg">
                                                    {a.answer_text}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${isPending
                                            ? 'bg-(--surface-container-high) text-(--on-surface-variant)'
                                            : isCorrect
                                                ? 'bg-(--primary)/10 text-(--primary)'
                                                : 'bg-(--error)/10 text-(--error)'
                                        }`}>
                                        {isPending ? '⏳ Проверяется' : isCorrect ? '✓ Верно' : '✗ Неверно'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section> */}
        </main>
    )
}

export default ResultPage