import React, {Component} from 'react';

import { getLocalTimeF } from '../../utils/time';
import TfIcon from '../common/TfIcon/index';
import echarts from 'echarts/lib/echarts';
import NullResult from '../NullResult';
// 引入折线图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import { Row, Col, Breadcrumb, Spin } from 'antd';
import styles from './opsDetail.less';
class OpsDetail extends Component {
    constructor(props) {
        super(props);

        // this.cpuDataArr = []
        // this.cpuTime = []
    }

    goList = () => {
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                detailModal: false,
            }
        })
        // this.props.cancelTimeout();
    }

    render() {
        const {detailData, detailRecord, cpuData, reportTime, heapData, nonHeapData, netSpeedData} = this.props;
        let cpuSort = cpuData.map(item => {return item}).sort((value1, value2) => {
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        })
        let cpuaverage = cpuData.length ? cpuData.reduce((prev, cur, index, array) => {
            return prev + cur;
        })/(cpuData.length) : 0
        return (
            <div>
                <Breadcrumb style={{display:'inline-block'}}>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>运维监控</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>服务详情</span>
                    </Breadcrumb.Item>
                            
                </Breadcrumb>
                <a onClick={this.goList} style={{marginLeft:'20px',textDecoration:'underline'}}>返回</a>
                <div className={styles.card}>
                    <p><img src={require('../../assets/image/title.png')}/><span>基础信息</span></p>
                    <Row>
                        <Col span={6}><span>服务名称：</span><span>{detailRecord.serviceName || ''}</span><div className={styles.status} style={{backgroundColor: detailRecord.status ? '#00B603' : '#CACACA'}}></div></Col>
                        <Col span={6}><span>IP/端口：</span><span>{detailRecord.ip}:{detailRecord.port}</span></Col>
                        <Col span={6}><span>启动时间：</span><span>{detailData.runTime || ''}</span></Col>
                        <Col span={6}><span>运行：</span><span>{detailData.diffTime || ''}</span></Col>
                        <Col span={6}>
                        <Row>
                            <Col span={24}>
                                <span>构建信息：</span>{detailData.version ? <span>version:{detailData.version || ''}</span> : ('')}
                            </Col>
                            {
                                detailData.buildTime ? (
                                    <Col span={24}>
                                        <span>&emsp;&emsp;&emsp;&emsp;&emsp;</span><span>time:{detailData.buildTime || ''}</span>
                                    </Col>
                                ) : ('')
                            }
                        </Row>
                        </Col>
                        <Col span={18}><span>依赖的服务：</span><span>{detailRecord.dependencyService || ''}</span></Col>
                    </Row>
                </div>
                <div className={styles.charts}>
                <p><img src={require('../../assets/image/title.png')}/><span>资源信息</span></p>
                <Spin spinning={!this.props.loading1}>
                    {
                        Object.keys(detailData).length ? 
                    <Row>
                        <Col span={7}>
                            <div>
                                <span>磁盘空间：总共{detailData.totalDiskSpace}G</span>
                            </div>
                            <div id='disk' ></div>   
                        </Col>
                        <Col span={17}>
                            <div>
                                <span>CPU使用率：最新{detailData.cpu}% &nbsp;&nbsp;&nbsp;&nbsp; 最小{cpuSort[0] || 0}% &nbsp;&nbsp;&nbsp;&nbsp; 平均{cpuaverage.toFixed(2)}% &nbsp;&nbsp;&nbsp;&nbsp; 最大{cpuSort[cpuData.length-1] || 0}%</span>
                            </div>
                            <div id='cpu' ></div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <span>内存占用：heap:{detailData.heap}M {detailData.heapRatio}% &nbsp;&nbsp;&nbsp;&nbsp; nonHeap:{detailData.nonHeap}M {detailData.nonHeapRatio}%</span>
                            </div>
                            <div id='memory' ></div>    
                        </Col>
                        <Col span={12}>
                            <div>
                                <span>网络速率：{detailData.netSpeed}Mbps</span>
                            </div>
                            <div id='net' ></div>                      
                        </Col>
                    </Row> : (<NullResult />)
                    }
                </Spin>
                </div>
            </div>
        )
    }

    componentDidMount() {

    }
    componentDidUpdate(prevProps) {
           if(this.props.reportTime == prevProps.reportTime) {return};
           
            this.disk && this.disk.clear();
            this.cpu && this.cpu.clear();
            this.memory && this.memory.clear();
            this.net && this.net.clear();

            this.disk = echarts.init(document.getElementById('disk'));
            this.cpu = echarts.init(document.getElementById('cpu'));
            this.memory = echarts.init(document.getElementById('memory'));
            this.net = echarts.init(document.getElementById('net'));

            const { detailData, cpuData, reportTime, heapData, nonHeapData, netSpeedData } = this.props;
            
            let diskSeriesData = [
                {
                    name: 'diskSpace',
                    type: 'pie',
                    radius: [40, 100],
                    data: [
                        {name: '可用', value: detailData.usableDiskSpace},
                        {name: '已用', value: detailData.totalDiskSpace - detailData.usableDiskSpace}
                    ]
                }
            ]
            let cpuSeriesData = [
                {
                    name: 'cpu',
                    type: 'line',
                    smooth: true,
                    data: cpuData,
                    symbol: 'none',
                    symbolSize: 10, 
                    itemStyle: {
                        normal: {
                            // color: '#0385ff',
                            // border:'4px solid #0385ff',
                            lineStyle:{
                                tyle:'dotted',
                                shadowColor:'rgba(3,133,255,0.50)',
                                shadowBlur:10
                            }
                        }
                    },
                    yAxisIndex: 0
                }
            ]
            let heapSeriesData = [
                {
                    name: 'heap',
                    type: 'line',
                    data: heapData,
                    symbol: 'none',
                    symbolSize: 10, 
                    itemStyle: {
                        normal: {
                            // color: '#0385ff',
                            // border:'4px solid #0385ff',
                            lineStyle:{
                                tyle:'dotted',
                                shadowColor:'rgba(3,133,255,0.50)',
                                shadowBlur:10
                            }
                        }
                    },
                },
                {
                    name: 'nonHeap',
                    type: 'line',
                    data: nonHeapData,
                    symbol: 'none',
                    symbolSize: 10, 
                    itemStyle: {
                        normal: {
                            // color: '#0385ff',
                            // border:'4px solid #0385ff',
                            lineStyle:{
                                tyle:'dotted',
                                shadowColor:'rgba(3,133,255,0.50)',
                                shadowBlur:10
                            }
                        }
                    },
                }
            ]
            let netSpeedSeriesData = [
                {
                    name: 'netSeries',
                    type: 'line',
                    data: netSpeedData,
                    symbol: 'none',
                    symbolSize: 10, 
                    itemStyle: {
                        normal: {
                            // color: '#0385ff',
                            // border:'4px solid #0385ff',
                            lineStyle:{
                                tyle:'dotted',
                                shadowColor:'rgba(3,133,255,0.50)',
                                shadowBlur:10
                            }
                        }
                    },
                    yAxisIndex: 0
                }
            ]

            let cpuyAxis = [
                {
                    show :true,
                    type: 'value',
                    boundaryGap: false,
                    axisLine: {
                        show: false,
                    },
                    splitArea: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: { // 这个是隐藏Y轴的数值
                        show:true,
                        fontSize: 10,
                        formatter: `{value}%`
                    },
                    splitLine: { 
                        show: true,  // Y轴的横线显示
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                }
            ]
            let heapyAxis = [
                {
                    show :true,
                    type: 'value',
                    boundaryGap: false,
                    axisLine: {
                        show: false,
                    },
                    splitArea: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: { // 这个是隐藏Y轴的数值
                        show:true,
                        fontSize: 10,
                        formatter: `{value}MB`
                    },
                    splitLine: { 
                        show: true,  // Y轴的横线显示
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
            ]
            let netSpeedyAxis = [
                {
                    show :true,
                    type: 'value',
                    boundaryGap: false,
                    axisLine: {
                        show: false,
                    },
                    splitArea: {
                        show: false,
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: { // 这个是隐藏Y轴的数值
                        show:true,
                        fontSize: 10,
                        formatter: `{value}Mb`
                    },
                    splitLine: { 
                        show: true,  // Y轴的横线显示
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                }
            ]
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let  cpuOption = {
                color:colors,
                title: {
                     show: true,
                     text: 'CPU百分比(1h)',
                     left: 'center',
                     textStyle: {
                         color: '#111C26',
                         fontSize: 14,
                         fontWeight: 'lighter'
                     },
                },
                grid: {
                    // top: '8%',
                    left: '5%',
                    right: '6%',
                    bottom: '8%'
                },
                tooltip: {
                    trigger: 'axis',
                    extraCssText:'width:160px;height:auto;'
                },
                animation: false,
                xAxis: [
                    {
                        type: 'category',
                        data: reportTime,
                        axisLabel: {
                            color: '#333',
                            fontSize: 10,
                            align: 'left'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisTick: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    }
                ],
                yAxis: cpuyAxis || [],
                series: cpuSeriesData || []    
            };
            let heapOption = {
                color:colors,
                title: {
                    show: true,
                    text: '物理内存：总共'+detailData.totalRAM+'MB'+' '+'当前'+detailData.avaliableRAM+'MB',
                    left: 'center',
                    textStyle: {
                        color: '#111C26',
                        fontSize: 14,
                        fontWeight: 'lighter'
                    }
                },
                grid: {
                    // top: '8%',
                    left: '10%',
                    right: '3%',
                    bottom: '8%'
                },
                tooltip: {
                    trigger: 'axis',
                    extraCssText:'width:160px;height:auto;'
                },
                animation: false,
                legend: {
                    left: 'right',
                    selectedMode: false,
                    itemWidth:10,
                    itemHeight:10,
                    textStyle:{
                        fontSize:12
                    },
                    data: [
                        {
                            name: 'heap',
                            icon: 'rect',
                        },
                        {
                            name: 'nonHeap',
                            icon: 'rect',
                        },
                    ]
                },
                xAxis: [
                    {
                        type: 'category',
                        data: reportTime,
                        axisLabel: {
                            color: '#333',
                            fontSize: 10,
                            align: 'left'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisTick: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    }
                ],
                yAxis: heapyAxis || [],
                series: heapSeriesData || []    
            }
            let netSpeedOption = {
                color:colors,
                grid: {
                    // top: '8%',
                    left: '10%',
                    right: '3%',
                    bottom: '8%'
                },
                tooltip: {
                    trigger: 'axis',
                    extraCssText:'width:160px;height:auto;'
                },
                animation: false,
                xAxis: [
                    {
                        type: 'category',
                        data: reportTime,
                        axisLabel: {
                            color: '#333',
                            fontSize: 10,
                            align: 'left'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        },
                        axisTick: {
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    }
                ],
                yAxis: netSpeedyAxis || [],
                series: netSpeedSeriesData || []    
            }
            let diskSpaceOption = {
                color: ['#0289FF', '#F7BF3C'],
                tooltip: {
                    formatter: `{b}:{d}%`,
                    extraCssText:'width:160px;height:auto;'
                },
                animation: false,
                legend: {
                    top: 'bottom',
                    selectedMode: false,
                    itemWidth:10,
                    itemHeight:10,
                    textStyle:{
                        fontSize:12
                    },
                    data: [
                        {
                            name: '可用',
                            icon: 'rect',
                        },
                        {
                            name: '已用',
                            icon: 'rect',
                        },
                    ],
                    formatter:  function (name) {
                        return name + (name == '可用' ? detailData.usableDiskSpace.toFixed(2) : (detailData.totalDiskSpace-detailData.usableDiskSpace).toFixed(2)) + 'G'
                    }
                },
                series: diskSeriesData
            }
            this.cpu.setOption(cpuOption);
            this.memory.setOption(heapOption);
            this.net.setOption(netSpeedOption);
            this.disk.setOption(diskSpaceOption)
        
    }

    componentWillUnmount() {
        this.props.cancelTimeout();
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                cpuData: [], // CPU使用率
                reportTime: [], // 上报时间
                heapData: [], //堆内存
                nonHeapData: [], // 非堆内存
                netSpeedData: [], //网络流量
                detailData: {},
                loading1: false
            }
        })
    }
}

export default OpsDetail;
