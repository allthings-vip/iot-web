import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {Icon, Input, Button ,Row, Col,Breadcrumb,DatePicker,Form,Select,Checkbox    } from 'antd';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../../utils/time';
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
import {weekDays, oneMonthDays, threeMonthDays} from '../../../utils/time';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 5
    }
}
const formLayout1 = {
    labelCol: {
        span:4
    },
    wrapperCol: {
        span: 20
    },
    style: {
        marginBottom: 5
    }
}

class DataShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                startDatetime:'',
                endDatetime:'',
                deviceCode:'',
                selFactors:[],
                startValue: moment().subtract(parseInt(30, 10), 'days'),
                endValue: moment().subtract(parseInt(0, 10), 'days'),
                endOpen: false,
        }
    }
    componentDidUpdate() { 
        const {list,factors} = this.props.datashow;
        const {selFactors} = this.state;
        (selFactors || []).forEach((v)=>{
            let listData  =  list.filter((item) => item.factorCode === v).length>0 ? list.filter((item) => item.factorCode === v)[0] : {}
            let myAnalyse = echarts.init(document.getElementById('analyse'+v));
            let  option = {
                background:'rgba(240,244,250,0.40)',
                grid: {
                    // top: '8%',
                    left: '2%',
                    right: '6%',
                    bottom: '6%'
                },
                tooltip: {
                    trigger: 'axis'
                },
                title : {
                    text: (factors || []).filter((item)=>item.factorCode === v).length>0 ?
                    (factors || []).filter((item)=>item.factorCode === v)[0].factorName : '',
                    subtext: '',
                    x:'center',
                },
                // legend: {
                //     x:'left',
                //     data: (v.data || []).map(v=>{
                //         return v.value
                //     }),
                //     itemWidth:20,
                //     itemHeight:20,
                //     backgroundColor:'#fff',
                //     textStyle:{
                //         fontSize:16
                //     }
                // },
                xAxis: [
                    {
                        type: 'category',
                        data: (listData.data || []).map(v=>{
                            return getLocalTimeF(v.inputDate)
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
                        name: '总数据',
                        type: 'line',
                        smooth: true,
                        data: (listData.data || []).map(v=>{
                            return  v.value
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
                    }
                ]
            };
            myAnalyse&&myAnalyse.setOption(option);
            
        })

    }
    onClean = () => {
        this.props.form.setFieldsValue({
            deviceCode: '',
            Datetime:''
        });
        this.props.dispatch({
            type:'datashow/updateState',
            payload:{
                factors:[]
            }
        })
    }
    handleSubmit = () => {
        const {form } = this.props;
        this.props.dispatch({
            type:'datashow/updateState',
            payload:{
                factors:[],
            }
        })
        this.setState({
            selFactors:[]
        })
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            this.setState ({
                deviceCode:fieldsValue.deviceCode || []
            })
            var startDatetime = fieldsValue.startDatetime ? getStampTime(fieldsValue.startDatetime) :''
            var endDatetime = fieldsValue.endDatetime ? getStampTime(fieldsValue.endDatetime) :''
            this.setState({
                startDatetime:startDatetime,
                endDatetime:endDatetime
            })
            this.props.dispatch({
                type:'datashow/queryFactors',
                payload:{
                    deviceCode: fieldsValue.deviceCode || '',
                    // pageSize: Page.pageSize,
                    // pageIndex: Page.pageIndex,
                }
            })
        })
    }
    onTimeChange = (date, dateString) => {
        this.props.dispatch({
            type:'datashow/updateState',
            payload:{
                factors:[],
            }
        })
        this.setState({
            selFactors:[]
        })
        var startDatetime = fieldsValue.startDatetime ? getStampTime(fieldsValue.startDatetime) :''
        var endDatetime = fieldsValue.endDatetime ? getStampTime(fieldsValue.endDatetime) :''
        this.setState({
            startDatetime:startDatetime,
            endDatetime:endDatetime
        })
    }
    onChange = (item) => {
        console.log('item',item)
        this.setState({
            selFactors: (item || []).sort()
        })
        console.log('selFactors',(item || []).sort(function(a,b){
            return a - b
        }));
        if(item&&item.length>0){
            this.props.dispatch({
                type:'datashow/query',
                payload:{
                    deviceCode: this.state.selFactors || [],
                    factorCodes: item || [],
                    startDatetime:this.state.startDatetime,
                    endDatetime:this.state.endDatetime
                }
            })
        }
    }
    onInputChange = () => {
        this.props.dispatch({
            type:'datashow/updateState',
            payload:{
                factors:[],
            }
        })
        this.setState({
            selFactors:[]
        })
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
    }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        //current> moment().endOf('day') ||  current < moment().add(parseInt(weekDays, 10), 'days')
        return endValue <= startValue || endValue >=moment(startValue).add('days',30);
    }
    onTimeFChange = (field, value) => {
        this.setState({
          [field]: value,
        });
      }
    onStartChange = (value) => {
        this.onTimeFChange('startValue', value);
        this.onTimeFChange('endValue', '');
    }

    onEndChange = (value) => {
        this.onTimeFChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    render() {
        const {datashow, dispatch,
            form: {
            getFieldDecorator
            }
        } = this.props;
        let {factors,list} = datashow;
        const { startValue, endValue, endOpen,selFactors} = this.state;
        let factorList = (factors || []).sort(function(a,b){
            if(a.factorCode > b.factorCode){
                return 1
            } else if(a.factorCode == b.factorCode) {
                return 0
            } else {
                return -1
            }
        });
        console.log('factors',factorList)
        // let selectFactors = (selFactors || []).sort(function(a,b){
        //     return a - b
        // });
        //const factors = [];
        const chkOptions = (factors || []).map(v=>{
            return {
                label: v.factorName,
                value: v.factorCode
            }
            //return <Checkbox value={v.factorCode} key={v.factorCode}>{v.factorName}</Checkbox>
        })
        function disabledDate(current) {
            // Can not select days before today and today
        
            return  !(current > moment().startOf('month')&&current <moment().endOf('month'))
        }
        return (
            <div>
                {/* <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>数据查看</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div className={styles.container}>
                    <Form  className={styles.search}>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <FormItem {...formLayout} label="设备编码">
                                    {getFieldDecorator('deviceCode', {
                                        initialValue: '',
                                        rules: [{required: true, message: '请输入完整设备编码'}]
                                    })(
                                        <Input placeholder="请输入完整设备编码" onChange={this.onInputChange}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formLayout1} label="时间" className={styles.dateName}>
                                    <Row>
                                        <Col span={10}>
                                        {getFieldDecorator('startDatetime', {
                                            initialValue: startValue,
                                            rules: [{required: true, message: '请选择要查询的时间'}]
                                            })(
                                                <DatePicker
                                                    disabledDate={this.disabledStartDate}
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    value={startValue}
                                                    placeholder="开始时间"
                                                    onChange={this.onStartChange}
                                                    onOpenChange={this.handleStartOpenChange}
                                                />
                                            )} 
                                            
                                        </Col>
                                        <Col span={1}>~</Col>
                                        <Col span={10}>
                                            {getFieldDecorator('endDatetime', {
                                                initialValue: endValue,
                                                rules: [{required: true, message: '请选择要查询的时间'}]
                                                })(
                                                    <DatePicker
                                                        disabledDate={this.disabledEndDate}
                                                        showTime
                                                        format="YYYY-MM-DD HH:mm:ss"
                                                        value={endValue}
                                                        placeholder="结束时间"
                                                        onChange={this.onEndChange}
                                                        open={endOpen}
                                                        onOpenChange={this.handleEndOpenChange}
                                                    />
                                            )} 
                                            
                                        </Col>
                                    </Row>
                                    {/* {getFieldDecorator('Datetime', {
                                        initialValue: '',
                                        rules: [{required: true, message: '请选择要查询的时间'}]
                                    })(
                                        <RangePicker  
                                            disabledDate={disabledDate}
                                            onChange={this.onTimeChange} 
                                            size="default" 
                                            ranges={{
                                                '今天': [moment(), moment()],
                                                '本月': [moment().startOf('month'), moment().endOf('month')]
                                            }} 
                                            format={'YYYY-MM-DD HH:mm:ss'} 
                                            placeholder={['开始', '截止']}
                                            showTime={{
                                                hideDisabledOptions: true,
                                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                            }}/>
                                    )} */}
                                </FormItem>
                            </Col>
                            
                            <Col span={5} key='button' style={{textAlign: 'center'}}>
                                <FormItem {...formLayout1}>
                                    <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
                                    <Button type="default" style={{marginLeft: 5}}
                                        onClick={this.onClean}>清除</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            factors.length>0 ?
                            <Row>
                                <Col>
                                        <Checkbox.Group onChange={this.onChange.bind(this)} options={chkOptions}>

                                        </Checkbox.Group>
                                </Col>
                            </Row> :''
                        }
                        
                    </Form>
                    
                </div>
                {
                    selFactors.length>0 ?
                    <div className={styles.list} >
                        {
                            (selFactors || []).map((v,index)=>{
                                return <div className={styles.chart}>
                                <div id={"analyse"+v} style={{ width: '100%', height: 400,marginTop:'40px' }}></div>
                            </div>
                            })
                        }
                    </div> : ''
                }
               
            </div>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export default connect(({ datashow }) => ({ datashow }))(Form.create()(DataShow));
