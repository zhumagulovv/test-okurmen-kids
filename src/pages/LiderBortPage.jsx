import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ── Icons ────────────────────────────────────────────────────────────────────
import { FiSearch, FiRefreshCw, FiAward, FiClock, FiUsers, FiZap } from 'react-icons/fi'
import { HiMiniTrophy } from 'react-icons/hi2'
import { MdOutlineFilterList } from 'react-icons/md'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { RiVipCrownLine } from 'react-icons/ri'

import {
    fetchLeaderboard,
    fetchLeaderboardById,
    setSelectedSessionId,
} from '../features/leaderboard/leaderboardSlice'

import Dropdown from '../components/common/Dropdown'
import { fetchSessions, selectSessionOptions } from '../features/sessionId/sessionIdSlice'

import { CATEGORIES, SORT_OPTIONS } from '../constants/constants'
import { formatDuration, medalColor, scoreColor } from '../helpers/helpers'
import StatsSkeleton from '../components/common/StatsSkeleton'

const PAGE_SIZE = 10

const LiderBortPage = () => {
    const dispatch = useDispatch()
    const { global: globalBoard, session: sessionBoard, selectedSessionId, loading, error } =
        useSelector((s) => s.leaderboard)
    const sessionOptions = useSelector(selectSessionOptions)

    // ── Local state ──────────────────────────────────────────────────────────
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('rank')
    const [page, setPage] = useState(1)

    // ── On mount: load global leaderboard + session list ONLY ────────────────
    // ✅ Never auto-selects a session — global is always the default view
    useEffect(() => {
        dispatch(fetchLeaderboard())
        dispatch(fetchSessions())
    }, [dispatch])

    // ── Handle session selection from dropdown ───────────────────────────────
    const handleSessionSelect = useCallback((id) => {
        dispatch(setSelectedSessionId(id))
        dispatch(fetchLeaderboardById(id))
        setPage(1)
    }, [dispatch])

    // ── Handle reset: clear session → back to global ─────────────────────────
    const handleReset = useCallback(() => {
        dispatch(setSelectedSessionId(''))
        dispatch(fetchLeaderboard())
        setPage(1)
    }, [dispatch])

    // ── Handle manual refresh ────────────────────────────────────────────────
    const handleRefresh = useCallback(() => {
        if (selectedSessionId) {
            dispatch(fetchLeaderboardById(selectedSessionId))
        } else {
            dispatch(fetchLeaderboard())
        }
    }, [dispatch, selectedSessionId])

    // ── Raw rows: session board when a session is selected, global otherwise ──
    // ✅ This is the single source of truth for which board to display
    const rawRows = useMemo(() => {
        const board = selectedSessionId ? sessionBoard : globalBoard
        return board?.results ?? []
    }, [selectedSessionId, sessionBoard, globalBoard])

    // ── Apply category filter ────────────────────────────────────────────────
    const categoryFiltered = useMemo(() => {
        switch (category) {
            case 'top10': return rawRows.filter((r) => (r.rank ?? rawRows.indexOf(r) + 1) <= 10)
            case 'passed': return rawRows.filter((r) => r.score >= 75)
            case 'failed': return rawRows.filter((r) => r.score < 75)
            default: return rawRows
        }
    }, [rawRows, category])

    // ── Apply search ─────────────────────────────────────────────────────────
    const searched = useMemo(() => {
        if (!search.trim()) return categoryFiltered
        const q = search.toLowerCase()
        return categoryFiltered.filter((r) => r.student_name?.toLowerCase().includes(q))
    }, [categoryFiltered, search])

    // ── Apply sort ───────────────────────────────────────────────────────────
    const sorted = useMemo(() => {
        const arr = [...searched]
        switch (sortBy) {
            case 'score': return arr.sort((a, b) => b.score - a.score)
            case 'duration': return arr.sort((a, b) => (a.duration_seconds ?? Infinity) - (b.duration_seconds ?? Infinity))
            case 'name': return arr.sort((a, b) => a.student_name?.localeCompare(b.student_name ?? ''))
            default: return arr.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
        }
    }, [searched, sortBy])

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
    const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleCategoryChange = (id) => { setCategory(id); setPage(1) }
    const handleSortChange = (val) => { setSortBy(val); setPage(1) }

    // ── Stats ────────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        if (!rawRows.length) return null
        const scores = rawRows.map((r) => r.score ?? 0)
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length
        const passed = scores.filter((s) => s >= 75).length
        const top = rawRows.find((r) => r.rank === 1)
        return { avg: avg.toFixed(1), passed, total: rawRows.length, top }
    }, [rawRows])

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <section className="bg-(--background) text-(--on-surface) min-h-screen pb-24 font-body">

            {/* ── HERO BANNER ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-linear-to-br from-(--primary) to-(--secondary) px-6 py-14 md:py-20">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-96 h-40 rounded-full bg-white/5 pointer-events-none blur-2xl" />

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                            <HiMiniTrophy className="text-4xl text-white" />
                        </div>
                        <div>
                            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                                Таблица лидеров
                            </h1>
                            <p className="text-white/70 mt-1 text-lg">
                                Рейтинг лучших студентов по результатам тестирования
                            </p>
                        </div>
                    </div>

                    {/* ── Session dropdown + Reset ───────────────────────── */}
                    {/* ✅ Extracted into named handlers — no inline dispatch logic */}
                    <div className="flex-1 md:max-w-md flex gap-3 mt-6 md:mt-0 md:ml-auto">
                        <div className="flex-1">
                            <Dropdown
                                options={sessionOptions}
                                value={selectedSessionId}
                                placeholder="Выберите сессию..."
                                variant="hero"
                                onChange={handleSessionSelect}
                            />
                        </div>
                        <button
                            onClick={handleReset}
                            className="hover:underline px-5 py-3 bg-white text-(--primary) font-bold rounded-xl hover:bg-white/90 transition-all active:scale-95 text-sm whitespace-nowrap cursor-pointer"
                        >
                            Сбросить
                        </button>
                    </div>
                </div>

                {/* ── Stats strip ───────────────────────────────────────── */}
                {loading ? (
                    <StatsSkeleton />
                ) : stats && (
                    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: FiUsers, label: 'Участников', value: stats.total ?? 0 },
                            { icon: FiAward, label: 'Средний балл', value: stats.avg ? `${stats.avg}%` : 'Нет данных' },
                            { icon: FiZap, label: 'Прошли (≥75%)', value: stats.passed ?? 0 },
                            { icon: RiVipCrownLine, label: 'Лидер', value: stats.top?.student_name?.split(' ')[0] ?? 'Нет данных' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-white/10 rounded-xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm">
                                <Icon className="text-white/70 text-2xl shrink-0" />
                                <div>
                                    <div className="text-white font-headline font-bold text-xl">{value}</div>
                                    <div className="text-white/60 text-xs">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── CONTENT ─────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* ── Categories ──────────────────────────────────────────── */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => handleCategoryChange(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95
                                ${category === id
                                    ? 'bg-(--primary) text-white shadow-lg shadow-(--primary)/20'
                                    : 'bg-(--surface-container-lowest) text-(--on-surface-variant) hover:bg-(--surface-container-high) border border-(--outline-variant)/20'
                                }`}
                        >
                            <Icon className="text-base" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── Toolbar ─────────────────────────────────────────────── */}
                <div className="bg-(--surface-container-lowest) rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-center border border-(--outline-variant)/10">
                    <div className="relative flex-1 w-full">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-(--on-surface-variant) text-lg" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Поиск по имени студента..."
                            className="w-full bg-(--surface-container) border-none rounded-xl py-3 pl-11 pr-4 text-(--on-surface) placeholder:text-(--on-surface-variant)/50 focus:ring-2 focus:ring-(--primary)/30 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <MdOutlineFilterList className="text-(--on-surface-variant) text-xl shrink-0" />
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="bg-(--surface-container) text-(--on-surface) rounded-xl py-3 px-4 border-none focus:ring-2 focus:ring-(--primary)/30 focus:outline-none font-semibold text-sm"
                        >
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-(--surface-container) text-(--on-surface-variant) hover:bg-(--surface-container-high) transition-all font-semibold text-sm disabled:opacity-50"
                    >
                        <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                        Обновить
                    </button>
                </div>

                {/* ── Error ───────────────────────────────────────────────── */}
                {error && (
                    <div className="bg-(--error)/10 text-(--error) border border-(--error)/20 rounded-xl px-5 py-4 mb-6 text-sm font-semibold">
                        ⚠ {error}
                    </div>
                )}

                {/* ── Loading skeleton ─────────────────────────────────────── */}
                {loading && (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-20 bg-(--surface-container-lowest) rounded-2xl animate-pulse border border-(--outline-variant)/10" />
                        ))}
                    </div>
                )}

                {/* ── Empty ───────────────────────────────────────────────── */}
                {!loading && sorted.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-(--on-surface-variant)">
                        <HiMiniTrophy className="text-6xl opacity-20 mb-4" />
                        <p className="font-headline font-bold text-xl opacity-40">Результатов не найдено</p>
                        <p className="text-sm mt-2 opacity-30">
                            {search ? 'Попробуйте изменить запрос' : 'Данные ещё не загружены или список пуст'}
                        </p>
                    </div>
                )}

                {/* ── TOP-3 podium ─────────────────────────────────────────── */}
                {!loading && !search && category === 'all' && sorted.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[sorted[1], sorted[0], sorted[2]].map((row, podiumIdx) => {
                            if (!row) return null
                            const realRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
                            const heights = ['h-36', 'h-40', 'h-32']
                            const bgMap = [
                                'bg-linear-to-b from-gray-100 to-gray-50 border-gray-200',
                                'bg-linear-to-b from-amber-50 to-amber-100/60 border-amber-300',
                                'bg-linear-to-b from-orange-50 to-orange-100/50 border-orange-200',
                            ]
                            return (
                                <div
                                    key={row.attempt_id ?? row.student_name}
                                    className={`relative flex flex-col items-center justify-end rounded-2xl border-2 px-4 py-5 text-center transition-all ${heights[podiumIdx]} ${bgMap[podiumIdx]}`}
                                >
                                    <div
                                        className="absolute -top-5 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold font-headline text-lg shadow-lg"
                                        style={{ background: medalColor(realRank) }}
                                    >
                                        {realRank}
                                    </div>
                                    <p className="font-headline font-bold text-sm text-(--on-surface) truncate w-full">
                                        {row.student_name}
                                    </p>
                                    <p
                                        className="text-2xl font-extrabold font-headline mt-1"
                                        style={{ color: scoreColor(row.score) }}
                                    >
                                        {Math.round(row.score ?? 0)}%
                                    </p>
                                    {row.duration_seconds != null && (
                                        <p className="text-xs text-(--on-surface-variant) mt-1 flex items-center gap-1">
                                            <FiClock className="text-xs" />
                                            {formatDuration(row.duration_seconds)}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* ── Table ───────────────────────────────────────────────── */}
                {!loading && sorted.length > 0 && (
                    <div className="bg-(--surface-container-lowest) rounded-2xl overflow-hidden border border-(--outline-variant)/10 shadow-sm">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-(--surface-container-low) text-xs font-bold uppercase tracking-wider text-(--on-surface-variant)">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5">Студент</div>
                            <div className="col-span-3 text-center">Балл</div>
                            <div className="col-span-3 text-center">Время</div>
                        </div>

                        <div className="divide-y divide-(--outline-variant)/10">
                            {paginated.map((row, i) => {
                                const globalIndex = (page - 1) * PAGE_SIZE + i
                                const rank = row.rank ?? globalIndex + 1
                                const medal = medalColor(rank)

                                return (
                                    <div
                                        key={row.attempt_id ?? row.student_name}
                                        className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-(--surface-container-low) transition-colors
                                            ${rank <= 3 ? 'bg-amber-50/30' : ''}`}
                                    >
                                        <div className="col-span-1 flex justify-center">
                                            {medal ? (
                                                <div
                                                    className="w-6 h-6 flex items-center justify-center font-extrabold text-sm font-headline tabular-nums sm:rounded-full sm:text-white sm:shadow"
                                                    style={{
                                                        background: window.innerWidth >= 640 ? medal : 'transparent',
                                                        color: window.innerWidth < 640 ? medal : 'white'
                                                    }}
                                                >
                                                    {rank}
                                                </div>
                                            ) : (
                                                <span className="font-bold text-(--on-surface-variant) tabular-nums">
                                                    {rank}
                                                </span>
                                            )}
                                        </div>

                                        <div className="col-span-5 flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold font-headline text-sm shrink-0"
                                                style={{ background: `hsl(${(rank * 67) % 360}, 55%, 50%)` }}
                                            >
                                                {row.student_name?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                            <span className="font-semibold text-(--on-surface) truncate">
                                                {row.student_name ?? '—'}
                                            </span>
                                        </div>

                                        <div className="col-span-3 flex justify-center">
                                            <div className="text-center">
                                                <div
                                                    className="text-xl font-extrabold font-headline tabular-nums"
                                                    style={{ color: scoreColor(row.score ?? 0) }}
                                                >
                                                    {Math.round(row.score ?? 0)}%
                                                </div>
                                                <div className="w-20 h-1.5 bg-(--surface-container-high) rounded-full mt-1 mx-auto overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${row.score ?? 0}%`,
                                                            background: scoreColor(row.score ?? 0),
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-3 text-center text-(--on-surface-variant) font-medium text-sm flex items-center justify-center gap-1">
                                            <FiClock className="text-xs shrink-0" />
                                            {formatDuration(row.duration_seconds)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ── Pagination ───────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--surface-container-lowest) hover:bg-(--surface-container-high) transition-colors text-(--on-surface) disabled:opacity-40 border border-(--outline-variant)/10"
                        >
                            <LuChevronLeft />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…')
                                acc.push(p)
                                return acc
                            }, [])
                            .map((item, idx) =>
                                item === '…' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-(--on-surface-variant)">…</span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => setPage(item)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all
                                            ${page === item
                                                ? 'bg-(--primary) text-white shadow-lg shadow-(--primary)/20'
                                                : 'bg-(--surface-container-lowest) text-(--on-surface) hover:bg-(--surface-container-high) border border-(--outline-variant)/10'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--surface-container-lowest) hover:bg-(--surface-container-high) transition-colors text-(--on-surface) disabled:opacity-40 border border-(--outline-variant)/10"
                        >
                            <LuChevronRight />
                        </button>
                    </div>
                )}

                <p className="text-center text-(--on-surface-variant)/50 text-xs mt-10">
                    Показано {paginated.length} из {sorted.length} результатов
                    {selectedSessionId ? ' в выбранной сессии' : ' (глобальный рейтинг)'}
                </p>
            </div>
        </section>
    )
}

export default LiderBortPage