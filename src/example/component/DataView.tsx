import { Workbook } from "exceljs";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';


import './DataView.css'

const { Dragger } = Upload;

export const DataView = () => {
    const prefixCls = 'data-view'
    const [data, setData] = useState({})
    const [instrumentID, setInstrumentID] = useState('')
    const chartRef = useRef(null);
    useEffect(() => {
        if (!chartRef.current) return
        const chartInstance = echarts.init(chartRef.current);
        const instrumentData = data[instrumentID]
        chartInstance.setOption({
            xAxis: {
                type: 'category',
                data: instrumentData ? Object.keys(instrumentData) : []
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: instrumentData ? Object.values(instrumentData).map((single: any) => {return single.value}) : [],
                    type: 'line'
                }
            ]
        })
    }, [instrumentID, data])

    function onInstrumentChange(value) {
        setInstrumentID(value)
    }

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.xlsx, .xls',
        showUploadList: false,
        beforeUpload(file) {
            file.arrayBuffer().then((buffer) => {
                const workbook = new Workbook();
                workbook.xlsx.load(buffer).then(() => {
                    // 读取excel，数据整理数据为以下格式：
                    // {
                    //     '000007.SZ': {
                    //         '2025-01-02': {
                    //             value: 0.1, // 只保留最新updateTime对应的数据
                    //             updateTime: new Date('2025-01-03 07:25:21'),
                    //         },
                    //         ...
                    //     },
                    //     ...
                    // }
                    const dataResult = {}
                    const worksheet = workbook.getWorksheet(1)
                    worksheet.eachRow((row, rowNum) => {
                        if (rowNum > 1) { // 忽略第一行head
                            const dateStr = row.getCell(2).value as string
                            const InstrumentID = row.getCell(3).value as string
                            const value = row.getCell(4).value as number
                            const updateTimeStr = row.getCell(5).value as string
                            if (!dataResult[InstrumentID]) {
                                dataResult[InstrumentID] = {}
                            }
                            if (!dataResult[InstrumentID][dateStr]) {
                                dataResult[InstrumentID][dateStr] = {
                                    value,
                                    updateTime: new Date(updateTimeStr)
                                }
                            } else {
                                // 取最新
                                const prevUpdateTime = dataResult[InstrumentID][dateStr].updateTime
                                const currentUpdateTime = new Date(updateTimeStr)
                                if (currentUpdateTime.getTime() > prevUpdateTime.getTime()) {
                                    dataResult[InstrumentID][dateStr].value = value
                                    dataResult[InstrumentID][dateStr].updateTime = currentUpdateTime
                                }
                            }
                        }
                    })
                    setData(dataResult)
                    const instrumentIDs = Object.keys(dataResult)
                    if (instrumentIDs.length > 0) {
                        setInstrumentID(instrumentIDs[0]) // 默认选中第一个
                    }
                })
            })
            return false
        },
    };
    return (
        <div className={`${prefixCls}`}>
            {
                Object.keys(data).length === 0 ?
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽excel文件</p>
                </Dragger>
                :
                <div className={`${prefixCls}-main`}>
                    <div className={`${prefixCls}-select`}>
                        <div>选择InstrumentID:&nbsp;&nbsp;</div>
                        <Select
                            showSearch
                            placeholder={instrumentID || '选择InstrumentID'}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={Object.keys(data).map((id) => {
                                return {
                                    value: id,
                                    label: id,
                                }
                            })}
                            onChange={onInstrumentChange}
                        />
                    </div>
                    <div ref={chartRef} className={`${prefixCls}-charts`} ></div>
                </div>
            }
        </div>
    );
}