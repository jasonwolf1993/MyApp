import { useState } from 'react'
import { Segmented } from 'antd'
import Preview from './Preview'
import CM from './CodeMirror'

const ModeMap = {
    0: '画布模式',
    1: '代码模式',
}

export default function MainContent() {
    const [mode, setMode] = useState(0)
    return (
        <div className="MainContent">
            <div className="ModeChoose">
                <Segmented
                    size={'middle'}
                    shape="round"
                    value={mode}
                    options={[
                        { value: 0, icon: ModeMap[0] },
                        { value: 1, icon: ModeMap[1] },
                    ]}
                    onChange={(value) => setMode(value)}
                />
            </div>
            <div style={{flex:1}}>
                {mode ? <CM></CM> : <Preview></Preview>}
            </div>
        </div>
    )
}