
import React from 'react'

export default function MAItemCanvas({ text, pos }) {
    return (
        <div
            className="MAItemCanvas"
            style={{
                left: pos.x,
                top: pos.y,
            }}
        >
            {text}
        </div>
    )
}