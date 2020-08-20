import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Tabs,Table,Popconfirm,Form  } from 'antd';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import { getStampTime,getLocalTime,getLocalTimeF,weekDays, oneMonthDays, threeMonthDays } from '../../../utils/time';
import { Page} from '../../../utils/constant';

import moment from 'moment';
const Search = Input.Search;
const TabPane = Tabs.TabPane;
let endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
let startTime =new Date(moment().subtract(parseInt(weekDays, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime();

class Alarm extends React.Component {
    constructor(props) {
        super(props);
        this.search.bind(this);
        this.state = {
            deviceCode: ''
        }
    }


    search = (value) => {
        const {form } =  this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            this.setState({
                deviceCode:value
            })
            let endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
            let startTime =new Date(moment().subtract(parseInt(weekDays, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime();
            if(value){
                this.props.dispatch({
                    type:'alarm/query',
                    payload:{
                        deviceCode: value || '',
                        pageSize: Page.pageSize,
                        pageIndex: Page.pageIndex,
                        endDatetime:endTime,
                        startDatetime:startTime,
                    }
                })
                this.props.dispatch({
                    type:'alarm/queryAlarm',
                    payload:{
                        deviceCode: value || '',
                        pageSize: Page.pageSize,
                        pageIndex: Page.pageIndex,
                        endDatetime:endTime,
                        startDatetime:startTime,
                    }
                })
            }
        });
        
    }
    tabsChange = (e) =>{
        let endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
        let startTime =new Date(moment().subtract(parseInt(weekDays, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime();
        if(e === '2')
        {
            // this.props.dispatch({
            //     type:'device/queryAlarm',
            //     payload:{
            //         deviceCode: value || '',
            //         pageSize: Page.pageSize,
            //         pageIndex: Page.pageIndex,
            //         endDatetime:endTime,
            //         startDatetime:startTime,
            //     }
            // })
        }

    }
    render() {
        const {alarm, dispatch,
            form: {
            getFieldDecorator,
            setFieldsValue
        }} = this.props;
        const {list,total,pageSize,pageIndex,alarmList,alarmTotal,alarmPageSize,alarmPageIndex} = alarm;
        let that = this
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
        const alarmPagination = {
            total: alarmTotal,
            current: alarmPageIndex,
            defaultCurrent: alarmPageIndex,
            pageSize: alarmPageSize,
            onChange: setAlarmPage,
            onShowSizeChange:onShowAlarmSizeChange,
            showQuickJumper:true,
            showSizeChanger:true,
            showTotal:showAlarmTotal
        }
        function onShowSizeChange(current, pageSize){
            dispatch({
                type:'alarm/query',
                payload:{
                    deviceCode: that.state.deviceCode || '',
                    pageIndex:current,
                    pageSize:pageSize,
                    endDatetime:endTime,
                    startDatetime:startTime,
                }
            })
            dispatch({
                type: 'alarm/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            dispatch({
                type:'alarm/query',
                payload:{
                    deviceCode: that.state.deviceCode || '',
                    pageIndex:page,
                    pageSize:pageSize,
                    endDatetime:endTime,
                    startDatetime:startTime,
                }
            })
            dispatch({
                type: 'alarm/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        function onShowAlarmSizeChange(current, pageSize){
            dispatch({
                type:'alarm/queryAlarm',
                payload:{
                    deviceCode: that.state.deviceCode || '',
                    pageIndex:current,
                    pageSize:pageSize,
                    endDatetime:endTime,
                    startDatetime:startTime,
                }
            })
            dispatch({
                type: 'alarm/updateState',
                payload:{
                    alarmPageIndex:current,
                    alarmPageSize:pageSize,
                }
            });
        }
        function setAlarmPage(page){
            dispatch({
                type:'alarm/queryAlarm',
                payload:{
                    deviceCode: that.state.deviceCode || '',
                    pageIndex:page,
                    pageSize:pageSize,
                    endDatetime:endTime,
                    startDatetime:startTime,
                }
            })
            dispatch({
                type: 'alarm/updateState',
                payload:{
                    alarmPageIndex:page,
                    alarmPageSize:pageSize,
                }
            });
        }
        function showAlarmTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const columns = [{
                title: '发生时间',
                dataIndex: 'inputDate',
                render: (text, record) => {
                    return record.inputDate ? getLocalTimeF(record.inputDate) : ''
                }
            }, {
                title: '事件源',
                dataIndex: 'eventSource',
            }, {
                title: '事件类型',
                dataIndex: 'eventType',
            },{
                title: '事件内容',
                dataIndex: 'eventContent',
            }
        ];
        const columns1 = [{
                title: '发生时间',
                dataIndex: 'inputDate',
                render: (text, record) => {
                    return record.inputDate ? getLocalTimeF(record.inputDate) :''
                }
            }, {
                title: '报警源',
                dataIndex: 'alarmSource',
            }, {
                title: '报警类型',
                dataIndex: 'alarmType',
            },{
                title: '报警信息',
                dataIndex: 'alarmContent',
            }
        ];
        const dataSource= list
        const dataSource1= alarmList
        return (
            <div>
                {/* <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>事件/报警</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div  className={styles.container}>
                    <Row className={styles.search}>
                        <Col span={10}>
                            <Form>
                                <Form.Item>
                                    {getFieldDecorator('deviceCode', {
                                        initialValue: '',
                                        rules: [
                                            {required: true, message: '请输入完整设备编码'},
                                        ]
                                    })(<Search
                                        placeholder="请输入完整设备编码"
                                        onSearch={this.search.bind(this)}
                                        enterButton
                                        size="large"
                                        />)}
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </div>
                <Tabs  className={styles.container}>
                    <TabPane tab="事件" key="1">
                        <div>                   
                            <div className={styles.list}>
                                <Table dataSource={dataSource} columns={columns} style={{textAlign:'center'}} pagination={pagination}/>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="报警" key="2">
                        <div>                   
                            <div className={styles.list}>
                                <Table dataSource={dataSource1} columns={columns1} style={{textAlign:'center'}} pagination={alarmPagination}/>
                            </div>
                        </div>
                        {/* <MapList {...mapProps}/> */}
                    </TabPane>
                </Tabs>
               
            </div>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export default connect(({ alarm }) => ({ alarm }))(Form.create()(Alarm));
