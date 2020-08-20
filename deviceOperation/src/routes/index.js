import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { getStampTime,getLocalTime } from '../utils/time';
import { getRouterConfig } from '../utils/native';
import {Breadcrumb, Icon,Row,Col,DatePicker,Button,Form} from 'antd'
import TfIcon from '../components/common/TfIcon/index';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import moment from 'moment';
import styles from './index.less';
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
const FormItem = Form.Item;

class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        let {
            addDeviceCounts,
            totalDeviceCounts,
            addPointCounts,
            totalPointCounts,
            projectTop,
            tags,
            kvsPoints,
            kvsPointsTitle,
            deviceTypeTop,
            pointProjectTop,
            pointTypeTop,} = this.props.index;
            //设备趋势
            let myChart = echarts.init(document.getElementById('main'));
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
                    x:'left',
                    data: ['总数据', '新增数据'],
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
                        data: (addDeviceCounts || []).map(v=>{
                            return getLocalTime(v.inputDate)
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
                            align: 'center',
                            formatter: function (value, index) {
                                if (value >= 10000 && value < 10000000) {
                                    value = value / 10000 + "万";
                                } else if (value >= 10000000) {
                                    value = value / 10000000 + "千万";
                                }
                                return value;
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '总数据',
                        type: 'line',
                        smooth: true,
                        data:(totalDeviceCounts || []).map(v=>{
                            return v.deviceCounts
                        }),
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
                    },
                    {
                        name: '新增数据',
                        type: 'line',
                        smooth: true,
                        data: (addDeviceCounts || []).map(v=>{
                            return v.deviceCounts
                        }),
                        symbol: 'circle',
                        symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#85d689',
                                border:'4px solid #85d689',
                                
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option1);


            //数据点数
            let  option2 = {
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
                    x:'left',
                    data: ['总数据', '新增数据'],
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
                        data: (addPointCounts || []).map(v=>{
                            return getLocalTime(v.inputDate)
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
                            align: 'center',
                            formatter: function (value, index) {
                                if (value >= 10000 && value < 10000000) {
                                    value = value / 10000 + "万";
                                } else if (value >= 10000000) {
                                    value = value / 10000000 + "千万";
                                }
                                return value;
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '总数据',
                        type: 'line',
                        smooth: true,
                        data:(totalPointCounts || []).map(v=>{
                            return v.pointCounts
                        }),
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
                    },
                    {
                        name: '新增数据',
                        type: 'line',
                        smooth: true,
                        data: (addPointCounts || []).map(v=>{
                            return v.pointCounts
                        }),
                        symbol: 'circle',
                        symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#85d689',
                                border:'4px solid #85d689',
                                
                            }
                        }
                    }
                ]
            };
            let myChart1 = echarts.init(document.getElementById('main1'));
            myChart1.setOption(option2);

            // 排行榜1
            let myAnalyse1 = echarts.init(document.getElementById('analyse1'));
            // var data_val1=[], name_val1=[];  
            // data = data.sort(function(a,b){  
            //     return b.val-a.val;  
            // });  
            // data.forEach(v=>{
            //     data_val1.push(n.value);  
            //     name_val1.push(n.inputDate);  
            // })  
            // option.xAxis.data = name_val1;  
            // option.series[0].data = data_val1;  
            // console.log('123123',projectTop.reverse());
            // console.log('3434',projectTop.sort(function(a,b){
            //     return a.deviceCounts - b.deviceCounts
            // }));
            projectTop = projectTop.sort(function(a,b){
                return a.deviceCounts - b.deviceCounts
            });
            let  analyse1 = {
                grid: {
                    left:'16%',
                },
                title : {
                    text: '设备排行榜(按项目统计)',
                    subtext: '',
                    x:'center',
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    itemWidth:20,
                    itemGap:100,
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                    
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data :(projectTop ||[]).map(v=>{
                            return v.title
                        }),
                        axisLabel:{
                            interval:0,
                            rotate:30
                        }
    
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: projectTop.length /2 * 20+'%',
                        data:(projectTop ||[]).map(v=>{
                            return v.deviceCounts
                        }),
                        itemStyle: {
                            normal: {
                                color: '#0289ff'
                            }
                        }
                    }
                ]
            };
            myAnalyse1.setOption(analyse1);

            // 排行榜2
            let myAnalyse2 = echarts.init(document.getElementById('analyse2'));
            deviceTypeTop = deviceTypeTop.sort(function(a,b){
                return a.deviceCounts - b.deviceCounts
            });
            let  analyse2 = {
                grid: {
                    left:'16%',
                },
                title : {
                    text: '设备排行榜(按设备类型统计)',
                    subtext: '',
                    x:'center',
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                    
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data :(deviceTypeTop ||[]).map(v=>{
                            return v.title
                        }),
                        axisLabel:{
                            rotate:30
                        }
    
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: deviceTypeTop.length /2 * 20+'%',
                        data:(deviceTypeTop ||[]).map(v=>{
                            return v.deviceCounts
                        }),
                        itemStyle: {
                            normal: {
                                color: '#0289ff'
                            }
                        }
                    }
                ]
            };
            myAnalyse2.setOption(analyse2);

            // 排行榜3
            let myAnalyse3 = echarts.init(document.getElementById('analyse3'));
            pointTypeTop = pointTypeTop.sort(function(a,b){
                return a.pointCounts - b.pointCounts
            });
            let  analyse3 = {
                grid: {
                    left:'16%',
                },
                title : {
                    text: '数据点数排行榜(按设备类型统计)',
                    subtext: '',
                    x:'center',
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                    
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data :(pointTypeTop ||[]).map(v=>{
                            return v.title
                        }),
                        axisLabel:{
                            rotate:30
                        }
    
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: pointTypeTop.length /2 * 20+'%',
                        data:(pointTypeTop ||[]).map(v=>{
                            return v.pointCounts
                        }),
                        itemStyle: {
                            normal: {
                                color: '#0289ff'
                            }
                        }
                    }
                ]
            };
            myAnalyse3.setOption(analyse3);

            // 排行榜4
            let myAnalyse4 = echarts.init(document.getElementById('analyse4'));
            
            pointProjectTop = pointProjectTop.sort(function(a,b){
                return a.pointCounts - b.pointCounts
            });
            let  analyse4 = {
                grid: {
                    left:'16%',
                },
                title : {
                    text: '数据点数排行榜(按项目统计)',
                    subtext: '',
                    x:'center',
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                    
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data :(pointProjectTop ||[]).map(v=>{
                            return v.title
                        }),
                        axisLabel:{
                            rotate:30
                        }
    
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth: pointProjectTop.length /2 * 20+'%',
                        data:(pointProjectTop ||[]).map(v=>{
                            return v.pointCounts
                        }),
                        itemStyle: {
                            normal: {
                                color: '#0289ff'
                            }
                        },
                    }
                ]
            };
            myAnalyse4.setOption(analyse4);

            // 设备分布
            let myDevice1 = echarts.init(document.getElementById('device1'));
            let device1 = {
                grid: {
                    top: '0%',
                    // left: '9%',
                    // right: '6%',
                    // bottom: '6%'
                },
                title : {
                    text: '设备标签分布',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '设备标签分布',
                        type: 'pie',
                        radius : '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data:(tags||[]).map(v=>{
                            return{
                                value: v.deviceCounts,
                                name: v.title,
                                id: v.iotTitleId,
                            }
                        }),
                        itemStyle: {
                            normal:{
                                label:{
                                    textStyle:{
                                        // fontSize:16
                                    },
                                    formatter:"{b} {d}%"
                                },
                                labelLine:{
                                    length:20
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myDevice1.setOption(device1);
            myDevice1.on("click", this.tagClick);

            // 设备分布
            let myDevice2 = echarts.init(document.getElementById('device2'));
            let device2 = {
                grid: {
                    top: '0%',
                    // left: '9%',
                    // right: '6%',
                    // bottom: '6%'
                },
                title : {
                    text: kvsPointsTitle+'设备类型分布',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: kvsPointsTitle+'设备类型分布',
                        type: 'pie',
                        radius : '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data:(kvsPoints||[]).map(v=>{
                            return{
                                value: v.deviceCounts,
                                name: v.title,
                                id: v.iotTitleId
                            }
                        }),
                        itemStyle: {
                            normal:{
                                label:{
                                    textStyle:{
                                        //fontSize:16
                                    },
                                    formatter:"{b} {d}%"
                                },
                                labelLine:{
                                    length:20
                                }
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myDevice2.setOption(device2);
            
        }
    tagClick = (item) =>{
        const {dispatch} = this.props;
        console.log(item)
        if(item.data){
            dispatch({
                type: 'index/updateState',
                payload:{
                    kvsPointsTitle: item.data.name
                }
            })
            dispatch({
                type:'index/getKvsPoint',
                payload:{
                    iotTagId: item.data.id,
                    startDatetime:'',
                    endDatetime:''
                }
            })
        }
    }
    componentDidMount() {
       
    }
    onChange =(date, dateString)=>{
        var startDatetime = new Date(moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment(dateString[1]).format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        //总设备数
        this.props.dispatch({
            type: 'index/getTotalDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total'
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'index/getAddDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added'
            }
        });
    }
    onPointChange =(date, dateString)=>{
        var startDatetime = new Date(moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment(dateString[1]).format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        //总设备数
        this.props.dispatch({
            type: 'index/getTotalPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total'
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'index/getAddPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added'
            }
        });
    }
    timePresetSelect = (val) => {
        let { form: {setFieldsValue}, timePreset} = this.props;
        // 快速搜索运单号进来，日期会清空
        setFieldsValue({time: [moment().subtract(parseInt(val, 10), 'days'), moment().add(0, 'days')]});
        var  startDatetime= new Date(moment().subtract(parseInt(val, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        //总设备数
        this.props.dispatch({
            type: 'index/getTotalDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total'
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'index/getAddDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added'
            }
        });
    }
    timePresetSelect1 = (val) => {
        let { form: {setFieldsValue}, timePreset} = this.props;
        // 快速搜索运单号进来，日期会清空
        setFieldsValue({time1: [moment().subtract(parseInt(val, 10), 'days'), moment().add(0, 'days')]});
        var  startDatetime= new Date(moment().subtract(parseInt(val, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        //总设备数
        this.props.dispatch({
            type: 'index/getTotalPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total'
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'index/getAddPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added'
            }
        });
    }
    render() {
        let menusConfig = getRouterConfig();
        let menus = Object.keys(menusConfig);
        let {index,form:{
            getFieldDecorator,
        }} = this.props;
        let {
            addDeviceCounts,
            totalDeviceCounts,
            addPointCounts,
            totalPointCounts,
            projectTop,
            tags,
            deviceTypeTop,
            pointProjectTop,
            pointTypeTop,
            timePresetData, 
            timePreset,
            queryData} = index;
        const data = queryData || {}
       
        return (
            <div className={styles.container}>
                {/* <Breadcrumb>
                    <Breadcrumb.Item href="">
                    <TfIcon type="local" style={{color:'#0385ff'}}/>
                    <span>首页看板</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div className={styles.con}>
                    <Row type="flex">
                        <Col className={styles.boardItem}>
                            <div className={styles.projectCon}>
                                <div className={styles.f1} style={{background:'#0385ff',boxShadow: '0 0 0 17px #0385ff1a'}}><img src={require('../assets/image/index/project.png')}/></div>
                                <p className={styles.f2}>接入项目数（个）</p>
                                <p className={styles.f3}>{data.projectCounts || 0}</p>
                                <p className={styles.f4}></p>
                            </div>
                        </Col>
                        <Col className={styles.boardItem}>
                            <div className={styles.projectCon}>
                                <div className={styles.f1} style={{background:'#ffcd31',boxShadow: '0 0 0 17px #ffcd311a'}}><img src={require('../assets/image/index/project.png')}/></div>
                                <p className={styles.f2}>设备类型数（个）</p>
                                <p className={styles.f3}>{data.deviceTypeCounts || 0}</p>
                                <p className={styles.f4}></p>
                            </div>
                        </Col>
                        <Col className={styles.boardItem}>
                            <div className={styles.projectCon}>
                                <div className={styles.f1}  style={{background:'#ff7b8b',boxShadow: '0 0 0 17px #ff7b8b1a'}}><img src={require('../assets/image/index/project.png')}/></div>
                                <p className={styles.f2}>接入设备总数（台）</p>
                                <p className={styles.f3}>{data.deviceCounts || 0}</p>
                                <p className={styles.f4}>在线设备数量:<span>{data.onlineDeviceCounts || 0}</span>台</p>
                            </div>
                        </Col>
                        <Col className={styles.boardItem}>
                            <div className={styles.projectCon}>
                                <div className={styles.f1} style={{background:'#85d689',boxShadow: '0 0 0 17px #85d6891a'}}><img src={require('../assets/image/index/project.png')}/></div>
                                <p className={styles.f2}>今日新增设备（台）</p>
                                <p className={styles.f3}>{data.addedTodayDeviceCounts || 0}</p>
                                <p className={styles.f4}>昨日新增设备:<span>{data.addedYesterdayDeviceCounts || 0}</span>台</p>
                            </div>
                        </Col>
                        <Col className={styles.boardItem}>
                            <div className={styles.projectCon}>
                                <div className={styles.f1} style={{background:'#9386f0',boxShadow: '0 0 0 17px #9386f01a'}}><img src={require('../assets/image/index/project.png')}/></div>
                                <p className={styles.f2}>数据点数（条）</p>
                                <p className={styles.f3}>{data.totalPointCounts || 0}</p>
                                <p className={styles.f4}>今日新增:<span>{data.addedTodayPointCounts || 0}</span>条</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className={styles.title}>
                        <Col span={24}>
                            设备趋势
                        </Col>
                    </Row>
                    <Row className={styles.tendence}>
                    
                        <Col span={24}>
                            <Form>
                                <FormItem>
                                <div className={styles.date}> 
                                    {
                                        timePresetData.map((v, i) => <a key={v.val}  className={styles.btn} onClick={() => {
                                            this.timePresetSelect(v.val);
                                        }}>{v.text}</a>)
                                    }
                                    {/* <a className={styles.btn} onClick={this.setDate}>本周</a>
                                    <a className={styles.btn}>本月</a>
                                    <Button type="default">本月</Button> */}
                                    <span>时间:</span>
    
                                            {getFieldDecorator('time', {
                                                initialValue: [moment().subtract(parseInt(6, 10), 'days'),moment().add(0, 'days'), ]
                                            })(
                                                <RangePicker onChange={this.onChange} size="default" ranges={{
                                                    '今天': [moment(), moment()],
                                                    '本月': [moment().startOf('month'), moment().endOf('month')]
                                                }} format={'YYYY-MM-DD'} placeholder={['开始', '截止']}/>
                                            )}
                                    
                                </div>
                                </FormItem>
                            </Form>
                            <div id="main" style={{ width: '100%', height: 400 }}></div>
                        </Col>
                    </Row>
                    <Row className={styles.title}>
                        <Col span={24}>
                            数据点上传趋势分析
                        </Col>
                    </Row>
                    <Row className={styles.tendence}>
                        <Col span={24}>
                            <Form>
                                <FormItem>
                                <div className={styles.date}> 
                                    {
                                        timePresetData.map((v, i) => <a key={v.val}  className={styles.btn} onClick={() => {
                                            this.timePresetSelect1(v.val);
                                        }}>{v.text}</a>)
                                    }
                                    {/* <a className={styles.btn} onClick={this.setDate}>本周</a>
                                    <a className={styles.btn}>本月</a>
                                    <Button type="default">本月</Button> */}
                                    <span>时间:</span>
    
                                            {getFieldDecorator('time1', {
                                                initialValue: [moment().subtract(parseInt(6, 10), 'days'),moment().add(0, 'days'),]
                                            })(
                                                <RangePicker  onChange={this.onPointChange} size="default" ranges={{
                                                    '今天': [moment(), moment()],
                                                    '本月': [moment().startOf('month'), moment().endOf('month')]
                                                }} format={'YYYY-MM-DD'} placeholder={['开始', '截止']}/>
                                            )}
                                    
                                </div>
                                </FormItem>
                            </Form>
                            <div id="main1" style={{ width: '100%', height: 400 }}></div>
                        </Col>
                    </Row>
                    <Row className={styles.title}>
                        <Col span={24}>
                            Top排行榜
                        </Col>
                    </Row>
                    <div className={styles.analyse}>
                        <div style={{paddingRight:'20px',width:'50%'}}>
                            <div className={styles.chart}>
                                <div id="analyse1" style={{ width: '100%',height: 400 }}></div>
                            </div>
                        </div>
                        <div style={{width:'50%'}}>
                            <div className={styles.chart}>
                                <div id="analyse2" style={{ width: '100%', height: 400 }}></div>
                            </div>
                        </div>
                    </div>
                    <Row className={styles.analyse}>
                        <Col span={12}  style={{paddingRight:'20px',width:'50%'}}>
                            <div className={styles.chart}>
                                <div id="analyse3" style={{ width: '100%', height: 400 }}></div>
                            </div>
                        </Col>
                        <Col span={12} style={{width:'50%'}}>
                            <div className={styles.chart}>
                                <div id="analyse4" style={{width: '100%', height: 400 }}></div>
                            </div>
                        </Col>
                    </Row>
                    <Row className={styles.title}>
                        <Col span={24}>
                            设备分布
                        </Col>
                    </Row>
                    <Row className={styles.analyse}>
                        <Col style={{paddingRight:'20px',width:'50%'}}>
                            <div className={styles.chart}>
                                <div id="device1" style={{ width: '100%',  height: 400 }}></div>
                            </div>
                        </Col>
                        <Col style={{width:'50%'}}>
                            <div className={styles.chart}>
                                <div id="device2" style={{ width: '100%',  height: 400 }}></div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

// export default connect()(IndexPage);
export default connect(({ index }) => ({ index }))(Form.create()(IndexPage));