import { useEffect, useState } from 'react'
import { BsCss } from 'react-icons/bs';
import { IoLogoJavascript } from 'react-icons/io';
import { MdTerminal } from 'react-icons/md';
import { TiHtml5 } from 'react-icons/ti';
import CodeEditor from './CodeEditor';

const TABS = [
    { id: 'html', label: 'index.html', Icon: TiHtml5 },
    { id: 'css', label: 'styles.css', Icon: BsCss },
    { id: 'js', label: 'script.js', Icon: IoLogoJavascript },
    { id: 'py', label: 'verify.py', Icon: MdTerminal },
];

const LANG_MAP = {
    html: 'html',
    css: 'css',
    js: 'javascript',
    py: 'python',
};

const ENABLED_TABS = {
    python: ['py'],
    js: ['js'],
    layout: ['html', 'css'],
    fullstack: ['html', 'css', 'js'],
};

const DEFAULT_CODE = {
    html: '<h1>Hello World</h1>',
    css: 'h1 { color: red; }',
    js: 'console.log("Hello World");',
    py: 'print("Hello World")',
};

const CodeAnswer = ({ language, value, onChange }) => {
    const questionType = language || 'fullstack';
    const allowedTabs = ENABLED_TABS[questionType];

    const [activeTab, setActiveTab] = useState(allowedTabs[0]);
    
    const [code, setCode] = useState(
        typeof value === 'object' && value !== null ? value : DEFAULT_CODE
    );
    const [srcDoc, setSrcDoc] = useState('');

    useEffect(() => {
        if (!allowedTabs.includes(activeTab)) {
            setActiveTab(allowedTabs[0]);
        }
    }, [questionType]);

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

        // ✅ For python/js send just the code string
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

                {/* Preview for non-python */}
                {/* {questionType !== 'python' && (
                    <section className="grow flex flex-col bg-(--surface-container-lowest) rounded-3xl overflow-hidden border border-(--outline-variant)/10">
                        <div className="bg-(--surface-container-low) px-4 py-3 text-xs text-(--on-surface-variant) font-medium">
                            Предпросмотр
                        </div>
                        <iframe
                            srcDoc={srcDoc}
                            title="preview"
                            sandbox="allow-scripts"
                            className="flex-1 w-full bg-white"
                        />
                    </section>
                )} */}
            </main>
        </section>
    );
};

export default CodeAnswer;