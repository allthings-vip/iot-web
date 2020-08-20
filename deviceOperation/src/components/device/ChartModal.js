import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {Icon, Input, Button ,Row, Col,Breadcrumb,DatePicker,Form,Select,Modal   } from 'antd';
import styles from './ChartModal.less';
import TfIcon from '../common/TfIcon/index';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入折线图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import { getLocalTime,getLocalTimeF } from '../../utils/time';
let seriesV = []
class ChartModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            series : []
        }
    }
    onOk (){
        this.props.handleOk();
    }
    componentWillUnmount(){

        seriesV=[];
    }
    componentDidUpdate() {
        const {chartList,deviceCode,factorCodes,dispatch,factorName } = this.props;

        let myAnalyse = echarts.init(document.getElementById('analyse'));
        if(chartList.length>0){
             let list = seriesV.filter(item => item.value === chartList[0].value && item.inputDate === chartList[0].inputDate);
             if(list.length>0){

             } else {
                seriesV.push(...(chartList || []).map(v=>{
                    return v
                }));
             }
        }
        let  option1 = {
            grid: {
                // top: '8%',
                left: '2%',
                right: '6%',
                bottom: '6%'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x:'center',
                data: [factorName],
                itemWidth:20,
                itemHeight:20,
                backgroundColor:'#fff',
                textStyle:{
                    fontSize:16
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: (seriesV || []).map(v=>{
                        return v.inputDate ? getLocalTimeF(v.inputDate) :''
                    }),
                    axisLabel: {
                        color: '#333',
                        fontSize: 14,
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
            yAxis: [
                {
                    name: '',
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#e7e7e8'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'transparent'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    nameTextStyle: {
                        fontSize: 14,
                        color: '#333'
                    },
                    axisLabel: {
                        color: '#333',
                        fontSize: 14,
                        align: 'center'
                    }
                }
            ],
            series: [
                {
                    name: factorName,
                    type: 'line',
                    smooth: true,
                    data: seriesV,
                    symbol: 'circle',
                    symbolSize: 10, 
                    itemStyle: {
                        normal: {
                            color: '#0385ff',
                            border:'4px solid #0385ff',
                            lineStyle:{
                                tyle:'dotted',
                                shadowColor:'rgba(3,133,255,0.50)',
                                shadowBlur:10
                            }
                        }
                    }
                }
            ]
        };
        myAnalyse.setOption(option1);
    }
    render() {
        const {
        } = this.props;

        return (
            <div>
                <div className={styles.container}>
                
                    <div className={styles.chart}>
                        <div id="analyse" style={{ width: '100%', height:400 }}></div>
                    </div>
                </div>
            </div>
        );
    }

}

export default ChartModal;
