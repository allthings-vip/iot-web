import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Form,DatePicker  } from 'antd';
import { getStampTime,getLocalTime, getLocalTimeF } from '../../../utils/time';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import { Page} from '../../../utils/constant';
import {weekDays, oneMonthDays, threeMonthDays} from '../../../utils/time';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 0
    }
}
const formLayout1 = {
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
class Log extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            startDatetime:'',
            endDatetime:'',
            startValue: null,
            endValue: null,
            endOpen: false,
            deviceCode:''
        }
    }
    onClean = () => {
        this.props.form.setFieldsValue({
            deviceCode: '',
            Datetime:''
        });
    }
        
    handleSubmit = () => {
        const {form } = this.props;
        // const {startDatetime,endDatetime} = this.state;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            var startDatetime = fieldsValue.startDatetime ? getStampTime(fieldsValue.startDatetime) :''
            var endDatetime = fieldsValue.endDatetime ? getStampTime(fieldsValue.endDatetime) :''
            // let endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
            // let startTime =new Date(moment().subtract(parseInt(weekDays, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime();
            this.props.dispatch({
                type:'log/query',
                payload:{
                    deviceCode: fieldsValue.deviceCode || '',
                    pageSize: Page.pageSize,
                    pageIndex: Page.pageIndex,
                    endDatetime:endDatetime,
                    startDatetime:startDatetime,
                }
            })
            this.setState({
                    deviceCode: fieldsValue.deviceCode || '',
                    endDatetime:endDatetime,
                    startDatetime:startDatetime,
            })
        })
    }
    // onChange =(date, dateString)=>{
    //     console.log(dateString)
    //     var startDatetime = dateString[0] ? getStampTime(dateString[0]) :''
    //     var endDatetime = dateString[1] ? getStampTime(dateString[1]) :''
    //     this.setState({
    //         startDatetime:startDatetime,
    //         endDatetime:endDatetime
    //     })
    // }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        // if (!startValue || !endValue) {
        //   return false;
        // }
        // return startValue.valueOf() > endValue.valueOf();
      }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        //current> moment().endOf('day') ||  current < moment().add(parseInt(weekDays, 10), 'days')
        console.log(moment(startValue.valueOf()).add('days',7).valueOf())
        return endValue <= startValue || endValue >=moment(startValue).add('days',7);
    }
    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
      }
    
      onStartChange = (value) => {
        this.onChange('startValue', value);
        this.onChange('endValue', '');
      }
    
      onEndChange = (value) => {
        this.onChange('endValue', value);
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
        const {log, dispatch,
            form:{
                getFieldDecorator,
            }
            } = this.props;
        const {deviceCode,endDatetime,startDatetime}= this.state;
        const {list,total,pageSize,pageIndex} = log;
        const pagination = {
            total: total,
            current: pageIndex,
            defaultCurrent: pageIndex,
            pageSize: pageSize,
            onChange: setPage,
            onShowSizeChange:onShowSizeChange,
            showQuickJumper:true,
            showSizeChanger:true,
            showTotal:showTotal
        }
        function onShowSizeChange(current, pageSize){
            dispatch({
                type: 'log/query',
                payload:{
                    deviceCode: deviceCode,
                    endDatetime: endDatetime,
                    startDatetime: startDatetime,
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'log/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            console.log(this.state);
            dispatch({
                type: 'log/query',
                payload:{
                    deviceCode: deviceCode,
                    endDatetime: endDatetime,
                    startDatetime: startDatetime,
                    pageIndex: page,
                    pageSize: pageSize,
                }
            });
            dispatch({
                type: 'log/updateState',
                payload:{
                    pageIndex: page,
                    pageSize: pageSize,
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        // function range(start, end) {
        //     const result = [];
        //     for (let i = start; i < end; i++) {
        //       result.push(i);
        //     }
        //     return result;
        // }
          
        function disabledDate(current) {
            // Can not select days before today and today
            return current> moment().endOf('day') ||  current < moment().subtract(parseInt(weekDays, 10), 'days')
        }
        const columns = [{
                title: '操作时间',
                dataIndex: 'inputDate',
                width:'20%',
                render: (text, record) => {
                    return record.inputDate ? getLocalTimeF(record.inputDate) : ''
                }
            }, {
                title: '用户名',
                width:'10%',
                dataIndex: 'username',
            }, {
                title: '日志类型',
                width:'10%',
                dataIndex: 'logType',
            },{
                title: '操作日志',
                width:'60%',
                dataIndex: 'logContent',
               
            }
        ];
        const dataSource= list;        
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div>
                {/* <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>设备日志</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div className={styles.container}>
                    <Form  className={styles.search}>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <FormItem {...formLayout} label="设备编码">
                                    {getFieldDecorator('deviceCode', {
                                        initialValue: '',
                                        rules: [{required:true,message:'请输入完整设备编码'}]
                                    })(
                                        <Input placeholder="请输入完整设备编码"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem {...formLayout1} label="时间"  className={styles.dateName}>
                                    <Row>
                                        <Col span={10}>
                                        {getFieldDecorator('startDatetime', {
                                            initialValue: moment().subtract(parseInt(1, 10), 'days'),
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
                                                initialValue: moment().add(0, 'days'),
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
                                        
                                      
                                       
                                    
                                      {/* <RangePicker onChange={this.onChange}  size="default" 
                                        disabledDate={disabledDate}
                                        ranges={{
                                            '今天': [moment(), moment()],
                                        }} 
                                        format={'YYYY-MM-DD HH:mm:ss'} 
                                        placeholder={['开始', '截止']}
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                        }}/> */}
                                </FormItem>
                            </Col>
                                                                        
                            <Col span={5} key='button'>
                                <FormItem {...formLayout}>
                                    <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>查询</Button>
                                    <Button type="default" style={{marginLeft: 5}}
                                        onClick={this.onClean}>清除</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.container}>
                    <div className={styles.list}>
                        <Table dataSource={dataSource} columns={columns} style={{textAlign:'center'}} pagination={pagination}/>
                    </div>

                </div>
            </div>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export default connect(({ log }) => ({ log }))(Form.create()(Log));
