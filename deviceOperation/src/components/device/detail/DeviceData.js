import { Spin,Button, Row, Col, Form, Tabs, Input, Modal,Checkbox, Timeline, Icon ,DatePicker,Select, message } from 'antd';
import styles from './Detail.less';
import React, {Component} from 'react';
import moment from 'moment';
import BMap from 'BMap';
import { getLocalTimeF } from '../../../utils/time';
import lodash from 'lodash';
import NullResult from '../../NullResult';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
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
let startDatetime = '';
let endDatetime = '';
let key = '';
const formLayout ={
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 20
    },
    style: {
        marginBottom: 0
    }
}
class DeviceData extends Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    componentDidUpdate() {
        const {factorsList,kvspoints,chartList,deviceCode,factorCodes,dispatch,factorName } = this.props;
        console.log('factorslist', factorsList)
        if ( factorsList && factorsList.length>0){

            //取出选中因子的列表
            let factorCodes= kvspoints.map(item => item.factorCode);
            let selectedFactors = kvspoints.filter(item => factorsList.includes(item.factorCode));
            // data不为空的索引值
            let factorIndex = 0
            selectedFactors.some((item,index) => {
                if (item.data.length) {
                    factorIndex = index;
                    return true
                }
            })
            let factorsListName = selectedFactors.map(item => item.factorName)
            console.log('selectedfactors', selectedFactors)

            // let add=kvspoints.filter(item=>factorsList.some(ele=>ele===item.factorCode))
            // console.log('1231',add)
            let inputDateList = selectedFactors.length>0 ? (selectedFactors[factorIndex].data ||[]).map(v=>{
                return v.inputDate ? getLocalTimeF(v.inputDate) : ''
            }) : [];
            let param = selectedFactors.some(item => {
                return item.data.length
            })
            // data都为空时不初始化图表
            if(!param) {
                return;
            }

            this.myAnalyse = echarts.init(document.getElementById('analyse'));
            
            // 折线颜色
            const colorArray = ['rgba(255 99 71)','rgba(139 69 19)', 'rgba(65 105 225)', 'rgba(0 205 0)', 'rgba(0 205 0)', 'rgba(189 183 107)', 'rgba(105 105 105)']
            //动态设置series
            let seriesData = (selectedFactors|| []).map((v,index)=>{
                return {
                    name: v.factorName,
                    type: 'line',
                    smooth: true,
                    data: (v.data || []).map(item=>{
                        return item.value
                    }),
                    symbol: 'circle',
                    symbolSize: 10, 
                    color: colorArray[index] || 'rgba(139 0 139)',
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
                    yAxisIndex: index
                }
            })

            //动态设置Y轴
            let yAxisData = (selectedFactors|| []).map((v,index)=>{
                return  {
                    name: '',
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
                        show:selectedFactors.length==1 ? true : false,
                    },
                    splitLine: { 
                        show: true,  // Y轴的横线显示
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                }
            })
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            let  option1 = {
                color:colors,
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
                    x:'center',
                    data: factorsListName || [],
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
                        data: inputDateList,
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
                yAxis: yAxisData || [],
                series: seriesData || []
                
            };
            console.log('seriesdata',seriesData)
            this.myAnalyse.setOption(option1);
        }
    }
    submit = () => {
        let {form,dispatch} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            dispatch({
                type:'device/updateState',
                payload:{
                    factorsList:[]
                    }
            })
            
            key=Math.random();
            const beginTime = fieldsValue.time[0];
            const endTime = fieldsValue.time[1];
            if(endTime.valueOf() - beginTime.valueOf() > 31*24*60*60*1000){
                message.warn('时间选择不能超过31天');
                return;
            }
            fieldsValue.startDatetime = fieldsValue.time[0].valueOf();
            fieldsValue.endDatetime =  fieldsValue.time[1].valueOf();
            fieldsValue.factorCodes = (fieldsValue.factorCodes || []).map(v=>{
                return v.key
            })
            delete fieldsValue.time;
            startDatetime =  fieldsValue.startDatetime;
            endDatetime = fieldsValue.endDatetime;
            dispatch({
                type:'device/querykvsPoints',
                payload:fieldsValue,
            })
            
        })
    }
    onCkChange = (item) =>{
        this.myAnalyse && this.myAnalyse.clear()
        this.props.dispatch({
            type:'device/updateState',
            payload:{
                factorsList:item || [],
            }
        })
    }
    render() {
        let {loading,latestPoints,factors,kvspoints,factorsList} = this.props;
        const isloading = loading.effects['device/queryPointsLatest'];
        const isloading1 = loading.effects['device/querykvsPoints'];
        const {dispatch,
            form: {
            getFieldDecorator
            }
        } = this.props;
        const chkOptions = (kvspoints || []).map(v=>{
            return {
                label: v.factorName,
                value: v.factorCode,
            }
            //return <Checkbox value={v.factorCode} key={v.factorCode}>{v.factorName}</Checkbox>
        })

        const selectedFactors = kvspoints.filter(item => factorsList.includes(item.factorCode));
        let param = selectedFactors.some(item => {
            return item.data.length
        })
        return(
            <div  className={styles.deviceData}>
              <p className={styles.title}>实时数据</p>
                {/* <Spin tip="加载中..." spinning={isloading}> */}
                    {
                        latestPoints.length>0 ? <Row type="flex" style={{padding: '10px 0'}}>
                        {(latestPoints || []).map(v=>{
                            return <Col span={12}>
                                    <Row className={styles.item}>
                                        <Col span={5} title={v.factorName || ''} style={{textAlign: 'right'}}>{v.factorName || ''}</Col>
                                        <Col span={7} title={v.value || ''} style={{textAlign: 'center'}}>{v.value || '-'}{v.unit_symbol || ''}</Col>
                                        <Col span={12} title={getLocalTimeF(v.inputDate || '')} style={{textAlign: 'left'}}>{getLocalTimeF(v.inputDate || '')}</Col>
                                    </Row>
                                </Col>
                        })} </Row> : <NullResult />
                    }
                {/* </Spin> */}
              <p className={styles.title}>历史数据</p>
              <div className={styles.historyData}>
                    <div className={styles.search}>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem label="时间" {...formLayout}>
                                {getFieldDecorator('time', {
                                    initialValue: [],
                                    rules: [{required: true, message: '请选择要查询的时间'}]
                                    })(
                                        <RangePicker  
                                        size="default" 
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始', '截止']}/>
                                    )
                                }
                                </FormItem>
                            </Col>
                            <Col span={10} offset={2}>
                                <FormItem label="因子" {...formLayout}>
                                {getFieldDecorator('factorCodes', {
                                    initialValue: [],
                                    rules: [{required: true, message: '请选择因子'}]
                                    })(
                                        <Select
                                           
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="请选择因子"
                                            optionFilterProp="children"
                                            showSearch={true} 
                                            allowClear={true}
                                            labelInValue
                                        >
                                            {(factors || []).map(v=>{
                                                return <Option value={v.factorCode}> {v.factorName}</Option>
                                            })}
                                        </Select>
                                    )
                                }
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem  {...formLayout}>
                                    <Button type="primary" ghost style={{marginLeft:'20px'}}onClick={this.submit.bind(this)}>查询</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'8px'}}>
                            <Col span={8}>
                                {/* <Spin tip="加载中..." spinning={isloading1}> */}
                                    <Row>
                                        <Col span={4}>
                                        </Col>
                                        <Col span={20}>
                                        <Checkbox.Group 
                                            key={key}
                                            onChange={this.onCkChange.bind(this)} 
                                            value={factorsList || []}
                                            options={chkOptions}>
                                        </Checkbox.Group>
                                        </Col>
                                    </Row>
                                {/* </Spin> */}
                            </Col>
                        </Row>
                    </Form>
                    </div>
                    <Spin spinning={!!isloading1}>
                    {
                        factorsList.length>0 && param ? <div className={styles.chart}>
                            <div id="analyse" style={{ width: '100%', height:500 }}></div>
                        </div>
                        :
                        <NullResult/>
                    }
                    </Spin>
              </div>
            </div>
        )
    }
}
export default Form.create()(DeviceData)