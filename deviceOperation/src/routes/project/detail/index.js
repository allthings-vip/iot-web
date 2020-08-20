import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Tabs,Form,Select,DatePicker, message   } from 'antd';
import lodash from 'lodash';
import styles from './index.less';
import styles2 from './index2.less';
import styles3 from '../../home/index.less';
import {Page} from '../../../utils/constant';
import { imageUrl } from '../../../utils/common';
import { getRouterConfig } from '../../../utils/native';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../../utils/time';
import {deviceStatus,deviceConnectStatus} from '../../../utils/const';
import TfIcon from '../../../components/common/TfIcon/index';
import NullResult from '../../../components/NullResult';
import AppsecretrModal from '../../../components/project/appsecretModal';
import AddressModal from '../../../components/project/callbackAddress';

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
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const formLayout = {
    wrapperCol: {
        span: 24
    },
    style: {
        marginBottom: 0
    }
}
const formLayout1 = {

    wrapperCol: {
        span: 24
    },
    style: {
        marginBottom: 0,
    }
}
const formLayout2 = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 0,
    }
}

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            iotDeviceTypeId:'',
            btn: '29',
            btn1: '29'
        }
    }
    goUrl = () => {
        const {history} = this.props;
        history.push('/device');
    }

    componentDidUpdate(prevProps) {
        
            let {
                addDeviceCounts,
                totalDeviceCounts,
                addPointCounts,
                totalPointCounts,
            } = this.props.projectDetail;
            const { projectDetail } = prevProps || {}
            let {
                addDeviceCounts: prevaddDeviceCounts,
                totalDeviceCounts: prevtotalDeviceCounts,
                addPointCounts: prevaddPointCounts,
                totalPointCounts: prevtotalPointCounts,
            } = projectDetail || {};
            if (addDeviceCounts == prevaddDeviceCounts && totalDeviceCounts == prevtotalDeviceCounts && 
            addPointCounts == prevaddPointCounts && totalPointCounts == prevtotalPointCounts) {return;}
            this.myChart && this.myChart.clear();
            this.myChart1 && this.myChart1.clear();
            //设备趋势
            if (addDeviceCounts.length || totalDeviceCounts.length) { 
                ReactDom.render(<div id="main" style={{ width: '100%', height: 400 }}></div>, document.getElementById('mainContainer'))
                let  option1 = {
                    grid: {
                        // top: '8%',
                        left: '5%',
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
                            smooth: false,
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
                            smooth: false,
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
                setTimeout(()=>{
                    this.myChart = echarts.init(document.getElementById('main'));
                    this.myChart.setOption(option1); 
                },0)
            } else {
                ReactDom.unmountComponentAtNode(document.getElementById('mainContainer'))
                ReactDom.render(<NullResult />, document.getElementById('mainContainer'))
            }

            if (addPointCounts.length || totalPointCounts.length) {
                ReactDom.render(<div id="main1" style={{ width: '100%', height: 400 }}></div>, document.getElementById('mainContainer1'))
                //数据点数
                let  option2 = {
                    grid: {
                        // top: '8%',
                        left: '5%',
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
                            smooth: false,
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
                            smooth: false,
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
                setTimeout(()=>{
                    this.myChart1 = echarts.init(document.getElementById('main1'));
                    this.myChart1.setOption(option2); 
                },0)
            } else {
                ReactDom.unmountComponentAtNode(document.getElementById('mainContainer1'))
                ReactDom.render(<NullResult />, document.getElementById('mainContainer1')) 
            }
        
    }

    onChange =(date, dateString)=>{
        let iotProjectId = localStorage.getItem('iotProjectId')
        var startDatetime = new Date(moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment(dateString[1]).format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        if(endDatetime - startDatetime > 31*24*60*60*1000){
            message.warn('时间选择不能超过31天');
            return;
        }
        this.setState({btn: ''})
        //总设备数
        this.props.dispatch({
            type: 'projectDetail/getTotalDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total',
                iotProjectId
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'projectDetail/getAddDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added',
                iotProjectId
            }
        });
    }
    onPointChange =(date, dateString)=>{
        let iotProjectId = localStorage.getItem('iotProjectId')
        var startDatetime = new Date(moment(dateString[0]).format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment(dateString[1]).format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        if(endDatetime - startDatetime > 31*24*60*60*1000){
            message.warn('时间选择不能超过31天');
            return;
        }
        this.setState({btn1: ''})
        //总设备数
        this.props.dispatch({
            type: 'projectDetail/getTotalPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total',
                iotProjectId
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'projectDetail/getAddPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added',
                iotProjectId
            }
        });
    }
    timePresetSelect = (val) => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        this.setState({btn: val})
        let { form: {setFieldsValue}, timePreset} = this.props;
        // 快速搜索运单号进来，日期会清空
        setFieldsValue({time: [moment().subtract(parseInt(val, 10), 'days'), moment().add(0, 'days')]});
        var  startDatetime= new Date(moment().subtract(parseInt(val, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        
        //总设备数
        this.props.dispatch({
            type: 'projectDetail/getTotalDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total',
                iotProjectId
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'projectDetail/getAddDeviceCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added',
                iotProjectId
            }
        });
    }
    timePresetSelect1 = (val) => {
        // this.myChart && this.myChart.clear();
        // this.myChart1 && this.myChart1.clear();
        let iotProjectId = localStorage.getItem('iotProjectId')
        this.setState({btn1: val})
        let { form: {setFieldsValue}, timePreset} = this.props;
        // 快速搜索运单号进来，日期会清空
        setFieldsValue({time1: [moment().subtract(parseInt(val, 10), 'days'), moment().add(0, 'days')]});
        var  startDatetime= new Date(moment().subtract(parseInt(val, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()
        var endDatetime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime() + 86400000
        
        //总设备数
        this.props.dispatch({
            type: 'projectDetail/getTotalPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'total',
                iotProjectId
            }
        });
        //新增设备数
        this.props.dispatch({
            type: 'projectDetail/getAddPointCounts',
            payload:{
                endDatetime:endDatetime,
                startDatetime:startDatetime,
                type:'added',
                iotProjectId
            }
        });
    }

    appsecret = () => {
        this.setState({
            appsecretModal: true
        })
    }

    callbackAddress = () => {
        this.props.dispatch({
            type: 'projectDetail/updateState',
            payload: {
                addressModal: true
            }
        });
        this.props.dispatch({
            type: 'projectDetail/getCallbackAddress',
            payload: {

            }
        })
    }

    modalCancel = () => {
        this.setState({
            appsecretModal: false,
        })
        this.props.dispatch({
            type: 'projectDetail/updateState',
            payload: {appSecret: ''}
        })
    }

    getAppSecret = (value) => {
        this.props.dispatch({
            type: 'projectDetail/getAppSecret',
            payload: value
        })
    }

    render() {
        let menusConfig = getRouterConfig();
        let menus = Object.keys(menusConfig);

        const {projectDetail, dispatch,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {queryData,
            statusData,
            iotProjectId,
            devicesData,
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
            detailData,
            appSecret,
            callbackAddress,
            addressModal
        } = projectDetail;
        const data = queryData || {}
        const { btn, btn1, appsecretModal } = this.state;

        let allPointCounts = 0;
        if(data.totalPointCounts > 100000000){
            allPointCounts = lodash.ceil(data.totalPointCounts / 100000000,2) +'亿+';
        }else if(data.totalPointCounts > 10000){
            allPointCounts = lodash.ceil(data.totalPointCounts / 10000,0) +'万+';
        } else {
            allPointCounts = data.totalPointCounts
        }

        const appsecretModalProps = {
            data: appSecret || '',
            onCancel: this.modalCancel,
            getAppSecret: this.getAppSecret,
            dispatch
        }

        const addressModalProps = {
            data: callbackAddress,
            dispatch,
        }

        return (
            <div>
                {appsecretModal ? <AppsecretrModal {...appsecretModalProps}/> : ''}
                {addressModal ? <AddressModal {...addressModalProps}/> : ''}
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>项目概况</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={styles.container}>
                    <div className={styles.deviceDetail}>
                        <div  className={styles.titleWrap}>
                            <div>
                                <img  src={detailData.imageUrl !=="" ? imageUrl+detailData.imageUrl : require('../../../assets/image/project/project.png')} style={{width:80,height:80,}}/>
                            </div>
                            <div className={styles.project}>
                                <p>{detailData.projectName}</p>
                                <Row>
                                    <Form>
                                        <Col span={24}>
                                            <FormItem {...formLayout}>
                                                <span className={styles.title}><span>{detailData.description || ''}</span></span>
                                            </FormItem>
                                        </Col>
                                        {/* <Col  span={8}>
                                            <FormItem {...formLayout}>
                                            <span className={styles.title}>在线：<span>{detailData.onlineTotal || '0'}</span></span>
                                            </FormItem>
                                        </Col>
                                        <Col  span={8}>
                                            <FormItem {...formLayout}>
                                            <span className={styles.title}>离线：<span>{detailData.offlineTotal || '0'}</span></span>
                                            </FormItem>
                                        </Col> */}
                                    </Form>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <Form>
                        <Row type="flex" justify="start" style={{lineHeight:'40px'}}>
                            <Col>
                                创建人：<span  className={styles.spanTitle} 
                                title={detailData.createOperator || ''}
                                >
                                    {detailData.createOperator || ''}  
                                </span>
                            </Col>
                            <Col style={{textAlign: 'center'}} span={1}><span>|</span></Col>
                            {/* <Col span={4}>
                                <FormItem {...formLayout1}>
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span><span style={{color:'#666'}}>用户名：</span>{detailData.username || ''}</span>
                                    )}
                                </FormItem>
                            </Col> */}
                            <Col>
                                <FormItem {...formLayout1}>
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span><span style={{color:'#666'}}>创建时间：</span>{ detailData.inputDate ? getLocalTimeF(detailData.inputDate) : ''}</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col style={{textAlign: 'center'}} span={1}><span>|</span></Col>
                            <Col>
                                所属企业：<span className={styles.spanTitle} title={detailData.companyName || ''}>{detailData.companyName || ''}</span>
                            </Col>
                            <Col style={{textAlign: 'center'}} span={1}><span>|</span></Col>
                            {(detailData.clientId) ? 
                                <Col>
                                    AppKey:<span className={styles.spanTitle}>{detailData.clientId}</span>
                                </Col> : ('')
                            }
                            {(detailData.clientId) ? 
                                <Col style={{textAlign: 'center'}} span={1}><span>|</span></Col> : ('')
                            }
                            <Col>
                                <span className={styles.spanClick} onClick={this.appsecret}>获取AppSecret</span>
                            </Col>
                            <Col style={{textAlign: 'center'}} span={1}><span>|</span></Col>
                            <Col>
                                <span className={styles.spanClick} onClick={this.callbackAddress}>事件回调地址</span>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles2.container}>
                    <div className={styles2.con}>
                        <Row className={styles2.headWrap}>
                            <Col span={6} className={styles2.titleIcon}>
                                <div className={styles2.titleImg}>
                                    <div className = {styles2.circle2}>
                                        <img  src={require('../../../assets/image/index/2.png')}/>
                                    </div>
                                </div>
                                <div className={styles2.conl}>
                                    <p className={styles2.countTitle}> 设备类型数(个)</p>
                                    <p className={styles2.count}>{data.deviceTypeCounts || '0'}</p>
                                </div>
                                
                            </Col>
                            <Col span={6} className={styles2.titleIcon}>
                                <div className={styles2.titleImg}>
                                    <div className = {styles2.circle3}>
                                        <img  src={require('../../../assets/image/index/3.png')}/>
                                    </div>
                                </div>
                                <div className={styles2.conl}>
                                    <p className={styles2.countTitle}> 接入设备总数(台)</p>
                                    <p className={styles2.count}>{data.deviceCounts || '0'}</p>
                                </div>
                                
                            </Col>
                            <Col span={6} className={styles2.titleIcon}>
                                <div className={styles2.titleImg}>
                                    <div className = {styles2.circle1}>
                                        <img  src={require('../../../assets/image/index/1.png')}/>
                                    </div>
                                </div>
                                <div className={styles2.conl}>
                                    <p className={styles2.countTitle}> 在线设备数(台)</p>
                                    <p className={styles2.count}>{data.onlineDeviceCounts || '0'}</p>
                                </div>
                            </Col>
                            <Col span={6} className={styles2.titleIcon}>
                                <div className={styles2.titleImg}>
                                    <div className = {styles2.circle4}>
                                        <img  src={require('../../../assets/image/index/4.png')}/>
                                    </div>
                                </div>
                                <div className={styles2.conl}>
                                    <p className={styles2.countTitle}> 数据点数(条)</p>
                                    <p className={styles2.count}>{allPointCounts || '0'}</p>
                                    <p className={styles2.f4}>今日新增:<span>{data.addedTodayPointCounts || 0}</span>条</p>
                                </div>
                                
                            </Col>
                        </Row>
                        <Row className={styles2.title}>
                            <Col span={24}>
                                设备趋势
                            </Col>
                        </Row>
                        <Row className={styles2.tendence}>
                        
                            <Col span={24}>
                                <Form>
                                    <FormItem>
                                    <div className={styles2.date}> 
                                        {
                                            timePresetData.map((v, i) => <a key={v.val}  className={btn == v.val? styles2.btnChoosed : styles2.btn} onClick={() => {
                                                this.timePresetSelect(v.val);
                                            }}>{v.text}</a>)
                                        }
                                        {/* <a className={styles2.btn} onClick={this.setDate}>本周</a>
                                        <a className={styles2.btn}>本月</a>
                                        <Button type="default">本月</Button> */}
                                        <span>时间:</span>
        
                                                {getFieldDecorator('time', {
                                                    initialValue: [moment().subtract(parseInt(29, 10), 'days'),moment().add(0, 'days'), ]
                                                })(
                                                    <RangePicker onChange={this.onChange} size="default" ranges={{
                                                        '今天': [moment(), moment()],
                                                        '本月': [moment().startOf('month'), moment().endOf('month')]
                                                    }} format={'YYYY-MM-DD'} placeholder={['开始', '截止']}/>
                                                )}
                                        
                                    </div>
                                    </FormItem>
                                </Form>
                                <div id='mainContainer' style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {/* <div id="main" style={{ width: '100%', height: 400 }}></div> */}
                                </div>
                            </Col>
                        </Row>
                        <Row className={styles2.title}>
                            <Col span={24}>
                                数据点上传趋势分析
                            </Col>
                        </Row>
                        <Row className={styles2.tendence}>
                            <Col span={24}>
                                <Form>
                                    <FormItem>
                                    <div className={styles2.date}> 
                                        {
                                            timePresetData.map((v, i) => <a key={v.val}  className={btn1 == v.val? styles2.btnChoosed : styles2.btn} onClick={() => {
                                                this.timePresetSelect1(v.val);
                                            }}>{v.text}</a>)
                                        }
                                        {/* <a className={styles2.btn} onClick={this.setDate}>本周</a>
                                        <a className={styles2.btn}>本月</a>
                                        <Button type="default">本月</Button> */}
                                        <span>时间:</span>
        
                                                {getFieldDecorator('time1', {
                                                    initialValue: [moment().subtract(parseInt(29, 10), 'days'),moment().add(0, 'days'),]
                                                })(
                                                    <RangePicker  onChange={this.onPointChange} size="default" ranges={{
                                                        '今天': [moment(), moment()],
                                                        '本月': [moment().startOf('month'), moment().endOf('month')]
                                                    }} format={'YYYY-MM-DD'} placeholder={['开始', '截止']}/>
                                                )}
                                        
                                    </div>
                                    </FormItem>
                                </Form>
                                <div id="mainContainer1" style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {/* <div id="main1" style={{ width: '100%', height: 400 }}></div> */}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        ); 
    }



    componentDidMount() {
        this.componentDidUpdate()
    }

    componentWillUnmount() {

    }
}

export default connect(({ projectDetail }) => ({ projectDetail }))(Form.create()(ProjectDetail));
