import { Editor } from '@monaco-editor/react'

const CodeEditor = ({ language, value, onChange }) => {
    return (
        <Editor
            height="100"
            language={language}
            value={value}
            onChange={onChange}
            theme="vs-dark"
        />
    )
}

export default CodeEditor
