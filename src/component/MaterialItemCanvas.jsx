
import React from 'react'
import { useDispatch } from 'react-redux'

export default function MAItemCanvas({ text, pos }) {
    const dispatch = useDispatch()
    dispatch((dispatch, getState) => {
        // 异步操作.then(() => {dispatch()})
    })
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