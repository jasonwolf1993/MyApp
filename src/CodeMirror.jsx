import {javascript} from "@codemirror/lang-javascript"
import {EditorView, basicSetup} from "codemirror"
import React, { useRef, useEffect } from 'react'


let cmView = null

export default function CM() {
    const cm = useRef(null)
    useEffect(() => {
        if (!cmView) {
            cmView = new EditorView({
                doc: "Start document",
                parent: cm.current,
                extensions: [
                    basicSetup,
                    javascript({typescript: true})
                ]
            })
        }
    })
    return <div className="Preview" ref={cm}></div>
}