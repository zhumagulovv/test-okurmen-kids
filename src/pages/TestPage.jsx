import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import logoImage from '../assets/logo.png'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineTaskAlt } from 'react-icons/md';


import SingleChoice from '../components/common/SingleChoice';
import CodeAnswer from '../components/common/CodeAnswer';
import TextAnswer from '../components/common/TextAnswer';
import MultiChoice from '../components/common/MultiChoice';
import { incrementTimer, nextQuestion, prevQuestion, setCurrentIndex, startTimer } from '../features/quiz/quizSlice';
import { fetchResult, finishAttempt, submitAnswer } from '../features/attempt/attemptSlice';
import { useNavigate } from 'react-router-dom';

const QUESTION_COMPONENTS = {
    single_choice: SingleChoice,
    multiple_choice: MultiChoice,
    code: CodeAnswer,
    text: TextAnswer,
};

const normalizeLanguage = (lang) => {
    if (!lang) return 'layout'

    const l = lang.toLowerCase()

    if (l.includes('python')) return 'python'
    if (l.includes('js') || l.includes('javascript')) return 'js'
    if (l.includes('html') || l.includes('css')) return 'layout'

    return 'fullstack'
}

const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

const TestPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentIndex, elapsed } = useSelector((s) => s.quiz);
    const { questions, current } = useSelector((s) => s.attempt);

    const [answers, setAnswers] = useState({});

    const total = questions.length;
    const progress = total ? Math.round(((currentIndex + 1) / total) * 100) : 0;
    const question = questions[currentIndex];

    const normalizedLanguage = normalizeLanguage(question?.language)

    useEffect(() => {
        dispatch(startTimer());
        const interval = setInterval(() => dispatch(incrementTimer()), 1000);
        return () => clearInterval(interval);
    }, [dispatch]);

    // const handleFinish = useCallback(async () => {
    //     try {
    //         // 🔥 1. проверка multi choice
    //         const multiChoiceQuestions = questions.filter(
    //             q => q.type === 'multiple_choice'
    //         )

    //         const invalidMultiChoice = multiChoiceQuestions.some(
    //             q => !answers[q.id] || answers[q.id].length !== 2
    //         )

    //         if (invalidMultiChoice) {
    //             alert('Для вопросов с множественным выбором необходимо выбрать ровно 2 варианта')
    //             return
    //         }

    //         // 🔥 2. получаем id безопасно
    //         const attemptId = current?.id || current?.attempt_id

    //         if (!attemptId) {
    //             console.error('Attempt ID not found:', current)
    //             alert('Ошибка: нет attempt id')
    //             return
    //         }

    //         // 🔥 3. отправка
    //         await dispatch(finishAttempt(attemptId)).unwrap()

    //         // 🔥 4. если есть результат — можно добавить
    //         await dispatch(fetchResult(attemptId)).unwrap()

    //         // 🔥 5. переход (если используешь react-router)
    //         navigate('/result-page')

    //     } catch (error) {
    //         console.error('Finish error:', error)
    //         alert(error?.message || 'Ошибка завершения теста')
    //     }
    // }, [questions, answers, current, dispatch])

    const handleFinish = useCallback(async () => {
        try {
            // 1. Validate multi choice
            const multiChoiceQuestions = questions.filter(q => q.type === 'multiple_choice')
            const invalidMultiChoice = multiChoiceQuestions.some(q => {
                const required = q.correct_count ?? 2  // use API field if available
                return !answers[q.id] || answers[q.id].length !== required
            })

            if (invalidMultiChoice) {
                alert('Для вопросов с множественным выбором необходимо выбрать ровно 2 варианта')
                return
            }

            const attemptId = current?.id || current?.attempt_id
            if (!attemptId) {
                alert('Ошибка: нет attempt id')
                return
            }

            // 2. ✅ Submit every answer before finishing
            await Promise.all(
                questions.map((q) => {
                    const answer = answers[q.id]
                    if (answer === undefined || answer === null || answer === '') return null

                    return dispatch(submitAnswer({
                        attempt_id: attemptId,
                        question_id: q.id,
                        answer: answer,        // adjust field name to match your API
                    })).unwrap()
                }).filter(Boolean)
            )

            // 3. Finish + fetch result
            await dispatch(finishAttempt(attemptId)).unwrap()
            await dispatch(fetchResult(attemptId)).unwrap()

            navigate('/result-page')
        } catch (error) {
            console.error('Finish error:', error)
            alert(error?.message || 'Ошибка завершения теста')
        }
    }, [questions, answers, current, dispatch, navigate])

    const QuestionComponent = question.type ? QUESTION_COMPONENTS[question.type] ?? TextAnswer : null;

    // console.log(question)

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    return (
        <section className="bg-(--surface-container-lowest) text-(--on-surface) min-h-screen flex flex-col">
            <header
                className="w-full top-0 sticky z-50 bg-(--surface-container-lowest) py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="flex flex-col">
                        <span className="text-(--on-surface-variant) font-label text-xs uppercase tracking-widest mb-1">Текущий прогресс</span>
                        <div className="flex items-center gap-3">
                            <span className="font-headline font-bold text-lg text-(--primary)">Вопрос {currentIndex + 1} из {total}</span>
                            <span
                                className="text-(--on-surface-variant) font-medium text-sm bg-(--surface-container-low) px-2 py-1 rounded-lg">{progress}% завершено</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 max-w-xl w-full md:mx-12">
                    <div className="h-2 w-full bg-(--surface-container-high) rounded-full overflow-hidden">
                        <div className="h-full bg-(--primary) w-[5%] rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div
                    className="flex items-center gap-3 bg-(--tertiary-container)/10 border border-(--tertiary-container)/20 px-4 py-2 rounded-xl">
                    <span className="material-symbols-outlined text-(--tertiary-dim)">таймер</span>
                    <span className="font-headline font-extrabold text-xl text-(--tertiary-dim) tabular-nums">{formatTime(elapsed)}</span>
                </div>
            </header>
            <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-8 max-w-400 mx-auto w-full">

                <aside className="w-full md:w-80 flex flex-col gap-8">
                    <div className="bg-(--surface-container-low) p-6 rounded-(--xl)">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                <img src={logoImage} alt="" />
                            </div>
                            <span className="text-(--on-surface) font-headline font-black text-xl tracking-tight">Okurmen Kids</span>
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
                                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '' &&
                                    (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : true)
                                return (
                                    <button
                                        key={i}
                                        onClick={() => dispatch(setCurrentIndex(i))}
                                        className={`aspect-square flex items-center justify-center rounded-(--xl) font-bold cursor-pointer transition-colors ${i === currentIndex
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
                                <div className="w-3 h-3 rounded-full bg-(--primary)"></div>
                                <span>Текущая позиция</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-(--on-surface-variant)">
                                <div className="w-3 h-3 rounded-full bg-(--secondary)"></div>
                                <span>Отмечено для просмотра</span>
                            </div>
                        </div>
                    </div>
                </aside>
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
                                    value={answers[question.id] || (question.type === 'multiple_choice' ? [] : '')} // текущее значение
                                    onChange={(val) => handleAnswerChange(question.id, val)} // обработчик
                                />
                            </>
                        )}
                    </div>
                    <footer
                        className="flex flex-col md:flex-row justify-between items-center gap-4 bg-(--surface-container-low) p-6 rounded-(--xl)">
                        <div className="flex gap-4 w-full md:w-auto">
                            <button
                                onClick={() => dispatch(prevQuestion())}
                                disabled={currentIndex === 0}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--on-surface-variant) bg-(--surface-container-highest) hover:bg-(--surface-container-high) transition-all active:scale-95 disabled:opacity-50">
                                <FaChevronLeft />
                                Предыдущий
                            </button>
                            <button
                                onClick={() => dispatch(nextQuestion())}
                                disabled={currentIndex === total - 1}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--primary) bg-(--primary)/10 hover:bg-(--primary)/20 transition-all active:scale-95">
                                Следующий
                                <FaChevronRight />
                            </button>
                        </div>
                        <div className="w-full md:w-auto">
                            <button
                                onClick={handleFinish}
                                className="w-full md:w-auto px-10 py-4 rounded-xl bg-linear-to-r from-(--primary) to-(--primary-container) text-white font-headline font-extrabold text-lg shadow-xl shadow-(--primary)/20 hover:shadow-2xl hover:shadow-(--primary)/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                                Отправить экзамен
                                <MdOutlineTaskAlt />
                            </button>
                        </div>
                    </footer>
                </section>
            </main>
            <div className="fixed inset-0 pointer-events-none border-12 border-(--primary)/5 rounded-4chd z-100"></div>
        </section>
    )
}

export default TestPage