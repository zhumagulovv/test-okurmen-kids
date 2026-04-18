// src/components/detail_catalog_test/DetailCatalogTest.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchSessions } from '../../features/sessionId/sessionIdSlice';
import { startTrainingSessionByKey, clearTrainingError } from '../../features/training/TrainingSessionSlice';

import ProCarousel from '../ControlledCarousel/ControlledCarousel';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '—';

// ── Skeleton card ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
    <div className="bg-(--surface-container-lowest) rounded-xl p-6 animate-pulse">
        <div className="w-16 h-6 bg-(--surface-container-high) rounded-full mb-4" />
        <div className="w-3/4 h-5 bg-(--surface-container-high) rounded mb-3" />
        <div className="w-full h-3 bg-(--surface-container-high) rounded mb-2" />
        <div className="w-5/6 h-3 bg-(--surface-container-high) rounded mb-6" />
        <div className="flex gap-4 mb-8">
            <div className="w-20 h-3 bg-(--surface-container-high) rounded" />
            <div className="w-16 h-3 bg-(--surface-container-high) rounded" />
        </div>
        <div className="w-full h-12 bg-(--surface-container-high) rounded-xl" />
    </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-(--on-surface-variant)">
        <div className="w-20 h-20 rounded-full bg-(--surface-container-high) flex items-center justify-center mb-4">
            <span className="text-4xl">📭</span>
        </div>
        <p className="font-headline font-bold text-xl opacity-40">Тренировочных сессий нет</p>
        <p className="text-sm mt-2 opacity-30">Попросите преподавателя создать тренировочную сессию</p>
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const DetailCatalogTest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Sessions list
    const { sessionsID, loading: sessionsLoading, error: sessionsError } =
        useSelector((state) => state.sessionID);

    // Training auth state
    const { loading: trainingLoading, error: trainingError, activeKey } =
        useSelector((state) => state.trainingSession);

    useEffect(() => {
        dispatch(fetchSessions());
        // Clear any leftover error from a previous visit
        dispatch(clearTrainingError());
    }, [dispatch]);

    // Handle card button click
    const handleStart = async (sessionKey) => {
        if (trainingLoading) return; // prevent double-click

        const result = await dispatch(startTrainingSessionByKey(sessionKey));

        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/name-page');
        }
        // On rejection the error surfaces in trainingSession.error
    };

    // Filter to only training sessions
    const trainingSessions = sessionsID.filter(
        (s) => s.session_type === 'training'
    );

    return (
        <section className="bg-(--surface) text-(--on-surface) min-h-screen pb-32">
            <div className="bg-[#efefff] dark:bg-slate-800 h-1 w-full" />

            <main className="max-w-7xl mx-auto px-6 pt-8">
                <ProCarousel />

                {/* ── Section header ──────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h3 className="text-2xl font-bold">Задания на развитие навыков</h3>
                        <p className="text-(--on-surface-variant)">
                            Выберите модуль, чтобы проверить своё техническое мастерство
                        </p>
                    </div>
                </div>

                {/* ── Global error (session fetch) ────────────────────────── */}
                {sessionsError && (
                    <div className="mb-6 px-5 py-4 bg-(--error)/10 border border-(--error)/20 text-(--error) rounded-xl text-sm font-medium">
                        ⚠ {sessionsError}
                    </div>
                )}

                {/* ── Training auth error ─────────────────────────────────── */}
                {trainingError && (
                    <div className="mb-6 px-5 py-4 bg-(--error)/10 border border-(--error)/20 text-(--error) rounded-xl text-sm font-medium">
                        ⚠ {trainingError}
                    </div>
                )}

                {/* ── Cards grid ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessionsLoading ? (
                        Array(6)
                            .fill(0)
                            .map((_, i) => <SkeletonCard key={i} />)
                    ) : trainingSessions.length === 0 ? (
                        <EmptyState />
                    ) : (
                        trainingSessions.map((session) => {
                            const isThisCardLoading =
                                trainingLoading && activeKey === session.key;

                            return (
                                <div
                                    key={session.id}
                                    className="group bg-(--surface-container-lowest) rounded-xl p-6 transition-all hover:translate-y-0.5 hover:shadow-lg relative flex flex-col"
                                >
                                    {/* Active badge */}
                                    {(session.is_active || session.is_valid) && (
                                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Активна
                                        </span>
                                    )}

                                    {/* Test title */}
                                    <h4 className="text-xl font-bold mb-1 pr-20 leading-snug">
                                        {session.test_title ?? session.title ?? 'Тренировка'}
                                    </h4>

                                    {/* Session title (if different) */}
                                    {session.title && session.title !== session.test_title && (
                                        <p className="text-sm text-(--on-surface-variant) mb-1">
                                            {session.title}
                                        </p>
                                    )}

                                    {/* Date */}
                                    <p className="text-sm text-(--on-surface-variant) mb-6">
                                        {formatDate(session.created_at)}
                                    </p>

                                    {/* Spacer pushes button to bottom */}
                                    <div className="flex-1" />

                                    {/* Start button */}
                                    <button
                                        onClick={() => handleStart(session.key)}
                                        disabled={trainingLoading}
                                        className="w-full py-4 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-linear-to-r from-(--primary) to-(--primary-dim) text-(--on-primary) cursor-pointer"
                                    >
                                        {isThisCardLoading ? (
                                            <>
                                                {/* Inline spinner */}
                                                <svg
                                                    className="animate-spin h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12" cy="12" r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                    />
                                                </svg>
                                                Подключение...
                                            </>
                                        ) : (
                                            'Начать практику'
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </section>
    );
};

export default DetailCatalogTest;