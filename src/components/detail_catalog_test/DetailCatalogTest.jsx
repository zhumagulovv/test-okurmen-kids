import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTest } from '../../features/tests/testsSlice';
import { useSearchParams } from 'react-router-dom';

const getLevelStyle = (level) => {
    switch (level?.toLowerCase()) {
        case 'easy':
            return 'bg-emerald-100 text-emerald-700'
        case 'medium':
            return 'bg-amber-100 text-amber-700'
        case 'hard':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-(--surface-container-high) text-(--on-surface-variant)'
    }
}

const levels = [
    { id: 1, level: "Easy" },
    { id: 2, level: "Medium" },
    { id: 3, level: "Hard" },
]

const DetailCatalogTest = () => {
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const activeLevel = searchParams.get('level')

    const dispatch = useDispatch()
    const { tests, loading, error } = useSelector((state) => state.tests)

    useEffect(() => {
        dispatch(fetchAllTest(activeLevel))
    }, [dispatch, activeLevel])

    if (error) return <div>{error}</div>

    const handleLevelChange = (level) => {
        if (!level) {
            setSearchParams({})
        } else {
            setSearchParams({ level })
        }
    }

    return (
        <section className="bg-(--surface) text-(--on-surface) min-h-screen pb-32">
            <div className="bg-[#efefff] dark:bg-slate-800 h-1 w-full"></div>

            <main className="max-w-7xl mx-auto px-6 pt-8">

                {/* HERO */}
                <div className="relative overflow-hidden rounded-xl mb-12 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 bg-linear-to-br from-(--primary) to-(--primary-container) text-(--on-primary)">

                    <div className="relative z-10 flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-4">
                            <span className="text-xs font-bold tracking-wider uppercase">
                                Programming Track
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                            Master the Art of Python
                        </h2>

                        <p className="text-lg opacity-90 max-w-xl">
                            From logic gates to cloud architecture, start your journey into the most versatile language of the digital age.
                        </p>
                    </div>

                    <div className="w-full md:w-1/3 aspect-square relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>

                        <img
                            alt="Python Logo"
                            className="w-48 h-48 relative z-10"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCG-r_Cu6GcsW01BnoK2wPTeYY2nKCI-GOeGEW2Q4-opL7ia93uGKYwCQOlr0sHoFnZgKFwkKLOY9L2TfshPMhGmRBsJj-gAxxuFIfHWdbmwBqHDjD6CI4VYdS9tbQ554o7j9ERK5XL2Rm9yOPjrDBSNk15RENpujcIzICtEBA3KfzqyRCtjDgBnmibd_hK7X2DhVEkPDISfoCfMG8jvXPgpzaq3L7Agyjn4tk4kkNaaYqMOAXFQvyalG8ZcSwWaS1lnulkv3o2HA"
                        />
                    </div>
                </div>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h3 className="text-2xl font-bold">Задания на развитие навыков</h3>
                        <p className="text-(on-surface-variant)">
                            Выберите модуль, чтобы проверить своё техническое мастерство
                        </p>
                    </div>

                    <div className="flex gap-2">

                        {loading ? (
                            <>
                                <div className="w-28 h-10 rounded-full bg-(--surface-container-high) animate-pulse" />
                                <div className="w-20 h-10 rounded-full bg-(--surface-container-high) animate-pulse" />
                                <div className="w-24 h-10 rounded-full bg-(--surface-container-high) animate-pulse" />
                                <div className="w-20 h-10 rounded-full bg-(--surface-container-high) animate-pulse" />
                            </>
                        ) : (
                            <>
                                <span
                                    onClick={() => handleLevelChange(null)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer ${!activeLevel
                                        ? 'bg-(--primary) text-white'
                                        : 'bg-(--surface-container-high) text-(--on-surface-variant)'
                                        }`}
                                >
                                    All Levels
                                </span>

                                {levels.map((l) => {
                                    const levelValue = l.level.toLowerCase()

                                    return (
                                        <span
                                            key={l.id}
                                            onClick={() => handleLevelChange(levelValue)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm cursor-pointer ${activeLevel === levelValue
                                                ? 'bg-(--primary) text-white'
                                                : 'bg-(--surface-container-lowest) text-(--primary)'
                                                }`}
                                        >
                                            {l.level}
                                        </span>
                                    )
                                })}
                            </>
                        )}

                    </div>
                </div>

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* CARD */}
                    {
                        loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-(--surface-container-lowest) rounded-xl p-6 animate-pulse"
                                >
                                    {/* badge */}
                                    <div className="w-16 h-6 bg-(--surface-container-high) rounded-full mb-4" />

                                    {/* title */}
                                    <div className="w-3/4 h-5 bg-(--surface-container-high) rounded mb-3" />

                                    {/* description */}
                                    <div className="w-full h-3 bg-(--surface-container-high) rounded mb-2" />
                                    <div className="w-5/6 h-3 bg-(--surface-container-high) rounded mb-6" />

                                    {/* info */}
                                    <div className="flex gap-4 mb-8">
                                        <div className="w-20 h-3 bg-(--surface-container-high) rounded" />
                                        <div className="w-16 h-3 bg-(--surface-container-high) rounded" />
                                    </div>

                                    {/* button */}
                                    <div className="w-full h-12 bg-(--surface-container-high) rounded-xl" />
                                </div>
                            ))
                        ) : (
                            tests.map((test) => (
                                <div
                                    key={test.id}
                                    className="group bg-(--surface-container-lowest) rounded-xl p-6 transition-all hover:translate-y-1 relative"
                                >
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getLevelStyle(test.level)}`}
                                    >
                                        {test.level}
                                    </span>

                                    <h4 className="text-xl font-bold mb-2">{test.title}</h4>

                                    <p className="text-sm mb-6 text-(--on-surface-variant)">
                                        {test.description ? test.description : "More coding"}
                                    </p>

                                    <div className="flex items-center gap-4 mb-8 text-xs font-bold text-(--on-surface-variant)/80">
                                        <div>{test.question_count} Questions</div>
                                        <div>15 Min</div>
                                    </div>

                                    <button className="w-full py-4 rounded-xl bg-linear-to-r from-(--primary) to-(--primary-dim) text-(--on-primary) font-bold">
                                        Start Practice
                                    </button>
                                </div>
                            ))
                        )
                    }
                </div>
            </main>
        </section>
    );
};

export default DetailCatalogTest;