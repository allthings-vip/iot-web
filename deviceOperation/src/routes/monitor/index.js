import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Select,Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Modal,Form  } from 'antd';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../utils/time';
import styles from './index.less';
import TfIcon from '../../components/common/TfIcon/index';
import RegistModal from '../../components/monitor/RegistModal'
import BatchRegistModal from '../../components/monitor/BatchRegistModal';
import {Page} from '../../utils/constant';
const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
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
        span: 18
    },
    style: {
        marginBottom: 0
    }
}
const formLayout2 = {
    labelCol: {
        span: 0
    },
    wrapperCol: {
        span: 24
    },
    style: {
        marginBottom: 0
    }
}
class Monitor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            selectedRowKeys:[],
            batchBtn:true
        }
    }
    componentDidUpdate(prevProps,){
        if(prevProps !== this.props){
            if(this.props.monitor.batchRegistModal){

            }
            else{
                this.setState({
                    selectedRowKeys:[],
                    batchBtn:true
                })
            }
        }
    }
    handleSearch = () =>{
        const {dispatch,form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            dispatch({
                type:'monitor/query',
                payload:{
                    ...fieldsValue,
                    pageIndex: Page.pageIndex,
                    pageSize: Page.pageSize
                }
            })
            dispatch({
                type:'monitor/updateState',
                payload:{
                    searchData: fieldsValue
                }
            })
        })
    }
    batchRegist = (e) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'monitor/getProjectName',
        })
        dispatch({
            type:'monitor/updateState',
            payload:{
                batchRegistModal:true,
                //selectItems:this.state.selectedRowKeys
                
            }
        })
    }
    regist = (item) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'monitor/updateState',
            payload:{
                registModal:true,
                selectItem:item
            }
        })
    }
    render() {
        const {monitor, dispatch,loading,
            form:{
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;
        let that = this;
        const {registModal,batchRegistModal,
            searchData,projects,deviceTypesByProjectId,
            addressPoint,tags,selectItem,selectItems } = monitor;
        const isloading = loading.effects['monitor/query'];
        const batchRegistProps = {
            history,
            dispatch,
            projects,
            selectItems,
            deviceTypesByProjectId,
            iotDeviceIds:this.state.selectedRowKeys,
        }
        const registProps={
            dispatch,
            projects,
            addressPoint,
            selectItem,
            tags,
            deviceTypesByProjectId,
            handleOk(item){
                dispatch({
                    type:'monitor/add',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'registModal/updateState',
                    payload:{
                        addModal:false
                    }
                })
            }
        }
        const {list,total,pageSize,pageIndex,protocols} = monitor;
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
            that.setState({
                selectedRowKeys:[],
                batchBtn:true
            })
            dispatch({
                type: 'monitor/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'monitor/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                    ...searchData
                }
            });
        }
        function setPage(page){
            that.setState({
                selectedRowKeys:[],
                batchBtn:true
            })
            dispatch({
                type: 'monitor/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'monitor/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                    ...searchData
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const dataSource= (list || []).map((v,index)=>{
            return {
                ...v,
                key:v.iotDeviceId
                //v.iotDeviceId
            }
        });
        const columns = [{
                title: '序号',
                dataIndex: 'factorCode1',
                render: (text, record,index) => {
                    return (index +1) + (pageIndex -1 ) * pageSize;
                }
            }, {
                title: '状态',
                dataIndex: 'registerStatus',
                render: (text, record) => {
                    if(text){
                        return <span>已注册</span>
                       
                    } else{
                        return <span>未注册</span>
                    }
                }
            },{
                title: '设备编码',
                dataIndex: 'deviceCode',
            },{
                title: '协议类型',
                dataIndex: 'protocolName',
            },{
                title: '所属项目',
                dataIndex: 'projectName',
            },{
                title: '设备类型',
                dataIndex: 'deviceTypeName',
            },{
                title: '注册时间',
                dataIndex: 'registerDate',
                render:(text,record)=>{
                    return text ?  getLocalTimeF(text) : ''
                }
            }, {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    if(record.registerStatus){
                        return ''
                       
                    } else{
                        return <div>
                            <a  onClick={this.regist.bind(this,record)}>注册</a>
                        </div>
                    }
                },
            }
        ];
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.props.dispatch({
                    type:'monitor/udpateState',
                    payload:{
                        selectItems:selectedRows
                    }
                })
                this.setState({
                    selectedRowKeys:(selectedRows || []).map((v,index)=>{
                        return v.iotDeviceId    
                    })
                })
                if(selectedRowKeys.length>0){
                    this.setState(
                        {
                            batchBtn:false
                        }
                    )
                    
                } else {
                    this.setState(
                        {
                            batchBtn:true
                        }
                    )
                }
                //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.registerStatus, // Column configuration not to be checked              
            }),    
        };
        function rowClassName (record,index) {
            if(record.registerStatus){
                return styles.backgroundC;
            } else {
                return ''
            }
        }

        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>设备监控</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={styles.container}>
                    <Form  layout="inline">
                        <Row gutter={16}>
                            <Col span={6} className={styles.status}>
                                <FormItem label="状态" {...formLayout1} style={{width:'100%'}}>
                                    {getFieldDecorator('registerStatus')(
                                        <Select placeholder="请选择">
                                            <Option value="">全部</Option>
                                            <Option value="1">已注册</Option>
                                            <Option value="0">未注册</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="协议类型" {...formLayout}  style={{width:'100%'}}>
                                    {getFieldDecorator('iotProtocolId')(
                                        <Select placeholder="请选择">
                                            <Option value="">全部</Option>
                                            {
                                                (protocols || []).map(v=>{
                                                    return <Option value={v.iotProtocolId}>{v.protocolName}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem  {...formLayout2}  style={{width:'100%'}}>
                                    {getFieldDecorator('deviceCode')(<Input placeholder="请输入设备编码" />)}
                                </FormItem>
                            </Col>
                            
                            <Col span={2}>
                                <FormItem {...formLayout}>
                                    <Button type="primary" onClick={this.handleSearch}>
                                        查询
                                    </Button>
                                </FormItem>
                            </Col>
                            <Col span={6} style={{textAlign:'right'}}>
                                <FormItem {...formLayout}>
                                    <span className={styles.submitButtons}>
                                        <Button type="primary" disabled={this.state.batchBtn} htmlType="submit" onClick={this.batchRegist.bind(this)}>
                                            批量注册
                                        </Button>
                                    </span>   
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div className={styles.list}>
                        <Table
                            loading={isloading}
                            rowClassName={rowClassName} 
                            rowSelection={rowSelection}
                            dataSource={dataSource} 
                            columns={columns} 
                            style={{textAlign:'center'}} 
                            pagination={pagination}/>
                    </div>
                </div>
                {
                    registModal? 
                    <RegistModal {...registProps}/>
                    :''
                } 
                {
                    batchRegistModal? 
                    <BatchRegistModal {...batchRegistProps}/>
                    :''
                } 
                
            </div>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export default connect(({ monitor,loading }) => ({ monitor,loading }))(Form.create()(Monitor));
