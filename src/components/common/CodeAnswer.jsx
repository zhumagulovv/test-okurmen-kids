import { useEffect, useState } from 'react'

import CodeEditor from './CodeEditor';

import { TABS, LANG_MAP, ENABLED_TABS, DEFAULT_CODE } from '../../constants/constants';

const CodeAnswer = ({ language, value, onChange }) => {
    const questionType = language || 'fullstack';
    const allowedTabs = ENABLED_TABS[questionType];

    const [activeTab, setActiveTab] = useState(allowedTabs[0]);

    const [code, setCode] = useState(() => {
        if (typeof value === 'object' && value !== null) return value;
        if (typeof value === 'string' && value !== '') {
            const key = questionType === 'python' ? 'py' : 'js';
            return { ...DEFAULT_CODE, [key]: value };
        }
        return DEFAULT_CODE;
    });

    const [srcDoc, setSrcDoc] = useState('');

    // ✅ FIX 1: Sync internal code state when `value` prop changes (e.g. question navigation)
    useEffect(() => {
        if (typeof value === 'object' && value !== null) {
            setCode(value);
        } else if (typeof value === 'string') {
            const key = questionType === 'python' ? 'py' : 'js';
            setCode(prev => ({ ...DEFAULT_CODE, ...prev, [key]: value }));
        } else {
            // value is undefined/null/empty — reset to defaults
            setCode(DEFAULT_CODE);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!allowedTabs.includes(activeTab)) {
            setActiveTab(allowedTabs[0]);
        }
    }, [questionType]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (questionType !== 'python') {
            const timeout = setTimeout(() => {
                setSrcDoc(`
                    <html>
                        <head><style>${code.css}</style></head>
                        <body>
                            ${code.html}
                            <script>${code.js}<\/script>
                        </body>
                    </html>
                `);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [code.html, code.css, code.js, questionType]);

    const handleChange = (newValue) => {
        const updated = { ...code, [activeTab]: newValue || '' };
        setCode(updated);

        // For python/js send just the code string
        // For layout/fullstack send the whole object
        if (questionType === 'python') {
            onChange?.(updated.py);
        } else if (questionType === 'js') {
            onChange?.(updated.js);
        } else {
            onChange?.(updated);
        }
    };

    return (
        <section className="text-(--on-surface) font-body min-h-150 flex flex-col">
            <main className="grow flex flex-col md:flex-row overflow-hidden max-w-400 mx-auto w-full p-4 md:p-6 gap-6">
                <section className="grow flex flex-col bg-(--surface-container-lowest) rounded-3xl overflow-hidden code-shadow border border-(--outline-variant)/10">
                    <div className="flex items-center bg-(--surface-container-low) px-4 pt-4 gap-1">
                        {TABS.map(({ id, label, Icon }) => {
                            const isDisabled = !allowedTabs.includes(id);
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    disabled={isDisabled}
                                    className={`px-5 py-2.5 rounded-t-xl text-sm flex items-center gap-2 transition-colors
                                        ${activeTab === id
                                            ? 'bg-(--surface-container-lowest) text-(--primary) font-bold border-x border-t border-(--outline-variant)/10'
                                            : 'hover:bg-(--surface-container-high) text-(--on-surface-variant) font-medium'
                                        } disabled:hidden disabled:cursor-not-allowed`}
                                >
                                    <Icon className="text-2xl" />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="grow flex h-full font-mono text-[14px] bg-(--surface-container-lowest) relative">
                        <CodeEditor
                            key={activeTab}
                            language={LANG_MAP[activeTab]}
                            value={code[activeTab]}
                            onChange={handleChange}
                        />
                    </div>
                </section>
            </main>
        </section>
    );
};

export default CodeAnswer;