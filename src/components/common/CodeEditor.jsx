import { Editor } from '@monaco-editor/react'
import React from 'react'

const CodeEditor = ({ language, value, onChange }) => {
    return (
        <Editor
            language={language}
            value={value}
            onChange={onChange}
            theme="vs-dark"
        />
    )
}

export default CodeEditor
