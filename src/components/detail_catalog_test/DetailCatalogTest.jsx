import React from 'react';

const DetailCatalogTest = () => {
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
                        <h3 className="text-2xl font-bold">Skill Challenges</h3>
                        <p className="text-(on-surface-variant)">
                            Select a module to test your technical mastery
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <span className="px-4 py-2 rounded-full bg-(--surface-container-high) text-sm font-semibold">
                            All Levels
                        </span>
                        <span className="px-4 py-2 rounded-full bg-(--surface-container-lowest) text-(--primary) text-sm font-semibold shadow-sm">
                            Popular
                        </span>
                    </div>
                </div>

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* CARD 1 */}
                    <div className="group bg-(--surface-container-lowest) rounded-xl p-6 transition-all hover:translate-y-1">
                        <h4 className="text-xl font-bold mb-2">Python Foundations</h4>
                        <p className="text-sm mb-6 text-(--on-surface-variant)">
                            Variables, basic math, and your first "Hello World".
                        </p>

                        <div className="flex items-center gap-4 mb-8 text-xs font-bold text-(--on-surface-variant)/80">
                            <div>12 Questions</div>
                            <div>15 Min</div>
                        </div>

                        <button className="w-full py-4 rounded-xl bg-linear-to-r from-(--primary) to-(--primary-dim) text-(--on-primary) font-bold">
                            Start Practice
                        </button>
                    </div>

                    {/* CARD 2 */}
                    <div className="md:col-span-2 group bg-(--surface-container-high) rounded-xl p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold mb-2">Loops & Logic Gates</h4>
                            <p className="text-sm mb-6 text-(--on-surface-variant)">
                                IF, FOR loops and boolean logic.
                            </p>

                            <div className="flex gap-6 mb-8 text-xs font-bold">
                                <div>20 Questions</div>
                                <div>30 Min</div>
                                <div className="text-(--primary)">+500 XP</div>
                            </div>

                            <button className="px-8 py-4 rounded-xl bg-linear-to-r from-(--primary) to-(--primary-dim) text-(--on-primary) font-bold">
                                Start Practice
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </section>
    );
};

export default DetailCatalogTest;