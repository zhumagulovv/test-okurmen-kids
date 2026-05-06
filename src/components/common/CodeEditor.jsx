// src/components/common/CodeEditor.jsx
import { Editor } from '@monaco-editor/react'
import { useEffect, useState } from 'react'

const LANG_COLORS = {
    python: '#3572A5',
    javascript: '#F7DF1E',
    html: '#E34C26',
    css: '#563d7c',
}

const CodeEditor = ({ language, value, onChange }) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    if (isMobile) {
        return (
            <div className="relative w-full h-full flex flex-col min-h-75">
                {/* язык-бейдж */}
                <div
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase"
                    style={{ background: '#1e1e1e', color: LANG_COLORS[language] ?? '#ccc' }}
                >
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: LANG_COLORS[language] ?? '#ccc' }}
                    />
                    {language}
                </div>
                <textarea
                    value={value ?? ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    spellCheck={false}
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="off"
                    className="flex-1 w-full resize-none p-4 font-mono text-sm leading-relaxed outline-none"
                    style={{
                        background: '#1e1e1e',
                        color: '#d4d4d4',
                        caretColor: '#fff',
                        minHeight: '300px',
                        tabSize: 4,
                    }}
                    onKeyDown={(e) => {
                        // Tab → 4 пробела вместо перехода фокуса
                        if (e.key === 'Tab') {
                            e.preventDefault()
                            const { selectionStart, selectionEnd } = e.target
                            const newVal =
                                value.substring(0, selectionStart) +
                                '    ' +
                                value.substring(selectionEnd)
                            onChange?.(newVal)
                            // восстановить курсор после React re-render
                            requestAnimationFrame(() => {
                                e.target.selectionStart = e.target.selectionEnd = selectionStart + 4
                            })
                        }
                    }}
                />
            </div>
        )
    }

    return (
        <Editor
            height="100%"
            language={language}
            value={value}
            onChange={onChange}
            theme="vs-dark"
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
            }}
        />
    )
}

export default CodeEditor