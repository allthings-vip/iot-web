import { Table,Button, Row, Col, Form, 
    Tabs, Input, Modal, Timeline, Icon,DatePicker ,Select,message} from 'antd';
import React, {Component} from 'react';
import OpsDetail from './opsDetail';
import OpsAddModal from './addModal';
import OpsEditModal from './editModal';
import {Page} from '../../utils/constant';
import styles from './listPage.less';
const FormItem = Form.Item;
const Option = Select.Option;
const Confirm = Modal.confirm;
const formLayout ={
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
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
class ListPage extends Component{
    constructor(props) {
        super(props);
        
    }
    componentDidMount() {
        
    }
    
    
    onSubmit = () => {
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            
            if (errors) {
                return;
            } else {
                this.props.dispatch({
                    type: 'opsmonitor/opsList',
                    payload: {
                        ...fieldsValue,
                        pageIndex:Page.pageIndex,
                        pageSize:Page.pageSize
                    }
                })

                this.props.dispatch({
                    type: 'opsmonitor/updateState',
                    payload: {
                        value: fieldsValue
                    }
                })
            }
        })
    }

    queryDetailData = (record) => {
        this.props.dispatch({
            type: 'opsmonitor/opsDetail',
            payload: {
                ip: record.ip,
                port: record.port
            }
        })

        this.timeout = setTimeout(() => this.queryDetailData(record), 2000);
    }

    cancelTimeout = () => {
        clearTimeout(this.timeout);
    }

    detail = (record) => {
        this.props.queryDetailData(record);
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                detailModal: true,
                detailRecord: record
            }
        })
    }
    add = () => {
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                addModal: true
            }
        })
    }
    edit = (record) => {
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                recordDetail: record
            }
        })

        this.props.dispatch({
            type: 'opsmonitor/detailService',
            payload: {
                ip: record.ip,
                port: record.port
            }
        })
    }

    del = (record) => {
        const that = this;
        Confirm({
            title: '确定删除此条数据吗？',
            onOk() {
                that.props.dispatch({
                    type: 'opsmonitor/delService',
                    payload: {
                        iotServiceId: record.iotServiceId
                    }
                })
            },
            onCancel() {},
        });
    }

    
    render() {
        const {dispatch,
            listData,
            loading,
            total,
            pageIndex,
            pageSize,
            detailData,
            detailModal,
            reportTime,
            cpuData,
            heapData,
            nonHeapData,
            netSpeedData,
            detailRecord,
            value,
            addModal,
            editModal,
            detail,
            recordDetail,
            loading1,
            userInfo,
            form: {
            getFieldDecorator,
            setFieldsValue,}
        } = this.props;

        const opsDetailProps = {
            dispatch,
            detailData,
            cancelTimeout: this.cancelTimeout,
            cpuData,
            reportTime,
            heapData,
            nonHeapData,
            netSpeedData,
            detailRecord,
            loading1
        }
        
        const isloading = loading.effects['opsmonitor/opsList'];
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
                type: 'opsmonitor/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type:'opsmonitor/opsList',
                payload:{
                    ...value,
                    pageIndex:current,
                    pageSize:pageSize,
                }
            })
        }
        function setPage(page){
            dispatch({
                type: 'opsmonitor/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type:'opsmonitor/opsList',
                payload:{
                    ...value,
                    pageIndex:page,
                    pageSize:pageSize,
                }
            })
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
    
        const columns = [{
                title: '序号',
                dataIndex: 'code',
                key: 'code',
                render: (text, record,index) => {
                    return (index +1) + (pageIndex -1 ) * pageSize;
                }
            },{
                title: '服务名称',
                dataIndex: 'serviceName',
                key: 'serviceName'
            }, {
                title: 'IP/端口',
                dataIndex: 'ipport',
                key: 'ipport',
                render: (text, record,index) => {
                    return record.ip + ':' + record.port
                }
            }, {
                title: '依赖的服务',
                dataIndex: 'dependencyService',
                key:'dependencyService'
            },{
                title: '启停状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record,index) => {
                        return (
                            <React.Fragment>
                            <div style={{marginRight: '8px',width: '12px', height: '12px', display: 'inline-block',borderRadius: '6px', backgroundColor: record.status?'#00B603':'#CACACA'}}></div>
                            <span>{record.status?'启动':'停止'}</span>
                            </React.Fragment>
                        )
                }
            },{
                title: '操作',
                dataIndex: 'disposeStatus',
                key: 'disposeStatus',
                render: (text, record) => {
                    return (
                        <div>
                            {userInfo.roleCode ==='admin' ? 
                                (
                                    <React.Fragment>
                                        <a onClick={()=>this.edit(record)} >修改</a>
                                        <a style={{paddingLeft:'16px'}} onClick={()=>this.del(record)}>删除</a>
                                    </React.Fragment>
                                ) : ('')
                            }
                            <a onClick={()=>this.detail(record)} style={{paddingLeft:'16px'}}>详情</a>
                        </div>
                    );
                }
            }
        ];

        const addProps = {
            dispatch,
        }

        const editProps = {
            dispatch,
            detail,
            recordDetail
        }
        
        return(
            <div>
                
                    <div className={styles.container}> 
                        <Form>
                            <Row>
                                <Col span={6}>
                                    <FormItem {...formLayout} label="启停状态">
                                        {getFieldDecorator('status',{
                                            initialValue: ''
                                        }
                                        )(
                                            <Select>
                                                <Option key='1' value=''>全部</Option>
                                                <Option key='2' value={true}>启动</Option>
                                                <Option key='3' value={false}>停止</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}  style={{paddingLeft: 10}}>
                                        <FormItem  style={{marginBottom: 0}}>
                                            {getFieldDecorator('keywords', {
                                                initialValue: ''
                                            })(
                                                <Input placeholder="服务名称/IP/端口"/>
                                            )}
                                        </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem  {...formLayout}>
                                        <Button type="primary" ghost style={{marginLeft:'20px'}} onClick={this.onSubmit.bind(this)}>查询</Button>
                                    </FormItem>
                                </Col>
                                {
                                    userInfo.roleCode ==='admin' ? (
                                        <Col span={8} style={{textAlign:'right'}}>
                                            <FormItem  {...formLayout1}>
                                                <Button type="primary" style={{marginLeft:'20px'}} onClick={this.add}>新增服务</Button>
                                            </FormItem>
                                        </Col>
                                    ) : ('')
                                }
                                
                            </Row>
                            <Row>
                                <Table 
                                    loading={isloading}
                                    dataSource={listData} 
                                    pagination={pagination}
                                    columns={columns} />
                            </Row>
                        </Form>
                    </div>
                

                {
                    addModal? 
                    <OpsAddModal {...addProps}/>
                    :''
                } 
                {
                    editModal? 
                    <OpsEditModal {...editProps}/>
                    :''
                } 
            </div>
        )
    }

    componentWillUnmount() {
        // this.cancelTimeout();
    }
}
export default Form.create()(ListPage)