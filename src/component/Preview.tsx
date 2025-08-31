import { useDrop } from 'react-dnd'
import React, { useEffect, useRef, useState, EffectCallback } from 'react';
import MAItemCanvas from './MaterialItemCanvas';

export default function Preview() {
    const dropRef = useRef(null)
    const canvasRef = useRef(null)
    const [MAItems, setMAItems] = useState([])
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'MaterialItem',
        drop: (item: any, monitor) => {
            // 获取鼠标的视口坐标
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset || !dropRef.current) return;
      
            // 获取放置区域的视口位置信息
            const rect = (dropRef.current as any).getBoundingClientRect();
            // 计算相对坐标
            const relativeX = clientOffset.x - rect.left;
            const relativeY = clientOffset.y - rect.top;
      
            console.log('相对位置:', { x: relativeX, y: relativeY });
            // 执行其他操作，如更新状态等
            setMAItems(prev => [...prev, {text: item.text, pos: { x: relativeX, y: relativeY }}] as any)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const SetDrop = (dom: any) => {
        drop(dom)
        dropRef.current = dom
    }
    useEffect(() => {
        const c = canvasRef.current
        const ctx=c.getContext('2d');
        ctx.fillStyle='#FF0000';
        ctx.fillRect(0,0,80,80);
    //     MAItems.length === 0 ? (
    //         <div className="PreviewHint">拖动素材到这里</div>
    //     ) : MAItems.map((element: any) => {
    //         return <MAItemCanvas text={element.text} pos={element.pos}></MAItemCanvas>
    //     })
    })
    return (
        <div
            ref={SetDrop}
            className={isOver ? "PreviewOver" : "Preview"}
        >
            <canvas ref={canvasRef} width="500" height="300" style={{position: "absolute", width: 500, height: 300}} />
            {MAItems.length === 0 ? (
                <div className="PreviewHint">拖动素材到这里</div>
            ) : MAItems.map((element: any) => {
                return <MAItemCanvas text={element.text} pos={element.pos}></MAItemCanvas>
            })}
        </div>
    )
}