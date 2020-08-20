import { Table,Button, Row, Col, Form, Tabs, 
    Input, Modal, Timeline, Icon,DatePicker ,Select,message} from 'antd';
import styles from './Detail.less';
import React, {Component} from 'react';
import moment from 'moment';
import BMap from 'BMap';
import { getLocalTimeF } from '../../../utils/time';
import {Page} from '../../../utils/constant';
import lodash from 'lodash';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const endDates = moment();
const startDates = moment().clone().set({hour:0,minute:0});
const formLayout ={
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 22
    },
    style: {
        marginBottom: 10
    }
}
class DeviceLog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            startDate:startDates.valueOf(),
            endDate:endDates.valueOf()
        }
    }
    componentDidMount() {

    }
    onRangeChange = (value, dateString) =>{

    }
    onSubmit = () => {
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            
            if (errors) {
                return;
            } else {
                this.setState({
                    startDate:fieldsValue['time'][0].valueOf(),
                    endDate:fieldsValue['time'][1].valueOf()
                })
                const beginTime = fieldsValue['time'][0];
                const endTime = fieldsValue['time'][1];
                if(endTime.valueOf() - beginTime.valueOf() > 3*24*60*60*1000){
                    message.warn('时间选择不能超过3天');
                    return;
                }
                this.props.dispatch({
                    type: 'device/updateState',
                    payload: {
                        logPageIndex: Page.pageIndex,
                        logPageSize: Page.pageSize,
                        logStarttime: fieldsValue['time'][0].valueOf(),
                        logEndtime: fieldsValue['time'][1].valueOf()
                    }
                })
                this.props.dispatch({
                    type:'device/querylogs',
                    payload:{
                        startTime: fieldsValue['time'][0].valueOf(),
                        endTime:fieldsValue['time'][1].valueOf()
                    }
                })
            }
        })
        
    }
    render() {
        const children = [];
        for (let i = 10; i < 20; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
        }
        const {alarm, dispatch,
            form: {
            getFieldDecorator,
            setFieldsValue
        }} = this.props;
        const {loading,logList,logTotal,logPageSize,logPageIndex,logEndtime,logStarttime} = this.props;
        let that = this;
        const isloading = loading.effects['device/querylogs'];
        const pagination = {
            total: logTotal,
            current: logPageIndex,
            defaultCurrent: logPageIndex,
            pageSize: logPageSize,
            onChange: setPage,
            onShowSizeChange:onShowSizeChange,
            showQuickJumper:true,
            showSizeChanger:true,
            showTotal:showTotal
        }
        function onShowSizeChange(current, pageSize){
            dispatch({
                type: 'device/updateState',
                payload:{
                    logPageIndex:current,
                    logPageSize:pageSize,
                }
            });
            dispatch({
                type:'device/querylogs',
                payload:{
                    disposeStatus:'',
                    // logPageIndex:current,
                    // logPageSize:pageSize,
                    endTime:logEndtime,
                    startTime:logStarttime,
                }
            })
        }
        function setPage(page){
            dispatch({
                type: 'device/updateState',
                payload:{
                    logPageIndex:page,
                    logPageSize:logPageSize,
                }
            });
            dispatch({
                type:'device/querylogs',
                payload:{
                    // logPageIndex:page,
                    // logPageSize:logPageSize,
                    endTime:logEndtime,
                    startTime:logStarttime,
                }
            })
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const dataSource = logList;
        const columns = [{
            title: '发生时间',
            dataIndex: 'inputDate',
            render: (text, record) => {
                    return record.loggerTime ? getLocalTimeF(record.loggerTime) :''
                }
            }, {
                title: '用户名',
                dataIndex: 'userName',
            }, {
                title: '日志类型',
                dataIndex: 'loggerTypeName',
            },{
                title: '日志内容',
                width:'30%',
                dataIndex: 'loggerContent',
                render:(text,record)=>{
                    return JSON.stringify(text || '')
                }
            }
        ];
        return(
            <div className={styles.deviceLog}>
                <div>
                    <Form>
                        <Row className={styles.search}>
                            <Col span={10}>
                                <FormItem {...formLayout} label="时间">
                                    {getFieldDecorator('time',{
                                        initialValue:[moment(logStarttime),moment(logEndtime)]
                                    }
                                    )(
                                        <RangePicker  
                                            showTime={{ format: 'HH:mm' }}
                                            size="default" 
                                            onChange={this.onRangeChange.bind(this)}
                                            format={'YYYY-MM-DD HH:mm'} placeholder={['开始', '截止']}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem  {...formLayout}>
                                    <Button type="primary" ghost style={{marginLeft:'20px'}} onClick={this.onSubmit}>查询</Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Table 
                                loading={isloading}
                                dataSource={dataSource} 
                                pagination={pagination}
                                columns={columns} />
                        </Row>
                    </Form>
                </div>
              
            </div>
        )
    }
}
export default Form.create()(DeviceLog)