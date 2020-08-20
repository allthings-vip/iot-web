import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Modal,Form  } from 'antd';
import { getStampTime,getLocalTime } from '../../../utils/time';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import EditModal from '../../../components/protocol/EditModal'
import AddModal from '../../../components/protocol/AddModal';
import {Page} from '../../../utils/constant';
const Search = Input.Search;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
    style:{
        marginBottom:0
    }
}
class Protocol extends React.Component {
    constructor(props) {
        super(props);
        this.edit.bind(this)
    }
    search = (value) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'protocol/updateState',
            payload:{
                keywords: value
            }
        })
        dispatch({
            type:'protocol/query',
            payload:{
                pageIndex: Page.pageIndex,
                pageSize: Page.pageSize
            }
        })
    }
    edit = (item) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'protocol/queryDetail',
            payload:{
                iotProtocolId:item.iotProtocolId
            }
        })
        dispatch({
            type:'protocol/queryFactor',
            payload:{
                pageIndex:1,
                pageSize:10000
            }
        })
        dispatch({
            type:'protocol/changeEditModal',
            payload:{
                editModal:true
            }
        })
    }
    add = (e) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'protocol/queryFactor',
            payload:{
                pageIndex:1,
                pageSize:10000
            }
        })
        dispatch({
            type:'protocol/changeAddModal',
            payload:{
                addModal:true
            }
        })
    }
    delete = (item) =>{
        let that = this;
        confirm({
            title: '删除',
            content: '确定删除？',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                that.props.dispatch({
                    type:'protocol/delete',
                    payload:{
                        iotProtocolIds:[item.iotProtocolId],
                    }
                })
                //this.props.onDelete(this.props.item.tmiMailListId);
            }
        });
    }

    render() {
        const {protocol, dispatch,
            form:{
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;
        const {editModal,addModal,protocolData ,keywords,factors} = protocol;
        const editProps={
            dispatch,
            protocolData,
            factors,
            handleOk(item){
                dispatch({
                    type:'protocol/edit',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'protocol/changeEditModal',
                    payload:{
                        editModal:false
                    }
                })
            }
        }
        const addProps={
            dispatch,
            factors,
            handleOk(item){
                dispatch({
                    type:'protocol/add',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'protocol/changeAddModal',
                    payload:{
                        addModal:false
                    }
                })
            }
        }
        const {list,total,pageSize,pageIndex} = protocol;
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
                type: 'protocol/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'protocol/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            dispatch({
                type: 'protocol/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'protocol/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const dataSource= list;
        const columns = [{
                title: '协议类型名称',
                dataIndex: 'protocolName',
                width:'20%',
                render: (text, record) => {
                    return (record.protocolName)
                }
            }, {
                title: '正式服务器',
                render:(text,record) =>{
                    return (record.serverIp ? record.serverIp + "/" :'') + 
                    (record.serverDomain ? record.serverDomain + "/" :'') +
                    (record.serverPort ? record.serverPort :'')
                }
            },{
                title: '测试服务器',
                render:(text,record) =>{
                    return (record.testServerIp ? record.testServerIp + "/" :'') + 
                    (record.testServerDomain ? record.testServerDomain + "/" :'') +
                    (record.testServerPort ? record.testServerPort :'')
                }
            },{
                title: '测量因子',
                width:'16%',
                dataIndex: 'iotFactorIds',
                render :(text,record) =>{
                    return (record.iotFactors || []).map(v=>{
                        return v.factorName
                    }).toString()
                }
            }, 
            // {
            //     title: '备注',
            //     dataIndex: 'description',
            // },
            {
                title: '操作',
                dataIndex: 'operation',
                width:'110px',
                render: (text, record) => {
                return (

                        <div>
                            <a  onClick={this.edit.bind(this,record)}>编辑</a>
                            <a  onClick={this.delete.bind(this,record)} style={{paddingLeft:'20px'}}>删除</a>
                        </div>
                    );
                },
            }
        ];
        return (
            <div>
                {/* <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>因子管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div className={styles.container}>
                    <Form>
                        <FormItem {...formItemLayout}>
                            <Row className={styles.search}>
                                <Col span={6}>
                                {getFieldDecorator('keywords', {
                                    initialValue: keywords,
                                })(<Search
                                    placeholder="请输入协议类型名称"
                                    onSearch={this.search.bind(this)}
                                    enterButton
                                    size="large"
                                    />)}
                                </Col>
                                <Col span={18} style={{textAlign:'right'}}>
                                    
                                    <Button type="primary" onClick={this.add.bind(this)}>新增协议类型</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
                <div className={styles.container}>
                    <div className={styles.list}>
                        <Table dataSource={dataSource} columns={columns} style={{textAlign:'center'}} pagination={pagination}/>
                    </div>


                </div>
                {
                    addModal? 
                    <AddModal {...addProps}/>
                    :''
                } 
                {
                    editModal? 
                    <EditModal {...editProps}/>
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

export default connect(({ protocol }) => ({ protocol }))(Form.create()(Protocol));
