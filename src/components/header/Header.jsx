import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../shared/ui/Button';

let MENU_HEADER = [
    { id: 1, label: 'Главная', path: '/' },
    { id: 2, label: 'Таблица лидеров', path: '/leaderboard' },
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        navigate("/entry-page");
        setOpen(!open);
    }

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
                        {
                            MENU_HEADER.map((item) => (
                                <li key={item.id} className="hover:text-[#0057bd] transition-colors">
                                    <Link to={item.path}>{item.label}</Link>
                                </li>
                            ))
                        }
                    </ul>

                    <div className="flex items-center gap-4">
                        <a href="tel:+996702247092" className="text-[#242c51]">
                            +996 702 247 092
                        </a>

                        <Button
                            onClick={() => navigate("/entry-page")}
                            size="sm"
                            fullWidth={false}
                        >
                            Пройти тест
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-4 bg-[#f7f5ff] border-t border-black/5">
                    <ul className="flex flex-col gap-3">
                        {
                            MENU_HEADER.map((item) => (
                                <li key={item.id} className="hover:text-[#0057bd] transition-colors">
                                    <Link to={item.path} onClick={() => setOpen(false)}>{item.label}</Link>
                                </li>
                            ))
                        }
                    </ul>

                    <div className="flex flex-col gap-3">
                        <a href="tel:+996702247092" className="text-[#242c51]">
                            +996 702 247 092
                        </a>

                        <Button
                            onClick={toggleMenu}
                            size="sm"
                            fullWidth={false}
                        >
                            Пройти тест
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;