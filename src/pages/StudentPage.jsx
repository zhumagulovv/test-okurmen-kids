import { useState } from 'react'
import { IoMdSearch, IoMdTrendingUp } from 'react-icons/io'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import Dropdown from '../components/common/Dropdown'

const StudentPage = () => {
    const [group, setGroup] = useState('')
    const [status, setStatus] = useState('')
    return (
        <section className="bg-(--background) font-body text-(--on-surface) min-h-screen pb-32">
            <main className="max-w-7xl mx-auto px-6 py-8">
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h1 className="font-headline text-4xl font-extrabold text-(--on-surface) tracking-tight mb-2">Аналитика успеваемости</h1>
                            <p className="text-(--on-surface-variant) text-lg">Подробный анализ прогресса студентов и результатов экзаменов.</p>
                        </div>
                        <div
                            className="bg-(--surface-container-lowest) p-6 rounded-2xl shadow-[0_8px_24px_rgba(36,44,81,0.02)] border border-(--surface-container)">
                            <h3 className="text-(--on-surface-variant) font-bold text-sm uppercase mb-2">Лучшие ученики</h3>
                            <div className="text-3xl font-black text-(--on-surface)">42 <span
                                className="text-sm font-medium text-(--on-surface-variant)">Студенты</span></div>
                            <div className="mt-4 flex -space-x-3">
                                <img className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) object-cover"
                                    data-alt="young student face close up"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK7647qtdPVjMiFspbtY4WpgQoO8bKjDuOvECN9wyV2vZMTbK7is1OeEepS0a5KH_tfzmSL7_RfyvSZa3KZozMLqRYJ-a8X16FyJVJVO2RjRFHng11apIZQm0QQLBXi8GfgZwjD4F3Q_AD36rtQ5mQysAF17HhTxMwNcu1aU-4eKKmiv8xPCFX_YY-Lm2DfwigM5sQ2YJMeO23iOamtqVjEZHeXlPKQwusOevwwhOh3YbfBILpGL2OhWeYhrVUYCF_beVDWr77vzQ" />
                                <img className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) object-cover"
                                    data-alt="portrait of a young female student"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuANKMZGnFuc93pWgkQqxePEwxmOSOp609knnFastOE6kyVO748xXPdTEOa1kkQTi236Cw9GE1rEKBw6jlHfKlKYJ_HLxdemQtnI7Qnhf2cRXDb3WT5j4PKWq1uHZE2CPbzy9cjt2w9YO3RVzqVqvFOPZl6SlxZHN1YjhrfSiu4euWaEYTk0mulLuQozDYUIz12fAZFWxYBjPn_JTkolWjgqVH2fX5SEe9JQufvrJaWCAPtTFE-kp6gLLSh8KxuIPcNKjvkTcz4X8qQ" />
                                <img className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) object-cover"
                                    data-alt="portrait of a male student"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMlhOub3It_Mm01YS6KAS_KYW4cvZibA3a21-MtI2Edr5b56A9XaF-SwruzcIO9SOWnCDPbJChAlUDP4QSrwN1S3uzX2_v-YS5ghGsv6pEqN8OKRLfEvLnLSylRD2YNG6LxPZwH-5KKRl-YcOWZrNcqwC-4FsMM-yLJFxqAiA29G9JRDOYNN4-GvOMlCYkOLEUP5xZmwUvwGpPsQogfs96UnQx2e-HCclictZSy-vq-0i8huM2OQqg7JPsj0ekm2a496cMy06vMHs" />
                                <div
                                    className="w-10 h-10 rounded-full border-2 border-(--surface-container-lowest) bg-(--primary-container) text-(--on-primary-container) flex items-center justify-center text-xs font-bold">
                                    +39</div>
                            </div>
                        </div>
                        <div
                            className="bg-(--surface-container-lowest) p-6 rounded-2xl shadow-[0_8px_24px_rgba(36,44,81,0.02)] border border-(--surface-container)">
                            <h3 className="text-(--on-surface-variant) font-bold text-sm uppercase mb-2">Средний балл</h3>
                            <div className="text-3xl font-black text-(--on-surface)">88/100</div>
                            <div className="mt-2 text-(--tertiary-dim) flex items-center gap-1 font-bold">
                                <span className="material-symbols-outlined text-sm">
                                    <IoMdTrendingUp className='text-2xl' />
                                </span>
                                +5.2% за последний семестр
                            </div>
                        </div>
                    </div>
                </section>
                <section className="mb-8">
                    <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative w-full lg:flex-1">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-(--on-surface-variant)">
                                <IoMdSearch className='text-2xl' />
                            </span>
                            <input
                                className="w-full bg-(--surface-container-lowest) border-none focus:ring-2 focus:ring-(--primary)/40 rounded-xl py-3 pl-12 pr-4 text-(--on-surface) placeholder:text-(--on-surface-variant)/60"
                                placeholder="Поиск по имени студента, группе или ID..." type="text" />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Dropdown
                                options={['Все группы', 'Robotics 101', 'Python Masters', 'Logic Bloom B']}
                                value={group}
                                onChange={setGroup}
                                placeholder="Все группы"
                            />

                            <Dropdown
                                options={['Любой статус', 'Завершено', 'В процессе', 'Ожидание']}
                                value={status}
                                onChange={setStatus}
                                placeholder="Любой статус"
                            />
                        </div>
                    </div>
                </section>
                {/* Student Cards - Lists */}
                <div className="space-y-4">
                    <div
                        className="group bg-(--surface-container-lowest) hover:bg-white transition-all duration-300 rounded-2xl p-4 md:p-6 shadow-[0_4px_12px_rgba(36,44,81,0.02)] hover:shadow-[0_20px_40px_rgba(36,44,81,0.08)] flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-(--secondary-container) overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover" data-alt="portrait of a young smiling boy student"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD00OK3wBDUc71FxdJ8oet2AUc2joZlL5b1dj7BDy3bdtqaPL0BoY5Bl1H_XabiKw0GG7q1NITxkrBTW386Zxbr8R-Diwvrs-pO4gDYerui8hW5ewJvMtsEg0QHxLlL32f9o0bEZ409CvYSMV9CObL0NanyoI-D__Wq7olUsGrkbT0AEdE5oA6rpznc1lA_siosquB2SFIQMZ-1BQdF9T0QSmMSymyRNk4yDw8R2LbXx3SBr9AsNfAHIURs-rlvH4DcLEswAvrd4GQ" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-(--on-surface) group-hover:text-(--primary) transition-colors">Alex
                                Richardson</h4>
                            <p className="text-(--on-surface-variant) font-medium">Group: <span className="text-(--on-surface)">Robotics
                                101-B</span></p>
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-8 text-center md:text-left">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Date</p>
                                <p className="font-bold">Oct 12, 2023</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Score</p>
                                <p className="text-2xl font-black text-(--primary)">92<span
                                    className="text-sm font-bold text-(--on-surface-variant)">/100</span></p>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
                            <span
                                className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Completed</span>
                            <button className="text-(--primary) text-sm font-bold hover:underline">View Details</button>
                        </div>
                    </div>
                    <div
                        className="group bg-(--surface-container-lowest) hover:bg-white transition-all duration-300 rounded-2xl p-4 md:p-6 shadow-[0_4px_12px_rgba(36,44,81,0.02)] hover:shadow-[0_20px_40px_rgba(36,44,81,0.08)] flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-(--primary-container) overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover" data-alt="portrait of a teenage girl student with long hair"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDOPrngo84rPNACm57zzLiv9yQ8AkdQ8WeGjbZhNbPTduHMPdZy1MmefpyQe90Qa_08Gsbj3niLrhAJ_PXbuDChzkJ8lnSQEbtlyqhbXtTrXksNZx6C3hm7EIvQ9yluZmQYJXqtu6U-BzTjitWWcsBoC-0rHb1VkoPpeaH_iNjHlg3Ca_fWQoHzqSLYxtvQmZJ3zpzqQUeS8NLSNiDB1r15W4NT7Z1uPA47YynhDOk53Rm32PjAajtm5-LMbRrqAIcW2-UYO0zry4" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-(--on-surface) group-hover:text-(--primary) transition-colors">Sophia Chen
                            </h4>
                            <p className="text-(--on-surface-variant) font-medium">Group: <span className="text-(--on-surface)">Python
                                Masters</span></p>
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-8 text-center md:text-left">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Date</p>
                                <p className="font-bold">Oct 14, 2023</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Score</p>
                                <p className="text-2xl font-black text-(--on-surface-variant)">--<span
                                    className="text-sm font-bold">/100</span></p>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
                            <span
                                className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">In
                                Progress</span>
                            <button className="text-(--primary) text-sm font-bold hover:underline">Track Activity</button>
                        </div>
                    </div>
                    <div
                        className="group bg-(--surface-container-lowest) hover:bg-white transition-all duration-300 rounded-2xl p-4 md:p-6 shadow-[0_4px_12px_rgba(36,44,81,0.02)] hover:shadow-[0_20px_40px_rgba(36,44,81,0.08)] flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-(--tertiary-container) overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover" data-alt="close up headshot of a happy school boy"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvqqWe27oY3p88AeaS72QCcUrO_2FRcOHA50090IDPzoSdf3Iss36xftemN0hH3NVkyn-nzdP5PnpbPTwX9ceIwrw-UQlQIJmRZPSToEzGm0LIeLsCfuqtIH3n_foNgUILO_PHi_jEUZzPb_ImmoPkTI7Hc0lK2uVsTjm2ntyJTCVNgB707elfmg4ay5XHr8T7AHQv7_xD5IsPqpZUaSUSuCO_Roste-FLlGNX5fIJhbwpSDAh9YI1dZAO_4yYMbN7KVTlYfpdd7k" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-(--on-surface) group-hover:text-(--primary) transition-colors">Marcus
                                Weber</h4>
                            <p className="text-(--on-surface-variant) font-medium">Group: <span className="text-(--on-surface)">Robotics
                                101-B</span></p>
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-8 text-center md:text-left">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Date</p>
                                <p className="font-bold">Oct 11, 2023</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Score</p>
                                <p className="text-2xl font-black text-(--primary)">85<span
                                    className="text-sm font-bold text-(--on-surface-variant)">/100</span></p>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
                            <span
                                className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Completed</span>
                            <button className="text-(--primary) text-sm font-bold hover:underline">View Details</button>
                        </div>
                    </div>
                    <div
                        className="group bg-(--surface-container-lowest) hover:bg-white transition-all duration-300 rounded-2xl p-4 md:p-6 shadow-[0_4px_12px_rgba(36,44,81,0.02)] hover:shadow-[0_20px_40px_rgba(36,44,81,0.08)] flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-(--error-container)/20 overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover"
                                data-alt="portrait of a young female student with a studious look"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl9qZ8iUvdaAzuKr1I_K2QcpiIXmQMtnxfQUU_HxmlHvGLYrtRi87D37FcGO8JRgBZFKqrjsHb0x-ePO-G7KSzcibdyvNX0dg5SSt7w4KQYg7lqPiUuPTk6Bl9X6f3I38EC5yM9BlKNFutmI2iQ_CkqidaXdGdT0wxrR3OhGNeeBxBYD8JNy8F-xKCJA8bbhyVYwalHpMqlF5CMuiIf7mBlKVgLIPZ6G4MiIClqkAAauGHi5n98na9whZoipMnkDq9FkuXd09ioM4" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-(--on-surface) group-hover:text-(--primary) transition-colors">Elena
                                Petrova</h4>
                            <p className="text-(--on-surface-variant) font-medium">Group: <span className="text-(--on-surface)">Logic Bloom
                                A</span></p>
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-8 text-center md:text-left">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Date</p>
                                <p className="font-bold">Oct 09, 2026</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-(--on-surface-variant) font-bold mb-1">Балл</p>
                                <p className="text-2xl font-black text-(--error)">64<span
                                    className="text-sm font-bold text-(--on-surface-variant)">/100</span></p>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-center md:items-end gap-2">
                            <span
                                className="bg-(--tertiary-container)/20 text-(--on-tertiary-container) px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Требуется проверка</span>
                            <button className="text-(--primary) text-sm font-bold hover:underline">Посмотреть детали</button>
                        </div>
                    </div>
                </div>
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-(--surface-container) hover:bg-(--surface-container-high) transition-colors text-(--on-surface)">
                        <span className="material-symbols-outlined">
                            <LuChevronLeft />
                        </span>
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-(--xl) bg-(--primary) text-(--on-primary) font-bold">1</button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-(--xl) bg-(--surface-container-low) hover:bg-(--surface-container-high) transition-colors font-bold">2</button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-(--xl) bg-(--surface-container-low) hover:bg-(--surface-container-high) transition-colors font-bold">3</button>
                    <span className="px-2">...</span>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-(--xl) bg-(--surface-container-low) hover:bg-(--surface-container-high) transition-colors font-bold">12</button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-(--xl) bg-(--surface-container) hover:bg-(--surface-container-high) transition-colors text-(--on-surface)">
                        <span className="material-symbols-outlined">
                            <LuChevronRight />
                        </span>
                    </button>
                </div>
            </main>
        </section>
    )
}

export default StudentPage
