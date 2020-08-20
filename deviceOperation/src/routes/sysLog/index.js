import { Table,Button, Row, Col, Form, 
    Tabs, Input, Modal, Timeline, Icon,DatePicker ,Select,message, Breadcrumb} from 'antd';
import React, {Component} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {Page} from '../../utils/constant';
import { getLocalTimeF } from '../../utils/time';
import styles from './index.less';
import TfIcon from '../../components/common/TfIcon/index';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker
const endDates = moment()
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
        span: 6
    },
    wrapperCol: {
        span: 18
    },
    style: {
        marginBottom: 10
    }
}
class SysLog extends Component{
    constructor(props) {
        super(props);
        
    }
    componentDidMount() {
        
    }
    
    
    onSubmit = () => {
        const {form} = this.props;
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let startTime = new Date(moment(values.time[0]).format('YYYY-MM-DD') + ' 00:00:00').getTime()
            let endTime = new Date(moment(values.time[1]).format('YYYY-MM-DD') + ' 23:59:59').getTime()
            if ((endTime - startTime)>(86400000*3)) {
                message.error('最大查询范围为3天');
                return;
            }
            values.startDatetime = moment(values.time[0]).valueOf()
            values.endDatetime =moment(values.time[1]).valueOf()
            delete values.time;
            values.loggertype = values.loggertype && values.loggertype.join()
            this.props.dispatch({
                type: 'syslog/query',
                payload: {
                    ...values,
                    pageIndex:Page.pageIndex,
                    pageSize:Page.pageSize
                }
            })

            this.props.dispatch({
                type: 'syslog/updateState',
                payload: {
                    value: values
                }
            })
        })
    }

    
    render() {
        const {dispatch,
            syslog,
            loading,
            form: {
            getFieldDecorator,
            setFieldsValue,}
        } = this.props;
        const {
            logList,
            total,
            pageIndex,
            pageSize,
            logType,
            projectName,
            value
        } = syslog;
        
        const isloading = loading.effects['syslog/query'];
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
                type: 'syslog/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type:'syslog/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                    ...value
                }
            })
        }
        function setPage(page){
            dispatch({
                type: 'syslog/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type:'syslog/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                    ...value
                }
            })
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
    
        const columns = [{
                title: '发生时间',
                dataIndex: 'loggerTime',
                key: 'loggerTime',
                render: (text, record,index) => {
                    return getLocalTimeF(record.loggerTime)
                }
            },{
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName'
            },  {
                title: '日志类型',
                dataIndex: 'loggerTypeName',
                key:'loggerTypeName'
            },{
                title: '日志内容',
                dataIndex: 'loggerContent',
                key: 'loggerContent'
            }
        ];
        
        return(
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>系统日志</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                        <Form className={styles.container}>
                            <Row>
                                <Col span={9}>
                                    <FormItem {...formLayout} label="时间">
                                        {getFieldDecorator('time',{
                                            initialValue: [startDates,endDates]
                                        }
                                        )(
                                            <RangePicker size="default" showTime={{ format: 'HH:mm' }} format={'YYYY-MM-DD HH:mm'} placeholder={['开始', '截止']}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...formLayout1} label="日志类型">
                                        {getFieldDecorator('loggertype'
                                        )(
                                            <Select mode="multiple">
                                                {
                                                    logType.map(item => {
                                                        return (
                                                            <Option key={item.loggerTypeCode} value={item.loggerTypeCode}>{item.loggerTypeName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6} offset={1}>
                                    <FormItem {...formLayout1} label="所属项目">
                                        {getFieldDecorator('iotProjectId',{
                                            initialValue: ''
                                        }
                                        )(
                                            <Select>
                                                <Option key='全部' value=''>全部</Option>
                                                {
                                                    projectName.map(item => {
                                                        return (
                                                            <Option key={item.iotProjectId} value={item.iotProjectId}>{item.projectName}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <FormItem  {...formLayout}>
                                        <Button type="primary" ghost style={{marginLeft:'20px'}} onClick={this.onSubmit.bind(this)}>查询</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Table 
                                    loading={isloading}
                                    dataSource={logList} 
                                    pagination={pagination}
                                    columns={columns} />
                            </Row>
                        </Form>
                    
            </div>
        )
    }

    componentWillUnmount() {
        // this.cancelTimeout();
    }
}
export default connect(({syslog, loading})=>({syslog, loading}))(Form.create()(SysLog))