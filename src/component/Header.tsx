import React, { useEffect, DependencyList, useRef, useState, useMemo, useCallback } from "react"

export const Header = () => {
    const [state, setState] = useState({a:1})
    const ref1 = useRef(0)
    console.log('refresh, cur state:', state, ref1.current)

    function clickHeader() {
        ref1.current = ref1.current + 1
        state.a = 2
        setState((state) => {
            state.a = 2
            return state
        })
        // setState((old) => {return old+1})
        // setState((s) => {return s+1})
    }
    // const [data, setData] = useState(null)
    // useMemo(() => {
    //     const data = fetch(param)
    //     setData(data)
    // }, [param])

    // useEffect(() => {
    //     const data = fetch(param)
    //     setData(data)
    // }, [param])
    
    return (
        <header onClick={clickHeader} className="Head">
            我的网站
        </header>
    )
}