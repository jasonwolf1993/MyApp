import {javascript} from "@codemirror/lang-javascript"
import {EditorView, basicSetup} from "codemirror"
import React, { useRef, useEffect } from 'react'


export default function CM() {
    const cm = useRef(null)
    useEffect(() => {
        // if (!cmView) {
            new EditorView({
                doc: "Start document",
                parent: cm.current as any,
                extensions: [
                    basicSetup,
                    javascript({typescript: true})
                ]
            })
        // }
    })
    return <div className="Preview" ref={cm}></div>
}