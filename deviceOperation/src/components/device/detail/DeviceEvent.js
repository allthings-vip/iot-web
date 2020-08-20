import { Table,Button, Row, Col, Form, 
    Tabs, Input, Modal, Timeline, Icon,DatePicker ,Select,message} from 'antd';
import styles from './Detail.less';
import React, {Component} from 'react';
import moment from 'moment';
import BMap from 'BMap';
import { getLocalTimeF } from '../../../utils/time';
import {Page} from '../../../utils/constant';
import lodash from 'lodash';
import HandleModal from './HandleModal';
import EventModal from './EventModal';
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
const formLayout1 = {
    labelCol: {
        span: 3
    },
    wrapperCol: {
        span: 21
    },
    style: {
        marginBottom: 10
    }
}
class DeviceEvent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            startDate:startDates.valueOf(),
            endDate:endDates.valueOf()
        }
    }
    componentDidMount() {
        
    }
    handle = (item) => {
        const {dispatch} =this.props;
        dispatch({
            type:'device/updateState',
            payload:{
                eventModal:true,
                iotDeviceEventId:item.iotDeviceEventId,
                eventDetailData: {}
            }
        })
        dispatch({
            type:'device/eventDetail',
            payload:{
                iotDesDeviceEventId:item.iotDesDeviceEventId
            }
        })
    }
    handleCancel = () =>{
        const {dispatch} =this.props;
        dispatch({
            type:'device/updateState',
            payload:{
                eventModal:false
            }
        })
    }
    handleOk = () => {
        const {dispatch} =this.props;
        dispatch({
            type:'device/updateState',
            payload:{
                eventModal:false
            }
        })
    }
    onRangeChange = (value, dateString) =>{
        // this.setState({
        //     startDate:dateString[0],
        //     endDate:dateString[1]
        // })
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
                if(endTime.valueOf() - beginTime.valueOf() > 31*24*60*60*1000){
                    message.warn('时间选择不能超过31天');
                    return;
                }

                this.props.dispatch({
                    type: 'device/updateState',
                    payload: {
                        eventPageIndex: Page.pageIndex,
                        eventPageSize: Page.pageSize,
                        eventStarttime: fieldsValue['time'][0].valueOf(),
                        eventEndtime: fieldsValue['time'][1].valueOf(),
                    }
                })
                this.props.dispatch({
                    type:'device/queryevents',
                    payload:{
                        startTime: fieldsValue['time'][0].valueOf(),
                        endTime:fieldsValue['time'][1].valueOf(),
                        // disposeStatus: fieldsValue.disposeStatus
                    }
                })
            }
        })
    }

    onOk = () => {
        this.props.dispatch({
            type:'device/updateState',
            payload:{
                eventModal:false
            }
        })
    }
    render() {
        const {dispatch,eventModal,
            form: {
            getFieldDecorator,
            setFieldsValue,}
        } = this.props;
        const {loading,eventList,eventTotal,eventPageSize,eventPageIndex,iotDeviceEventId,eventDetailData,eventEndtime,eventStarttime} = this.props;
        let that = this
        const isloading = loading.effects['device/queryevents'];
        const pagination = {
            total: eventTotal,
            current: eventPageIndex,
            defaultCurrent: eventPageIndex,
            pageSize: eventPageSize,
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
                    eventPageIndex:current,
                    eventPageSize:pageSize,
                }
            });
            dispatch({
                type:'device/queryevents',
                payload:{
                    disposeStatus:'',
                    // eventPageIndex:current,
                    // eventPageSize:pageSize,
                    endTime:eventEndtime,
                    startTime: eventStarttime,
                }
            })
        }
        function setPage(page){
            dispatch({
                type: 'device/updateState',
                payload:{
                    eventPageIndex:page,
                    eventPageSize:eventPageSize,
                }
            });
            dispatch({
                type:'device/queryevents',
                payload:{
                    // eventPageIndex:page,
                    // eventPageSize:eventPageSize,
                    endTime:eventEndtime,
                    startTime: eventStarttime,
                }
            })
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const dataSource = eventList || [];
        const columns = [{
                title: '发生时间',
                dataIndex: 'eventTime',
                render: (text, record) => {
                    return record.eventTime ? getLocalTimeF(record.eventTime) : ''
                }
            }, {
                title: '事件源',
                dataIndex: 'eventSource',
            }, {
                title: '事件类型',
                dataIndex: 'eventTypeName',
            },{
                title: '事件内容',
                width:'25%',
                dataIndex: 'eventDescription',
            // },{
            //     title: '处理时间',
            //     dataIndex: 'disposeDate',
            //     render: (text, record) => {
            //         return record.disposeDate ? getLocalTimeF(record.disposeDate) : ''
            //     }
            }, {
                title: '详情',
                dataIndex: 'disposeStatus',
                key: 'disposeStatus',
                render: (text, record) => {
                    return (
                        <div>
                            
                            <a onClick={this.handle.bind(this,record)}>详情</a>
                            
                        </div>
                    );
                }
            }
        ];
        const handleProps ={
            dispatch,
            iotDeviceEventId,
            eventDetailData
        }
        return(
            <div className={styles.deviceEvent}>
                <div>
                    <Form>
                        <Row className={styles.search}>
                            <Col span={10}>
                                <FormItem {...formLayout} label="时间">
                                    {getFieldDecorator('time',{
                                        initialValue:[moment(eventStarttime),moment(eventEndtime)]
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
                            {/* <Col  span={6}>
                                <FormItem label="状态" {...formLayout1}>
                                {getFieldDecorator('disposeStatus', {
                                    initialValue: [],
                                    rules: []
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="请选择状态"
                                        >
                                            <Option value="">全部</Option>
                                            <Option value={false}>未处理</Option>
                                            <Option value={true}>已处理</Option>
                                            {children}
                                        </Select>
                                    )}
                                </FormItem>   
                            </Col> */}
                            <Col span={4}>
                                <FormItem  {...formLayout}>
                                    <Button type="primary" ghost style={{marginLeft:'20px'}} onClick={this.onSubmit.bind(this)}>查询</Button>
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
              {/* {
                  eventModal ? 
                  <EventModal {...handleProps}/>
                  :''
              } */}
              <Modal
                    width="900px"
                    maskClosable={false}
                    title="事件详情"
                    visible={eventModal}
                    onOk={this.onOk}
                    onCancel={this.onOk}
                    okText={"关闭"}
                    cancelText={"取消"}
              >
                   {eventModal ? <EventModal {...handleProps} /> : ''}
              </Modal>
            </div>
        )
    }
}
export default Form.create()(DeviceEvent)