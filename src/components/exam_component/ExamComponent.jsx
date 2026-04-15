import React from 'react'
import { HiMiniCodeBracketSquare } from 'react-icons/hi2'
import { MdOutlineSecurity } from 'react-icons/md'
import { SiVisualparadigm } from 'react-icons/si'

const ExamComponent = () => {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 mb-24 mt-12">
            <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border primary-border overflow-hidden relative">
                <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="w-full md:w-1/2">
                        <div className="relative group">
                            <div
                                className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000">
                            </div>
                            <img alt="Coding environment"
                                className="relative rounded-2xl shadow-xl w-full object-cover aspect-video"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZdjgjFnZ75laWeVHO2JbCoCywN5VdqaocZ_5OUDCJbNrYtKZJynwPcINQskWLAyT6iwc3YMYco7FkLRNZ-1Nn2-oFuYXmD-IjYa7A7Qjcd07YS26gxX56t23S3pgLfoaNS53L93tla1A18qJAHYCmvoJ_1fet_HiJYbxJAJ1RQvG9ny9FU_AB83t-jE8R58pp62bb_6PkjxFTiWPVjvh2iIGBZN2HCHB4SmVsmGiP3yxbN_RWU9rklA_a0Hb-Vv_T7zEYc08nt4I" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-8">
                        <div>
                            <h3 className="text-4xl font-bold font-headline text-color-two tracking-tight">Что входит в экзамен?
                            </h3>
                            <div className="h-1.5 w-20 bacground-color-second  rounded-full mt-4"></div>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div
                                    className="mt-1 w-8 h-8 fifth-background rounded-2xl flex items-center justify-center shrink-0">
                                    <SiVisualparadigm className='text-color' />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-color-two">Визуальные логические вентили</h5>
                                    <p className="text-sm text-color-three">Решайте архитектурные задачи-головоломки, используя логические элементы AND/OR.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div
                                    className="mt-1 w-8 h-8 secondary-background rounded-2xl flex items-center justify-center shrink-0">
                                    <HiMiniCodeBracketSquare className='text-xl text-secondary' />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-color-two">Анализ Python-скрипта</h5>
                                    <p className="text-sm text-color-three">Определяйте ошибки и предсказывайте вывод в простых, понятных для начинающих фрагментах кода.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div
                                    className="mt-1 w-8 h-8 third-background rounded-2xl flex items-center justify-center shrink-0">
                                    <MdOutlineSecurity className='text-third' />
                                </div>
                                <div>
                                    <h5 className="font-bold text-lg text-color-two">Основы облачной безопасности</h5>
                                    <p className="text-sm text-color-three">Изучите, как защищать цифровые идентичности в симулированной облачной среде.</p>
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
