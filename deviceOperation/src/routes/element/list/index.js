import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Modal,Form  } from 'antd';
import { getStampTime,getLocalTime } from '../../../utils/time';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import EditModal from '../../../components/element/EditModal'
import AddModal from '../../../components/element/AddModal';
import {Page} from '../../../utils/constant';
const Search = Input.Search;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
    style:{
        marginBottom:0
    }
}
class Element extends React.Component {
    constructor(props) {
        super(props);
        this.edit.bind(this)
    }
    search = (value) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'element/updateState',
            payload:{
                keywords: value
            }
        })
        dispatch({
            type:'element/query',
            payload:{
                pageIndex: Page.pageIndex,
                pageSize: Page.pageSize
            }
        })
    }
    edit = (item) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'element/queryDetail',
            payload:{
                iotFactorId:item.iotFactorId
            }
        })
        dispatch({
            type:'element/queryDataAggType',
        })
        dispatch({
            type:'element/changeEditModal',
            payload:{
                editModal:true
            }
        })
    }
    add = (e) =>{
        const {dispatch} = this.props;
        dispatch({
            type:'element/queryDataAggType',
        })
        dispatch({
            type:'element/changeAddModal',
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
                    type:'element/delete',
                    payload:{
                        iotFactorIds:[item.iotFactorId],
                    }
                })
                //this.props.onDelete(this.props.item.tmiMailListId);
            }
        });
    }

    render() {
        const {element, dispatch,
            form:{
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;
        const {editModal,addModal,elementData,dataAggType ,keywords} = element;
        const editProps={
            dispatch,
            elementData,
            dataAggType,
            handleOk(item){
                dispatch({
                    type:'element/edit',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'element/changeEditModal',
                    payload:{
                        editModal:false
                    }
                })
            }
        }
        const addProps={
            dispatch,
            dataAggType,
            handleOk(item){
                dispatch({
                    type:'element/add',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'element/changeAddModal',
                    payload:{
                        addModal:false
                    }
                })
            }
        }
        const {list,total,pageSize,pageIndex} = element;
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
                type: 'element/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'element/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            dispatch({
                type: 'element/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'element/query',
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
                title: '因子代码',
                dataIndex: 'factorCode',
                render: (text, record) => {
                    return (record.factorCode)
                }
            }, {
                title: '因子名称',
                dataIndex: 'factorName',
            },{
                title: '单位名称',
                dataIndex: 'unitName',
            },{
                title: '单位符号',
                dataIndex: 'unitSymbol',
            },{
                title: '聚合类型',
                dataIndex: 'dataAggTypeName',
            }, {
                title: '操作',
                dataIndex: 'operation',
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
                                    placeholder="请输入因子代码或名称"
                                    onSearch={this.search.bind(this)}
                                    enterButton
                                    size="large"
                                    />)}
                                </Col>
                                <Col span={18} style={{textAlign:'right'}}>
                                    
                                    <Button type="primary" onClick={this.add.bind(this)}>新增因子</Button>
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

export default connect(({ element }) => ({ element }))(Form.create()(Element));
