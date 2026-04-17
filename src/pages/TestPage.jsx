import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useBlocker, useNavigate } from 'react-router-dom';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineTaskAlt } from 'react-icons/md';

import SingleChoice from '../components/common/SingleChoice';
import CodeAnswer from '../components/common/CodeAnswer';
import TextAnswer from '../components/common/TextAnswer';
import MultiChoice from '../components/common/MultiChoice';
import {
    incrementTimer,
    nextQuestion,
    prevQuestion,
    setCurrentIndex,
    setQuizAnswer,
    startTimer,
} from '../features/quiz/quizSlice';
import { fetchResult, finishAttempt, submitAnswer } from '../features/attempt/attemptSlice';

import logoImage from '../assets/logo.png'
import { BLOCKED_COMBINATIONS } from '../constants/constants';
import { useMatchHotkey } from '../hooks/useMatchHotkey';

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const QUESTION_COMPONENTS = {
    single_choice: SingleChoice,
    multiple_choice: MultiChoice,
    code: CodeAnswer,
    text: TextAnswer,
};

const normalizeLanguage = (lang) => {
    if (!lang) return 'layout';
    const l = lang.toLowerCase();
    if (l.includes('python')) return 'python';
    if (l.includes('js') || l.includes('javascript')) return 'js';
    if (l.includes('html') || l.includes('css')) return 'layout';
    return 'fullstack';
};

const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

/**
 * Build the answer payload for a single question.
 * Returns null for empty / unanswered questions so callers can filter them out.
 */
const buildAnswerPayload = (q, answers, attemptId, index) => {
    const answer = answers[index];
    const isEmpty =
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0);

    if (isEmpty) return null;

    const base = { attempt_id: attemptId, question_id: q.id };

    switch (q.question_type) {
        case 'single_choice':
            const optionId = q.options[answer]?.id
            return { ...base, selected_options: [optionId] };
        case 'multiple_choice':
            return { ...base, selected_options: Array.isArray(answer) ? answer : [answer] };
        case 'text':
            return { ...base, answer_text: answer };
        case 'code':
            return {
                ...base,
                answer_text: typeof answer === 'object' ? JSON.stringify(answer) : answer,
            };
        default:
            return null;
    }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TestPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentIndex, elapsed, answers } = useSelector((s) => s.quiz);
    const { questions, current } = useSelector((s) => s.attempt);

    // const [answers, setAnswers] = useState({});
    const [isExamActive, setIsExamActive] = useState(true);

    // ── Anti-cheat: single-execution lock ──────────────────────────────────
    // We keep a ref so the lock value is always current inside async closures
    // without being a stale closure over state.
    const isFinishingRef = useRef(false);

    // Keep a ref mirror of the answers so async closures (visibility change,
    // blocker) always read the latest answers without depending on stale state.
    const answersRef = useRef(answers);
    useEffect(() => { answersRef.current = answers; }, [answers]);

    // Same for questions & current so we never capture stale slice state.
    const questionsRef = useRef(questions);
    useEffect(() => { questionsRef.current = questions; }, [questions]);

    const currentRef = useRef(current);
    useEffect(() => { currentRef.current = current; }, [current]);

    // ── Derived ─────────────────────────────────────────────────────────────
    const total = questions.length;
    const progress = total ? Math.round(((currentIndex + 1) / total) * 100) : 0;
    const question = questions[currentIndex];
    const normalizedLanguage = normalizeLanguage(question?.language);

    // ── Core finish flow ────────────────────────────────────────────────────

    /**
     * The single source of truth for ending an attempt.
     *
     * Returns the attemptId on success, throws on failure.
     * Relies on refs so it is safe to call from any async context.
     */
    const finishAttemptFlow = useCallback(async () => {
        // ── LOCK ──────────────────────────────────────────────────────────
        if (isFinishingRef.current) return null; // already running – bail out
        isFinishingRef.current = true;

        try {
            const snapshotAnswers = answersRef.current;
            const snapshotQuestions = questionsRef.current;
            const snapshotCurrent = currentRef.current;

            const attemptId = snapshotCurrent?.id ?? snapshotCurrent?.attempt_id;
            if (!attemptId) throw new Error('NO_ATTEMPT_ID');

            // ── Submit all non-empty answers in parallel ───────────────────
            const payloads = snapshotQuestions
                .map((q, index) => buildAnswerPayload(q, snapshotAnswers, attemptId, index))
                .filter(Boolean);

            await Promise.all(
                payloads.map((payload) => dispatch(submitAnswer(payload)).unwrap())
            );

            // ── Finish & fetch result ─────────────────────────────────────
            await dispatch(finishAttempt(attemptId)).unwrap();
            await dispatch(fetchResult(attemptId)).unwrap();

            // ── Mark exam as done so the router blocker stops firing ───────
            setIsExamActive(false);

            return attemptId;
        } catch (err) {
            // Release the lock on failure so the user can retry manually
            isFinishingRef.current = false;
            throw err;
        }
        // Note: we intentionally DO NOT release the lock after success so
        // subsequent triggers (visibility, blocker, etc.) are all no-ops.
    }, [dispatch]); // stable – everything else comes from refs

    // ── Public handlers ─────────────────────────────────────────────────────

    /** Called by the manual "Submit" button. Navigates after finishing. */
    const handleFinish = useCallback(async () => {
        try {
            await finishAttemptFlow();
            navigate('/result-page');
        } catch (error) {
            alert(error?.message || 'Ошибка завершения теста');
            console.error('Finish error:', error);
        }
    }, [finishAttemptFlow, navigate]);

    /**
     * Called by automatic triggers (tab switch, beforeunload, blocker).
     * Does NOT navigate – the caller decides what to do next.
     */
    const handleAutoFinish = useCallback(async () => {
        try {
            await finishAttemptFlow();
            // Navigation is handled by the specific trigger (blocker.proceed, etc.)
        } catch (e) {
            console.error('Auto-finish error:', e);
        }
    }, [finishAttemptFlow]);

    // ── React Router blocker ────────────────────────────────────────────────

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isExamActive && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (blocker.state !== 'blocked') return;

        handleAutoFinish()
            .then(() => blocker.proceed())
            .catch(() => blocker.reset());
    }, [blocker, handleAutoFinish]);

    // ── Global event listeners ───────────────────────────────────────────────

    useEffect(() => {
        // Timer
        dispatch(startTimer());
        const timerInterval = setInterval(() => dispatch(incrementTimer()), 1000);

        // ── A) Tab visibility (anti-cheat: auto-finish on hide) ───────────
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleAutoFinish().then(() => navigate('/result-page'));
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // ── B) Page leave / refresh ────────────────────────────────────────
        // beforeunload cannot run async code; we start the flow but the
        // browser may kill it before it completes. A synchronous beacon is
        // the only truly reliable option here but requires a dedicated endpoint;
        // we trigger the async flow as a best-effort and show the native dialog.
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // triggers native browser dialog

            // Best-effort fire-and-forget (browser may cancel midway)
            handleAutoFinish().catch(() => { });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        // ── C) Hotkey block (Ctrl+R, F5, etc.) ────────────────────────────
        const preventRefresh = (e) => {
            if (BLOCKED_COMBINATIONS.some((combo) => useMatchHotkey(e, combo))) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', preventRefresh);

        // ── D) Clipboard lock ─────────────────────────────────────────────
        const noop = (e) => e.preventDefault();
        document.addEventListener('copy', noop);
        document.addEventListener('paste', noop);
        document.addEventListener('cut', noop);

        return () => {
            clearInterval(timerInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', preventRefresh);
            document.removeEventListener('copy', noop);
            document.removeEventListener('paste', noop);
            document.removeEventListener('cut', noop);
        };
        // handleAutoFinish & navigate are stable callbacks (useCallback + stable deps)
    }, [dispatch, handleAutoFinish, navigate]);

    // ── Per-question autosave ────────────────────────────────────────────────

    // const handleAnswerChange = useCallback((questionId, value) => {
    //     setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // }, []);

    // ── Render ───────────────────────────────────────────────────────────────

    const QuestionComponent =
        question?.question_type && QUESTION_COMPONENTS[question.question_type]
            ? QUESTION_COMPONENTS[question.question_type]
            : TextAnswer;

    return (
        <section className="bg-(--surface-container-lowest) text-(--on-surface) min-h-screen flex flex-col">
            {/* ── Header ── */}
            {/* <header className="w-full top-0 sticky z-50 bg-(--surface-container-lowest) px-4 md:px-6 py-12 max-w-390 flex flex-col md:flex-col justify-between items-center gap-4 mx-auto">
                <div className="flex items-center gap-6 md:w-auto">
                    <div className="flex flex-col">
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
                </div>

                <div className="flex-1 max-w-xl w-full md:mx-12">
                    <div className="h-2 w-full bg-(--surface-container-high) rounded-full overflow-hidden">
                        <div
                            className="h-full bg-(--primary) rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-(--tertiary-container)/10 border border-(--tertiary-container)/20 px-4 py-2 rounded-xl">
                    <span className="material-symbols-outlined text-(--tertiary-dim)">таймер</span>
                    <span className="font-headline font-extrabold text-xl text-(--tertiary-dim) tabular-nums">
                        {formatTime(elapsed)}
                    </span>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={handleFinish}
                        className="w-full md:w-auto px-10 py-4 rounded-xl bg-linear-to-r from-(--primary) to-(--primary-container) text-white font-headline font-extrabold text-lg shadow-xl shadow-(--primary)/20 hover:shadow-2xl hover:shadow-(--primary)/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Отправить
                        <MdOutlineTaskAlt />
                    </button>
                </div>
            </header> */}

            <header className="w-full sticky top-0 z-50 bg-(--surface-container-lowest) px-4 md:px-6 py-4">
                <div className="max-w-382.5 md:max-w-[1530px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* LEFT: Progress text */}
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

                    {/* CENTER: Progress bar */}
                    <div className="w-full md:flex-1 md:px-6 order-3 md:order-0">
                        <div className="h-2 w-full bg-(--surface-container-high) rounded-full overflow-hidden">
                            <div
                                className="h-full bg-(--primary) rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* RIGHT: Timer + Button */}
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">

                        {/* Timer */}
                        <div className="flex items-center gap-2 bg-(--tertiary-container)/10 border border-(--tertiary-container)/20 px-4 py-2 rounded-xl">
                            <span className="material-symbols-outlined text-(--tertiary-dim)">
                                timer
                            </span>
                            <span className="font-headline font-extrabold text-xl text-(--tertiary-dim) tabular-nums">
                                {formatTime(elapsed)}
                            </span>
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleFinish}
                            className="w-full md:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-(--primary) to-(--primary-container) text-white font-headline font-extrabold text-lg shadow-xl shadow-(--primary)/20 hover:shadow-2xl hover:shadow-(--primary)/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Отправить
                            <MdOutlineTaskAlt />
                        </button>

                    </div>

                </div>
            </header>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-8 max-w-400 mx-auto w-full">
                {/* ── Sidebar ── */}
                <aside className="w-full md:w-80 flex flex-col gap-8">
                    <div className="bg-(--surface-container-low) p-6 rounded-(--xl)">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                <img src={logoImage} alt="" />
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
                                const ans = answers[i];
                                const isAnswered =
                                    ans !== undefined &&
                                    ans !== '' &&
                                    (Array.isArray(ans) ? ans.length > 0 : true);

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
                                );
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
                                    value={
                                        // answers[question.id] ??
                                        // (question.type === 'multiple_choice' ? [] : '')
                                        answers[currentIndex] ?? (question.question_type === 'multiple_choice' ? [] : '')
                                    }
                                    onChange={
                                        // (value) => handleAnswerChange(question.id, value)
                                        (value) => dispatch(setQuizAnswer({ index: currentIndex, value }))
                                    }
                                />
                            </>
                        )}
                    </div>

                    {/* ── Footer nav ── */}
                    {/* <footer className="flex flex-col md:flex-row justify-between items-center gap-4 bg-(--surface-container-low) p-6 rounded-(--xl)">
                        <div className="flex gap-10 md:w-auto">
                            <button
                                onClick={() => dispatch(prevQuestion())}
                                disabled={currentIndex === 0}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--on-surface-variant) bg-(--surface-container-highest) hover:bg-(--surface-container-high) transition-all active:scale-95 disabled:opacity-50"
                            >
                                <FaChevronLeft />
                                Предыдущий
                            </button>
                            <button
                                onClick={() => dispatch(nextQuestion())}
                                disabled={currentIndex === total - 1}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--primary) bg-(--primary)/10 hover:bg-(--primary)/20 transition-all active:scale-95"
                            >
                                Следующий
                                <FaChevronRight />
                            </button>
                        </div>
                    </footer> */}

                    <footer className="flex flex-col md:flex-row items-center justify-between gap-4 bg-(--surface-container-low) p-6 rounded-(--xl) w-full">

                        {/* LEFT BUTTON */}
                        <button
                            onClick={() => dispatch(prevQuestion())}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--on-surface-variant) bg-(--surface-container-highest) hover:bg-(--surface-container-high) transition-all active:scale-95 disabled:opacity-50"
                        >
                            <FaChevronLeft />
                            Предыдущий
                        </button>

                        {/* RIGHT BUTTON */}
                        <button
                            onClick={() => dispatch(nextQuestion())}
                            disabled={currentIndex === total - 1}
                            className="flex items-center gap-2 px-6 py-4 rounded-(--xl) font-headline font-bold text-(--primary) bg-(--primary)/10 hover:bg-(--primary)/20 transition-all active:scale-95"
                        >
                            Следующий
                            <FaChevronRight />
                        </button>

                    </footer>
                </section>
            </main>

            <div className="fixed inset-0 pointer-events-none border-12 border-(--primary)/5 rounded-4xl z-100" />
        </section>
    );
};

export default TestPage;