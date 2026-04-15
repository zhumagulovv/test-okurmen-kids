import { Editor } from '@monaco-editor/react'
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

const CodeAnswer = () => {
    const [activeTab, setActiveTab] = useState('html');
    const [code, setCode] = useState({
        html: '<h1>Hello World</h1>',
        css: 'h1 { color: red; }',
        js: 'console.log("Hello World");',
        py: 'print("Hello World")',
    });
    const [srcDoc, setSrcDoc] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                  <head><style>${code.css}</style></head>
                  <body>${code.html}<script>${code.js}<\/script></body>
                </html>
            `);
        }, 300);
        return () => clearTimeout(timeout);
    }, [code.html, code.css, code.js]);

    const handleChange = (value) => {
        setCode((prev) => ({ ...prev, [activeTab]: value || '' }));
    };

    return (
        <section className="text-(--on-surface) font-body min-h-150 flex flex-col" >
            <main className="grow flex flex-col md:flex-row overflow-hidden max-w-400 mx-auto w-full p-4 md:p-6 gap-6">
                <section
                    className="grow flex flex-col bg-(--surface-container-lowest) rounded-3xl overflow-hidden code-shadow border border-(--outline-variant)/10">
                    <div className="flex items-center bg-(--surface-container-low) px-4 pt-4 gap-1">
                        {TABS.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`px-5 py-2.5 rounded-t-xl text-sm flex items-center gap-2 transition-colors
                                    ${activeTab === id
                                        ? 'bg-(--surface-container-lowest) text-(--primary) font-bold border-x border-t border-(--outline-variant)/10'
                                        : 'hover:bg-(--surface-container-high) text-(--on-surface-variant) font-medium'
                                    }`}
                            >
                                <Icon className="text-2xl" />
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="grow flex font-mono text-[14px] bg-(--surface-container-lowest) relative">
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
    )
}

export default CodeAnswer
