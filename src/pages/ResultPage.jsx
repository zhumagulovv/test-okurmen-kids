import React from 'react'
import { useNavigate } from 'react-router-dom'

import { BsFillCheckCircleFill } from 'react-icons/bs'
import { MdOutlineErrorOutline, MdOutlineQuiz } from 'react-icons/md'

const ResultPage = () => {
    const navigate = useNavigate()
    return (
        <main className="max-w-5xl mx-auto px-6 pt-12 pb-32">
            <section className="relative mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">

                            <svg className="w-full h-full transform-rotate-90">
                                <circle className="text-(--surface-container-high)" cx="50%" cy="50%" fill="transparent" r="45%"
                                    stroke="currentColor" stroke-width="12"></circle>
                                <circle className="text-(--primary)" cx="50%" cy="50%" fill="transparent" r="45%"
                                    stroke="currentColor" stroke-dasharray="283" stroke-dashoffset="42"
                                    stroke-linecap="round" stroke-width="12"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span
                                    className="text-6xl md:text-7xl font-black font-headline tracking-tighter text-(--on-surface)">85%</span>
                                <span
                                    className="text-sm font-bold uppercase tracking-widest text-(--primary-fixed-dim) font-headline">Счёт</span>
                            </div>
                            <div
                                className="absolute -top-4 -right-4 w-12 h-12 bg-(--tertiary-fixed) rounded-full blur-xl opacity-40">
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-(--secondary) rounded-full blur-2xl opacity-20">
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        <div>
                            <span
                                className="inline-block px-4 py-1.5 rounded-full bg-(--secondary-container) text-(--on-secondary-container) text-sm font-bold font-label mb-4">Основы Python: Модуль 1</span>
                            <h1 className="text-5xl md:text-6xl font-black font-headline text-(--on-background) leading-tight">
                                85% - Отличная работа!
                            </h1>
                            <p className="text-lg text-(--on-surface-variant) max-w-md mt-4 font-medium">
                                Вы официально освоили базовую логику циклов в Python. Ваш цифровой ателье расширяется новыми навыками!
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                            <button
                                className="px-8 py-4 rounded-xl bg-(--surface-container-highest) text-(--on-primary-container) font-bold text-lg hover:bg-(--surface-container-high) transition-all active:scale-95"

                                onClick={() => navigate('/')}>
                                Вернуться на главную
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div
                    className="bg-(--surface-container-lowest) p-8 rounded-(--xl) flex flex-col justify-between group hover:bg-(--surface-container) transition-colors duration-300 min-h-45">
                    <div className="flex justify-between items-start">
                        <span
                            className="p-3 bg-(--surface-container-high) text-(--on-surface-variant) rounded-xl group-hover:bg-(--surface-container-highest) transition-colors">
                            <MdOutlineQuiz />
                        </span>
                        <span
                            className="text-xs font-black text-(--outline-variant) font-headline uppercase tracking-widest">Вопросы</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold font-headline text-(--on-surface)">20</div>
                        <div className="text-sm font-semibold text-(--on-surface-variant)">Всего элементов оценки</div>
                    </div>
                </div>
                <div className="bg-(--primary-container) p-8 rounded-(--xl) flex flex-col justify-between min-h-45">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-[#ffffff] text-(--primary) rounded-(--xl)">
                            <BsFillCheckCircleFill />
                        </span>
                        <span
                            className="text-xs font-black text-(--on-primary-container) font-headline uppercase tracking-widest">Успех</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold font-headline text-(--on-primary-container)">17</div>
                        <div className="text-sm font-semibold text-(--on-primary-container)/80">Правильные ответы</div>
                    </div>
                </div>
                <div
                    className="bg-(--surface-container-lowest) p-8 rounded-(--xl) flex flex-col justify-between group hover:bg-(--surface-container) transition-colors duration-300 min-h-45">
                    <div className="flex justify-between items-start">
                        <span className="p-3 bg-(--error-container)/10 text-(--error) rounded-xl">
                            <MdOutlineErrorOutline className='text(--error)' />
                        </span>
                        <span className="text-xs font-black text-(--outline-variant) font-headline uppercase tracking-widest">Области для роста</span>
                    </div>
                    <div>
                        <div className="text-4xl font-extrabold font-headline text-(--error)">3</div>
                        <div className="text-sm font-semibold text-(--on-surface-variant)">Возможности для обучения</div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ResultPage
