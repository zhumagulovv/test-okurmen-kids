import { useCallback, useEffect, useState } from 'react'
import { IoMdSearch, IoMdTrendingUp } from 'react-icons/io'

import Dropdown from '../components/common/Dropdown'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetResult, selectAverageScore, selectCurrentPage, selectFilteredStudents, selectFilters, selectGroupOptions, selectMeta, selectPagedStudents, selectResultError, selectResultStatus, selectTopStudents, selectTotalPages, setGroupFilter, setPage, setStatusFilter } from '../features/resultTable/resultTableSlice'
import SkeletonCard from '../components/common/SkeletonCard'
import Pagination from '../components/common/Pagination'
import StudentCard from '../components/common/StudentCard'
import { fetchSessions, resetSessions, selectActiveSession, selectActiveSessionId, selectSessionOptions, selectSessionStatus, setActiveSession } from '../features/sessionId/sessionIdSlice'

const RESULT_STATUS_OPTIONS = ['Любой статус', 'Completed', 'In Progress', 'Pending', 'Review']

const TableResultPage = () => {
    const dispatch = useDispatch()

    // ── Session state ──
    const activeSessionId = useSelector(selectActiveSessionId)
    const sessionOptions = useSelector(selectSessionOptions)
    const sessionStatus = useSelector(selectSessionStatus)
    const activeSession = useSelector(selectActiveSession)

    // ── Result state ──
    const students = useSelector(selectPagedStudents)
    const filtered = useSelector(selectFilteredStudents)
    const totalPages = useSelector(selectTotalPages)
    const currentPage = useSelector(selectCurrentPage)
    const filters = useSelector(selectFilters)
    const groupOptions = useSelector(selectGroupOptions)
    const meta = useSelector(selectMeta)
    const status = useSelector(selectResultStatus)
    const error = useSelector(selectResultError)
    const avgScore = useSelector(selectAverageScore)
    const topStudents = useSelector(selectTopStudents)

    // 1. Fetch sessions list on mount; clean up on unmount
    useEffect(() => {
        dispatch(fetchSessions())
        return () => {
            dispatch(resetSessions())
            dispatch(resetResult())
        }
    }, [dispatch])

    // 2. Whenever activeSessionId changes, re-fetch the result table
    useEffect(() => {
        if (activeSessionId) {
            dispatch(resetResult())
            dispatch(fetchResultTable(activeSessionId))
        }
    }, [dispatch, activeSessionId])

    const handleSessionChange = useCallback(
        (value) => dispatch(setActiveSession(Number(value))),
        [dispatch]
    )
    const handleSearch = useCallback(
        (e) => dispatch(setSearch(e.target.value)),
        [dispatch]
    )
    const handleGroupChange = useCallback((val) => dispatch(setGroupFilter(val)), [dispatch])
    const handleStatusChange = useCallback((val) => dispatch(setStatusFilter(val)), [dispatch])
    const handlePageChange = useCallback((page) => dispatch(setPage(page)), [dispatch])

    const isLoading = status === 'loading' || sessionStatus === 'loading'

    return (
        <section className="bg-(--background) font-body text-(--on-surface) min-h-screen pb-32">
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Header stats ── */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Title + session picker */}
                        <div>
                            <h1 className="font-headline text-4xl font-extrabold text-(--on-surface) tracking-tight mb-2">
                                Аналитика успеваемости
                            </h1>
                            <p className="text-(--on-surface-variant) text-lg mb-4">
                                Подробный анализ прогресса студентов и результатов экзаменов.
                            </p>

                            {/* Session selector — only shown when multiple sessions exist */}
                            {sessionOptions.length > 1 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-(--on-surface-variant) font-medium whitespace-nowrap">
                                        Сессия:
                                    </span>
                                    <select
                                        className="bg-(--surface-container-lowest) border border-(--surface-container) rounded-xl py-2 px-3 text-sm text-(--on-surface) focus:ring-2 focus:ring-(--primary)/40"
                                        value={activeSessionId ?? ''}
                                        onChange={(e) => handleSessionChange(e.target.value)}
                                    >
                                        {sessionOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Active session ID badge */}
                            {activeSession && (
                                <p className="mt-2 text-xs text-(--on-surface-variant)">
                                    ID сессии:{' '}
                                    <code className="bg-(--surface-container) px-1.5 py-0.5 rounded text-xs">
                                        {activeSession.id}
                                    </code>
                                </p>
                            )}
                        </div>

                        {/* Top students card */}
                        <div className="bg-(--surface-container-lowest) p-6 rounded-2xl shadow-[0_8px_24px_rgba(36,44,81,0.02)] border border-(--surface-container)">
                            <h3 className="text-(--on-surface-variant) font-bold text-sm uppercase mb-2">
                                Лучшие ученики
                            </h3>
                            <div className="text-3xl font-black text-(--on-surface)">
                                {topStudents.length}{' '}
                                <span className="text-sm font-medium text-(--on-surface-variant)">Студенты</span>
                            </div>
                            <div className="mt-4 flex -space-x-3">
                                {topStudents.slice(0, 3).map((s) => (
                                    s.avatar ? (
                                        <img
                                            key={s.id}
                                            className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) object-cover"
                                            src={s.avatar}
                                            alt={s.name}
                                        />
                                    ) : (
                                        <div
                                            key={s.id}
                                            className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) bg-(--secondary-container) text-(--on-secondary-container) flex items-center justify-center text-sm font-bold"
                                        >
                                            {s.name?.[0]}
                                        </div>
                                    )
                                ))}
                                {topStudents.length > 3 && (
                                    <div className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) bg-(--primary-container) text-(--on-primary-container) flex items-center justify-center text-xs font-bold">
                                        +{topStudents.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Average score card */}
                        <div className="bg-(--surface-container-lowest) p-6 rounded-2xl shadow-[0_8px_24px_rgba(36,44,81,0.02)] border border-(--surface-container)">
                            <h3 className="text-(--on-surface-variant) font-bold text-sm uppercase mb-2">Средний балл</h3>
                            <div className="text-3xl font-black text-(--on-surface)">
                                {isLoading ? '...' : `${avgScore}/100`}
                            </div>
                            {meta.averageScore > 0 && (
                                <div className="mt-2 text-(--tertiary-dim) flex items-center gap-1 font-bold">
                                    <IoMdTrendingUp className="text-2xl" />
                                    +5.2% за последний семестр
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Filters ── */}
                <section className="mb-8">
                    <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative w-full lg:flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--on-surface-variant)">
                                <IoMdSearch className="text-2xl" />
                            </span>
                            <input
                                className="w-full bg-(--surface-container-lowest) border-none focus:ring-2 focus:ring-(--primary)/40 rounded-xl py-3 pl-12 pr-4 text-(--on-surface) placeholder:text-(--on-surface-variant)/60"
                                placeholder="Поиск по имени студента, группе или ID..."
                                type="text"
                                value={filters.search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Dropdown
                                options={groupOptions}
                                value={filters.group || 'Все группы'}
                                onChange={handleGroupChange}
                                placeholder="Все группы"
                            />
                            <Dropdown
                                options={RESULT_STATUS_OPTIONS}
                                value={filters.status || 'Любой статус'}
                                onChange={handleStatusChange}
                                placeholder="Любой статус"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Results count ── */}
                {!isLoading && status === 'succeeded' && (
                    <p className="text-(--on-surface-variant) text-sm mb-4">
                        Показано {students.length} из {filtered.length} студентов
                    </p>
                )}

                {/* ── Error state ── */}
                {(status === 'failed' || sessionStatus === 'failed') && (
                    <div className="bg-(--error-container)/20 text-(--error) rounded-2xl p-6 mb-6 font-medium">
                        {error ?? 'Не удалось загрузить данные. Попробуйте ещё раз.'}
                    </div>
                )}

                {/* ── No sessions found ── */}
                {!activeSessionId && sessionStatus === 'succeeded' && (
                    <div className="text-center py-16 text-(--on-surface-variant)">
                        <p className="text-lg font-medium">Сессии не найдены</p>
                        <p className="text-sm mt-1">Создайте сессию, чтобы просмотреть результаты</p>
                    </div>
                )}

                {/* ── Student list ── */}
                {activeSessionId && (
                    <div className="space-y-4">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                            : students.length > 0
                                ? students.map((student) => <StudentCard key={student.id} student={student} />)
                                : status === 'succeeded' && (
                                    <div className="text-center py-16 text-(--on-surface-variant)">
                                        <p className="text-lg font-medium">Студенты не найдены</p>
                                        <p className="text-sm mt-1">Попробуйте изменить фильтры поиска</p>
                                    </div>
                                )
                        }
                    </div>
                )}

                {/* ── Pagination ── */}
                {!isLoading && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </main>
        </section>
    )
}

export default TableResultPage