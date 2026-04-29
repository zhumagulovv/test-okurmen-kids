import { useNavigate } from 'react-router-dom'

import { FaUserShield } from 'react-icons/fa'
import { IoRocketSharp } from 'react-icons/io5'
import { MdVerified } from 'react-icons/md'
import { TbSchool } from 'react-icons/tb'

import { HERO_INFO } from '../../constants/constants'
import Button from '../../shared/ui/Button'

const Hero = ({ scroollRef }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        scroollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <section className="grow flex items-center justify-center relative mesh-gradient overflow-hidden">
            <div className="absolute inset-0 geometric-dots opacity-50 pointer-events-none"></div>
            <div className="absolute top-1/4 -right-24 w-96 h-96 background-color rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 py-16 relative z-10">

                <div className="lg:col-span-7 space-y-10 text-left">
                    <div className="space-y-6">
                        <div
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white shadow-sm border-(--secondary)/10 text-(--secondary) font-bold text-xs tracking-wider font-label uppercase rounded-full">
                            <MdVerified className="text-xl" />
                            Официальная сертификация
                        </div>
                        <div className="space-y-4">
                            <h2
                                className="text-6xl md:text-7xl font-extrabold font-headline leading-[1.1] text-(--on-surface) tracking-tight">
                                IT Академия: <br />
                                <span
                                    className="bg-linear-to-r via-(--secondary) to-(--primary) bg-size-[200%_auto] animate-gradient text-transparent bg-clip-text text-color text-balance">Экзаменационный центр</span>
                            </h2>
                            <p className="text-xl text-(--on-surface-variant) max-w-xl leading-relaxed font-medium text-wrap">
                                Добро пожаловать в профессиональный портал оценки. Введите ваш уникальный код сессии ниже, чтобы пройти аутентификацию и начать путь к цифровой сертификации.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {
                            HERO_INFO.map((i) => {
                                const IconInfo = i.icon
                                return (
                                    <div
                                        key={i.id}
                                        className="flex items-center gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/60 min-w-45">
                                        <div className="w-12 h-12 flex items-center justify-center bg-(--primary)/5 rounded-(--xl)">
                                            <IconInfo className='text-2xl text-(--primary)' />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-(--on-surface) leading-none">{i.title}</h4>
                                            <p className="text-xs text-(--on-surface-variant) mt-1">{i.desc}</p>
                                        </div>
                                    </div>
                                )
                            }
                            )
                        }
                    </div>
                </div>
                <div className="lg:col-span-5">
                    <div
                        className="glass-panel p-10 rounded-4xl shadow-[0_32px_64px_-16px_rgba(0,87,189,0.15)] space-y-8 relative overflow-hidden">
                        <div className="absolute -top-5 right-0 p-6 opacity-10 pointer-events-none">
                            <FaUserShield className='text-6xl' />
                        </div>
                        <div className="flex flex-col gap-4 relative z-10">
                            <Button
                                onClick={() => navigate("/entry-page")}
                                size="lg"
                                icon={<IoRocketSharp />}
                            >
                                Начать итоговый экзамен
                            </Button>
                            <Button
                                onClick={handleClick}
                                variant="secondary"
                                icon={<TbSchool className="text-2xl" />}
                                iconPosition="left"
                            >
                                GO! в режим практики
                            </Button>
                        </div>
                        <div className="bg-surface-container-low/50 p-4 rounded-xl border border-primary/5">
                            <p className="text-center text-xs text-on-surface-variant leading-relaxed">
                                Нужна помощь? <a href='tel:+996702247092' className="text-(--primary) font-bold">руководитель тренеров</a> для кода идентификации класса, чтобы начать.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero