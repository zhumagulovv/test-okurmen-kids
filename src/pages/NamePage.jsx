import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { BsPersonFill } from 'react-icons/bs'
import { IoRocketSharp } from 'react-icons/io5'
import { MdHelpOutline, MdOutlineCategory, MdOutlinePolyline, MdOutlineSettingsEthernet } from 'react-icons/md'
import { startAttempt } from '../features/attempt/attemptSlice'
import { clearSession } from '../features/auth/sessionSlice'

import namePageImage from "../assets/namePage.png"

const NamePage = () => {
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: session, loading: sessionLoading } = useSelector((state) => state.session)
    const { loading: attemptLoading } = useSelector((state) => state.attempt)

    useEffect(() => {
        if (!session) {
            navigate('/entry-page')
        }
    }, [dispatch, navigate, session])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return
        if (name.length < 3) return

        try {
            await dispatch(startAttempt({ key: session.key, student_name: name })).unwrap()
            navigate('/test-page')
        }
        catch (error) {
            throw new Error('Error creating attempt:', error)
        }
    }

    if (!session) return null

    return (
        <section className="bg-(--surface) text-(--on-surface) min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-(--primary-container)/20 blur-[120px]">
                </div>
                <div
                    className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-(--secondary-container)/20 blur-[120px]">
                </div>
            </div>
            <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative">
                <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
                        <div
                            className="absolute inset-0 bg-linear-to-tr from-(--primary) to-(--primary-container) rounded-full opacity-10 animate-pulse">
                        </div>
                        <img alt="Friendly robot mascot" className="w-full h-full object-contain relative z-10"
                            data-alt="A friendly, cute 3D robot character with a large screen face showing a smiling emoji, vibrant blue and purple accents"
                            src={namePageImage} loading='lazy' />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-(--on-surface) tracking-tight leading-tight">
                            Готовы к <span className="text-(--primary)">Создать?</span>
                        </h1>
                        <p className="text-(--on-surface-variant) text-lg font-medium max-w-sm">
                            Введите данные вашей сессии ниже, чтобы присоединиться к рабочему пространству Digital Atelier.
                        </p>
                    </div>
                </div>
                <div className="md:col-span-7">
                    <div
                        className="bg-(--surface-container-lowest) p-8 md:p-12 rounded-xl shadow-[0_8px_24px_rgba(36,44,81,0.06)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8"></div>
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-bold uppercase tracking-wider text-(--on-surface-variant) ml-1"
                                    htmlFor="full-name">
                                    Имя студента
                                </label>
                                <div className="relative group">
                                    <div
                                        className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                                        <BsPersonFill className='text-2xl' />
                                    </div>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-14 pr-5 py-5 bg-(--surface-container-highest) border-none rounded-xl text-lg font-semibold text-(--on-surface) focus:ring-4 focus:ring-(--primary)/10 transition-all placeholder:text-(--outline-variant/50)"
                                        id="full-name" placeholder="Ваше полное имя" required="" type="text" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    disabled={attemptLoading || sessionLoading}
                                    className="w-full bg-linear-to-r from-(--primary) to-(--primary-dim) text-white py-6 rounded-xl text-xl font-bold flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(0,87,189,0.2)] hover:shadow-[0_16px_32px_rgba(0,87,189,0.3)] transform hover:-translate-y-1 transition-all active:scale-95 duration-150"
                                    type="submit">
                                    {attemptLoading ? "Загрузка..." : "Начать"}
                                    <IoRocketSharp className='text-2xl' />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-8 flex justify-center md:justify-end gap-6">
                        <button
                            className="text-(--on-surface-variant) hover:text-(--primary) text-sm font-bold transition-colors flex items-center gap-2">
                            <MdHelpOutline className='text-xl' />
                            Нужна помощь?
                        </button>
                        <button
                            className="text-(--on-surface-variant) hover:text-(--primary) text-sm font-bold transition-colors flex items-center gap-2">
                            <MdOutlineSettingsEthernet className='text-xl' />
                            Тест сети
                        </button>
                    </div>
                </div>
            </main>
            <div className="fixed bottom-12 left-12 hidden lg:block opacity-20">
                <MdOutlineCategory className='text-[200px] text-(--primary)' />
            </div>
            <div className="fixed top-12 right-12 hidden lg:block opacity-20">
                <MdOutlinePolyline className='text-[200px] text-(--primary)' />
            </div>
        </section>
    )
}

export default NamePage
