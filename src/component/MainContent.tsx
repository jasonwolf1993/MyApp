import React, { useState } from 'react'
import { Segmented } from 'antd'
import Preview from './Preview'
import CM from './CodeMirror'
import { useDispatch, useSelector } from 'react-redux'
import { chooseCanvas, chooseCode, chooseModeSelector } from '../store/app'

const ModeMap = {
    0: '画布模式',
    1: '代码模式',
}

export default function MainContent() {
    // const [mode, setMode] = useState(0)
    const chooseMode = useSelector(chooseModeSelector)
    const dispatch = useDispatch()
    function changeMode(value: number) {
        console.log('change mode to:', value)
        if (value === 0) {
            dispatch(chooseCanvas())
        } else {
            dispatch(chooseCode())
        }
    }
    return (
        <div className="MainContent">
            <div className="ModeChoose">
                <Segmented
                    size={'middle'}
                    shape="round"
                    value={chooseMode}
                    options={[
                        { value: 0, icon: ModeMap[0] },
                        { value: 1, icon: ModeMap[1] },
                    ]}
                    onChange={(value) => changeMode(value)}
                />
            </div>
            <div style={{flex:1}}>
                {chooseMode ? <CM></CM> : <Preview></Preview>}
            </div>
        </div>
    )
}