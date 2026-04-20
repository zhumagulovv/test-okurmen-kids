import { IoIosCall } from 'react-icons/io'
import { MdVerifiedUser } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="w-full bg-surface-container-lowest border-t border-[#efefff] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <a href='/' className="text-xl font-extrabold text-on-surface font-headline">Okurmen Kids</a>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            Образовательная платформа для детей, чтобы освоить цифровые навыки и основы IT.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-on-surface">Навигация</h5>
                        <ul className="space-y-2 text-sm text-on-surface-variant">
                            <li><a className="transition-colors hover:text-(--primary)" href="/">Главная</a></li>
                            <li><a className="transition-colors hover:text-(--primary)" href="#">Как использовать</a></li>
                            <li><a className="transition-colors hover:text-(--primary)" href="#">Подготовка к экзамену</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="font-bold text-on-surface">Контакты</h5>
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <IoIosCall className='text-(--primary) text-2xl' />
                            <a className="transition-colors hover:text-(--primary)" href="tel:+996702247092">+996702 247 092</a>
                        </div>
                    </div>
                    <div className="flex items-end md:justify-end">
                        <div className="p-3 rounded-xl flex items-center gap-3 bg-(--primary)/5">
                            <MdVerifiedUser className='text-(--primary) text-2xl' />
                            <span className="text-xs font-bold text-(--primary) uppercase tracking-wider">Надёжное обучение</span>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-12 pt-8 border-t border-[#efefff] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant opacity-60">
                    <p>© 2026 Okurmen Kids. Все права защищены.</p>
                    <div className="flex gap-6">
                        <a className="hover:underline" href="#">Политика конфиденциальности</a>
                        <a className="hover:underline" href="#">Условия использования</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
