import { useDrag } from 'react-dnd'
import React, { useMemo } from 'react'

function MA() {
    const text = '一棵树'
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'MaterialItem',
        item: {
            text,
        },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      }))
    
    return (
        <div
            ref={drag as any}
            style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: 25,
                fontWeight: 'bold',
                cursor: 'move',
            }}
        >
            {text}
        </div>
    )
}

export default MA