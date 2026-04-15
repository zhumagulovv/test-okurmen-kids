import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="w-full sticky top-0 z-50 bg-[#f7f5ff]/80 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">

                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight text-[#242c51]">
                    Okurmen Kids
                </Link>

                {/* Burger */}
                <button
                    className="md:hidden text-[#242c51] text-3xl"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-10">
                    <ul className="flex items-center gap-6">
                        <li className="hover:text-[#0057bd] transition-colors">
                            <Link to="/">Главная</Link>
                        </li>
                        <li className="hover:text-[#0057bd] transition-colors">
                            <Link to="/table">Таблица РЗ</Link>
                        </li>
                        <li className="hover:text-[#0057bd] transition-colors">
                            <Link to="/leaderboard">Лидер борт</Link>
                        </li>
                    </ul>

                    <div className="flex items-center gap-4">
                        <a href="tel:+996702247092" className="text-[#242c51]">
                            +996 702 247 092
                        </a>

                        <button onClick={() => navigate("/entry-page")} className="py-2 px-6 rounded-2xl font-bold shadow-[0_12px_24px_-8px_rgba(0,87,189,0.5)] hover:-translate-y-0.5 transition-all bg-(--primary) text-(--on-primary) cursor-pointer">
                            Пройти тест
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-4 bg-[#f7f5ff] border-t border-black/5">
                    <ul className="flex flex-col gap-3">
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/table">Таблица РЗ</Link></li>
                        <li><Link to="/leaderboard">Лидер борт</Link></li>
                    </ul>

                    <div className="flex flex-col gap-3">
                        <a href="tel:+996702247092" className="text-[#242c51]">
                            +996 702 247 092
                        </a>

                        <button onClick={() => navigate("/entry-page")} className="w-full text-white py-3 rounded-2xl font-bold button-primary">
                            Пройти тест
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;