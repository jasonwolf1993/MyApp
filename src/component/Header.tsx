import React, { useEffect, useRef, useState } from "react"

export const Header = () => {
    const [b, setB] = useState(0)
    useEffect(() => {
        console.log(1111)
    }, [(window as any).aaa]);
    function hhh() {
        setB(b+1)
    }
    return (
        <header onClick={hhh} className="Head">
            不知道干啥的网站
        </header>
    )
}