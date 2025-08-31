import { Workbook } from "exceljs";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Segmented, Select, Flex, Table } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import _ from 'lodash'
import 'antd/dist/reset.css'; // 或 antd/dist/antd.min.css


import './DataView.css'

const { Dragger } = Upload;

export const DataView = () => {
    const prefixCls = 'data-view'
    const [data, setData] = useState([])
    const [instrumentID, setInstrumentID] = useState('')
    const [date, setDate] = useState('')
    const [view, setView] = useState('table')

    const chartRef = useRef(null);
    useEffect(() => {
        if (!chartRef.current) return
        const chartInstance = echarts.init(chartRef.current);
        if (view === 'bar') {
            const filterData = data.filter((single) => {
                return single.dateStr === date
            })
            const uniqData = _.uniqBy(filterData, 'InstrumentID')
            const sortData = _.sortBy(uniqData, 'value')

            chartInstance.setOption({
                notMerge: true,
                xAxis: {
                    type: 'category',
                    data: sortData.map((v) => v.InstrumentID),
                    axisLabel: {
                        rotate: -45, // 旋转角度（30-90度效果最佳）
                        // interval: 0 // 强制显示所有标签
                    }
                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                },
                series: [
                    {
                        data: sortData.map((v) => v.value),
                        type: 'bar'
                    }
                ]
            })
        } else if (view === 'line') {
            const filterData = data.filter((single) => {
                return single.InstrumentID === instrumentID
            })
            const uniqData = _.uniqBy(filterData, 'dateStr')
            const sortData = _.sortBy(uniqData, 'dateStr')

            chartInstance.setOption({
                notMerge: true,
                xAxis: {
                    type: 'category',
                    data: sortData.map((v) => v.dateStr),
                    axisLabel: {
                        rotate: -45, // 旋转角度（30-90度效果最佳）
                        // interval: 0 // 强制显示所有标签
                    }
                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                },
                series: [
                    {
                        data: sortData.map((v) => v.value),
                        type: 'line'
                    }
                ]
            })
        }
    }, [instrumentID, date, data, view])

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.xlsx, .xls',
        showUploadList: false,
        beforeUpload(file) {
            (async function read() {
                const buffer = await file.arrayBuffer()
                const workbook = new Workbook();
                await workbook.xlsx.load(buffer)
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
                const dataArr = []
                const worksheet = workbook.getWorksheet(1)
                let isCorret = true
                worksheet.eachRow((row, rowNum) => {
                    if (rowNum > 1) { // 忽略第一行head
                        const dateStr = row.getCell(2).value as string
                        const InstrumentID = row.getCell(3).value as string
                        const value = row.getCell(4).value as number
                        const updateTimeStr = row.getCell(5).value as string
                        dataArr.push({
                            dateStr,
                            InstrumentID,
                            value,
                            updateTimeStr,
                        })
                    } else {
                        // 做个简单的判断
                        const dateStr = row.getCell(2).value as string
                        const InstrumentID = row.getCell(3).value as string
                        const value = row.getCell(4).value as string
                        const updateTimeStr = row.getCell(5).value as string
                        if (dateStr !== 'Date' || InstrumentID !== 'InstrumentID' || value !== 'value' || updateTimeStr !== 'UpdateTime') {
                            alert('数据格式有误')
                            isCorret = false
                        }
                    }
                })
                if (!isCorret) return

                const dataMap = _.groupBy(dataArr, (v) => `${v.InstrumentID}&${v.dateStr}`)
                for (const [key, value] of Object.entries(dataMap)) {
                    dataMap[key] = _.last(_.sortBy(value, (v) => v.updateTimeStr))
                }
                const dataResult = Object.values(dataMap)
                setData(dataResult)
                setInstrumentID((dataResult[0] as any).InstrumentID)
                setDate((dataResult[0] as any).dateStr)
            })()
            return false
        },
    };

    const renderContent = () => {
        return <Flex className={`${prefixCls}-wrap`} vertical style={{ padding: 20 }} gap={24}>
                    <Flex align="center">
                        <Segmented
                            size={'middle'}
                            value={view}
                            options={[
                                { value: 'table', label: '表格视图' },
                                { value: 'bar', label: '柱状图' },
                                { value: 'line', label: '折线图' },
                            ]}
                            onChange={(value) => setView(value)}
                        />
                    </Flex>
                    <Flex>
                        {
                            view === 'line' &&
                            <div className={`${prefixCls}-select`}>
                                <div>InstrumentID:&nbsp;&nbsp;</div>
                                <Select
                                    showSearch
                                    options={_.uniqBy(data, v => v.InstrumentID).map((v) => {
                                        return {
                                            value: v?.InstrumentID,
                                            label: v?.InstrumentID,
                                        }
                                    })}
                                    value={instrumentID}
                                    onChange={(v) => setInstrumentID(v)}
                                />
                            </div>
                        }
                        {
                            view === 'bar' &&
                            <div className={`${prefixCls}-select`}>
                                <div>Date:&nbsp;&nbsp;</div>
                                <Select
                                    showSearch
                                    options={_.uniqBy(data, v => v.dateStr).map((v) => {
                                        return {
                                            value: v?.dateStr,
                                            label: v?.dateStr,
                                        }
                                    })}
                                    value={date}
                                    onChange={(v) => setDate(v)}
                                />
                            </div>
                        }
                    </Flex>
                    <Flex>
                        {
                            view === 'table' ? <Table 
                            style={{width: '100%'}}
                            dataSource={data}
                            columns={['InstrumentID', 'dateStr', 'value', 'updateTimeStr'].map((v) => ({
                                dataIndex: v,
                                title: v,
                                sorter: (a,b) => a?.[v] > b?.[v] ? 1 : -1
                            }))}
                            bordered
                            /> :<div ref={chartRef} className={`${prefixCls}-charts`}></div>
                        }
                        
                    </Flex>
                </Flex>
    }
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
                renderContent()
            }
        </div>
    );
}