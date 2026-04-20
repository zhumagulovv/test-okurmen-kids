import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { FaArrowRight } from 'react-icons/fa'
import { MdClose, MdHelpOutline, MdOutlineVerifiedUser } from 'react-icons/md'

import { validateSession } from '../features/auth/sessionSlice'

import logoImage from '../assets/logo.png'

const EntryPage = () => {
    const [code, setCode] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { loading, error } = useSelector((state) => state.session)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!code.trim()) {
            throw new Error('Пожалуйста, введите ключ сессии')
        }

        localStorage.setItem('sessionKey', code)

        const res = await dispatch(validateSession(code))

        if (res.meta.requestStatus === 'fulfilled') {
            navigate('/name-page')
        } else {
            localStorage.removeItem('sessionKey')
        }
    }

    return (
        <section className='bg-(--background) font-body text-(--on-surface) min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden'>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] sixth-background">
            </div>
            <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] rounded-full blur-[100px] bg-(--secondary-container)/30">
            </div>
            <div className="w-full max-w-lg z-10 relative">
                <MdClose onClick={() => navigate("/")} className='text-3xl absolute top-2 right-2 cursor-pointer' />
                <div
                    className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_8px_24px_rgba(36,44,81,0.06)] flex flex-col items-center text-center">
                    <div className="mb-8 w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center">
                        <img alt="Platform Logo" className="w-24 h-24 object-contain" src={logoImage} />
                    </div>
                    <h1 className="font-headline font-bold text-3xl md:text-4xl text-(--on-surface) mb-4 tracking-tight">Введите ключ сессии</h1>
                    <p className="text-(--on-surface-variant) text-lg leading-relaxed mb-10 max-w-sm">
                        Пожалуйста, введите ключ, предоставленный вашим преподавателем, чтобы открыть экзамен.
                    </p>
                    <div className="w-full space-y-6">
                        <div className="group relative">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full bg-(--surface-container-highest) text-center text-l font-headline font-bold tracking-[0.25em] py-6 px-4 rounded-xl border-none focus:ring-4 focus:ring-(--primary)/20 transition-all placeholder:text-(--outline-variant) text-(--on-surface)" placeholder="XXXX-XXXX" type="text" />
                            {
                                error && <p className="text-red-500 text-sm mt-2">{error}</p>
                            }
                            <div
                                className="absolute inset-0 rounded-xl pointer-events-none border-2 border-(--primary)/0 group-focus-within:(--primary)transition-all">
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-linear-to-r from-(--primary) to-(--primary-container) font-headline font-bold py-5 rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-base text-(--on-primary) sm:text-xs md:text-sm lg:text-base">
                            {loading ? 'Проверка...' : 'Продолжить'}
                            <FaArrowRight />
                        </button>
                    </div>
                    <div className="mt-10 pt-8 border-t-4 border-(--surface-container) w-full flex flex-col items-center gap-4">
                        <div className="flex items-start gap-2 text-(--on-surface-variant)/70 text-sm">
                            <MdOutlineVerifiedUser className='text-lg' />
                            <span>Безопасная экзаменационная сессия • Итоговая оценка Logic Bloom</span>
                        </div>
                        <button className="text-(--primary) font-bold text-sm hover:underline flex items-center gap-1">
                            <MdHelpOutline className='text-xl' />
                            Испытываете трудности с вашим ключом?
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EntryPage
