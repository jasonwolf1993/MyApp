import { useDrop } from 'react-dnd'
import React, { useRef, useState } from 'react';
import MAItemCanvas from './component/MaterialItemCanvas';

export default function Preview() {
    const dropRef = useRef(null)
    const [MAItems, setMAItems] = useState([])
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'MaterialItem',
        drop: (item, monitor) => {
            // 获取鼠标的视口坐标
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset || !dropRef.current) return;
      
            // 获取放置区域的视口位置信息
            const rect = dropRef.current.getBoundingClientRect();
            // 计算相对坐标
            const relativeX = clientOffset.x - rect.left;
            const relativeY = clientOffset.y - rect.top;
      
            console.log('相对位置:', { x: relativeX, y: relativeY });
            // 执行其他操作，如更新状态等
            setMAItems(prev => [...prev, {text: item.text, pos: { x: relativeX, y: relativeY }}])
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const SetDrop = (dom) => {
        drop(dom)
        dropRef.current = dom
    }
    console.log('MAItems are: ', MAItems)
    return (
        <div
            ref={SetDrop}
            className={isOver ? "PreviewOver" : "Preview"}
        >
            {MAItems.length === 0 ? (
                <div className="PreviewHint">拖动素材到这里</div>
            ) : MAItems.map(element => {
                return <MAItemCanvas text={element.text} pos={element.pos}></MAItemCanvas>
            })}
        </div>
    )
}