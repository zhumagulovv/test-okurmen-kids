import { HiMiniCodeBracketSquare } from 'react-icons/hi2'
import { MdOutlineSecurity } from 'react-icons/md'
import { SiVisualparadigm } from 'react-icons/si'

import examPng from "../../assets/exam.png"

const ExamComponent = () => {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 mb-24 mt-12">
            <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-(--primary)/5 overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="w-full md:w-1/2">
                        <div className="relative group">
                            <div
                                className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000">
                            </div>
                            <img alt="Coding environment"
                                className="relative rounded-2xl shadow-xl w-full object-cover aspect-video"
                                src={examPng} loading='lazy' />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-8">
                        <div>
                            <h3 className="text-4xl font-bold font-headline text-(--on-surface) tracking-tight">Что входит в экзамен?
                            </h3>
                            <div className="h-1.5 w-20 bg-(--primary)/20  rounded-full mt-4"></div>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div
                                    className="mt-1 w-8 h-8 bg-(--primary)/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <SiVisualparadigm className='text-(--primary)' />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-(--on-surface)">Визуальные логические вентили</h5>
                                    <p className="text-sm text-(--on-surface-variant)">Решайте архитектурные задачи-головоломки, используя логические элементы AND/OR.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div
                                    className="mt-1 w-8 h-8 bg-(--secondary)/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <HiMiniCodeBracketSquare className='text-xl text-secondary' />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-(--on-surface)">Анализ Python-скрипта</h5>
                                    <p className="text-sm text-(--on-surface-variant)">Определяйте ошибки и предсказывайте вывод в простых, понятных для начинающих фрагментах кода.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div
                                    className="mt-1 w-8 h-8 bg-(--tertiary-container)/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <MdOutlineSecurity className='text-third' />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-(--on-surface)">Основы облачной безопасности</h5>
                                    <p className="text-sm text-(--on-surface-variant)">Изучите, как защищать цифровые идентичности в симулированной облачной среде.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ExamComponent
