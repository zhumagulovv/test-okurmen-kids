import { FiUsers, FiZap } from 'react-icons/fi'
import { LuMedal } from 'react-icons/lu'
import { RiTimerLine, RiVipCrownLine } from 'react-icons/ri'
import { BsCss } from 'react-icons/bs';
import { IoLogoJavascript } from 'react-icons/io';
import { MdTerminal } from 'react-icons/md';
import { TiHtml5 } from 'react-icons/ti';
import { FaPython } from 'react-icons/fa'
import { BiTerminal } from 'react-icons/bi';

import HTMLCSS from "../assets/html.png"
import JS from "../assets/js.png"
import PY from "../assets/py.png"

export const BLOCKED_COMBINATIONS = [
    { key: 'F5' },
    { key: 'r', ctrl: true },
    { key: 'c', ctrl: true },
    { key: 'v', ctrl: true },
    { key: 'u', ctrl: true },
    { key: 'F12' },
    { key: 'PrintScreen' },
    { key: 'i', ctrl: true, shift: true },
];

export const SLIDES = [
    {
        tag: "Программирование (направление)",
        title: "Освойте искусство Python",
        description: "Начните свой путь в backend-разработке.",
        image: PY,
    },
    {
        tag: "Фронтенд (направление)",
        title: "Мастерство JavaScript",
        description: "Создавайте динамические интерфейсы и веб-приложения.",
        image: JS
    },
    {
        tag: "Основы веб-разработки",
        title: "HTML & CSS",
        description: "Создавайте адаптивные макеты.",
        image: HTMLCSS
    }
]

export const CATEGORIES = [
    { id: 'all', label: 'Все', icon: FiUsers },
    { id: 'top10', label: 'Топ 10', icon: RiVipCrownLine },
    { id: 'passed', label: '≥ 75%', icon: FiZap },
    { id: 'failed', label: '< 75%', icon: LuMedal },
]

export const SORT_OPTIONS = [
    { value: 'rank', label: 'По рейтингу' },
    { value: 'score', label: 'По баллу' },
    { value: 'duration', label: 'По времени' },
    { value: 'name', label: 'По имени' },
]

export const STATUS_STYLES = {
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Review: 'bg-orange-100 text-orange-700',
}

export const STATUS_LABELS = {
    Completed: 'Completed',
    'In Progress': 'In Progress',
    Pending: 'Pending',
    Review: 'Требуется проверка',
}

export const TABS = [
    { id: 'html', label: 'index.html', Icon: TiHtml5 },
    { id: 'css', label: 'styles.css', Icon: BsCss },
    { id: 'js', label: 'script.js', Icon: IoLogoJavascript },
    { id: 'py', label: 'verify.py', Icon: MdTerminal },
];

export const LANG_MAP = {
    html: 'html',
    css: 'css',
    js: 'javascript',
    py: 'python',
};

export const ENABLED_TABS = {
    python: ['py'],
    js: ['js'],
    layout: ['html', 'css'],
    fullstack: ['html', 'css', 'js'],
};

export const DEFAULT_CODE = {
    html: '<h1>Hello World</h1>',
    css: 'h1 { color: red; }',
    js: 'console.log("Hello World");',
    py: 'print("Hello World")',
};

export const SKILL_CATEGORIES = [
    {
        icon: TiHtml5,
        title: "HTML & CSS",
        description: "12 модулей"
    },
    {
        icon: IoLogoJavascript,
        title: "JavaScript",
        description: "8 модулей"
    },
    {
        icon: FaPython,
        title: "Python",
        description: "15 модулей"
    }
]

export const HERO_INFO = [
    {
        id: 1,
        icon: RiTimerLine,
        title: "30 минут",
        desc: "Сеанс с ограничением по времени"
    },
    {
        id: 2,
        icon: BiTerminal,
        title: "Живое кодирование",
        desc: "IDE в реальном времени"
    }
]