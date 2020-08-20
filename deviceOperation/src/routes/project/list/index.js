import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Modal } from 'antd';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../../utils/time';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import { imageUrl } from '../../../utils/common';
import { createForm } from 'rc-form';
import EditModal from '../../../components/project/EditModal'
import AddModal from '../../../components/project/AddModal'
import {Page} from '../../../utils/constant';
import NullResult from '../../../components/NullResult';
const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
class Project extends React.Component {
    constructor(props) {
        super(props);
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }
    add = (e) => {
        this.props.dispatch({
            type:'project/changeAddModal',
            payload:{
                addModal:true
            }
        })
        this.props.dispatch({
            type:'project/queryDeviceType',
            payload:{
                pageIndex:1,
                pageSize:10000,
            }
        })
    }
    detail = (item)=>{
        const {history} = this.props;
        history.push('/project/detail?iotProjectId='+item.iotProjectId)
    }
    edit = (item) => {
        this.props.dispatch({
            type:'project/queryDeviceType',
            payload:{
                pageIndex:1,
                pageSize:10000,
            }
        })
        this.props.dispatch({
            type:'project/changeEditModal',
            payload:{
                editModal:true
            }
        })
        this.props.dispatch({
            type:'project/updateState',
            payload:{
                editData:item
            }
        })
    }
    delete = (item) => {
        let that = this;
        let items = [];
        items.push(item.iotProjectId || '');
        confirm({
            title: '删除',
            content: '确认删除？',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                that.props.dispatch({
                    type:'project/delete',
                    payload:{
                        iotProjectIds:[items]
                    }
                })
            }
        });
    }
    search = (value) => {
        this.props.dispatch({
            type:'project/updateState',
            payload:{
                keywords: value,
            }
        })
        this.props.dispatch({
            type:'project/query',
            payload:{
                pageIndex: Page.pageIndex,
                pageSize: Page.pageSize
            }
        })
    }
    
    render() {
        const {project, dispatch,
            form: {
                getFieldDecorator,
                setFieldsValue
            }} = this.props;
        const {editModal,addModal} = project;
        const {list,total,pageSize,pageIndex,editData,deviceTypes,keywords} = project;
        const editProps={
            editData,
            deviceTypes,
            handleOk(item){
                dispatch({
                    type:'project/edit',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'project/changeEditModal',
                    payload:{
                        editModal:false
                    }
                })
            }
        }
        const addProps={
            deviceTypes,
            handleOk(item){
                dispatch({
                    type:'project/add',
                    payload:{
                        item:item
                    }
                })
                
            },
            handleCancel (){
                dispatch({
                    type:'project/changeAddModal',
                    payload:{
                        addModal:false
                    }
                })
            }
        }
        const pagination = {
            total: total,
            current: pageIndex,
            defaultCurrent: pageIndex,
            pageSize: pageSize,
            onChange: setPage,
            onShowSizeChange:onShowSizeChange,
            showQuickJumper:true,
            showSizeChanger:true,
            pageSizeOptions:['12','24','36','48']
        }
        const items = (list ||[]).map(item=>{
            const title =<div  className={styles.titleWrap}>
                    <div>
                        <img src={item.imageUrl !=="" ? imageUrl+item.imageUrl : require('../../../assets/image/project/project.png')} style={{width:100,height:100,}}/>
                    </div>
                    <div className={styles.project}>
                        <span className={styles.projectName} title={item.projectName}> {item.projectName}</span>
                        <div  className={styles.desc} title={item.description}>{item.description}</div>
                    </div>
                </div>
            return<Col className={styles.item} span={6} key={item.iotProjectId}>
                <div  className={styles.gutterbox}>
                    <Card title={title} bordered={false} className={styles.projectWrap}>
                        <p>用户名：<span>{item.username}</span></p>
                        <p>创建时间：<span>{item.inputDate ?  getLocalTimeF(item.inputDate) : ''}</span></p>
                        <p>设备类型：
                            <span>
                                {item.deviceTypes.map(v=>{
                                    return v.deviceTypeName
                                }).toString()}
                            </span>
                        </p>
                        <p>设备总数：<span style={{color:'#0289ff'}}>{item.deviceTotal}</span></p>
                        <p>所属单位：<span style={styles.company} title={item.companyName}>{item.companyName}</span></p>
                        <div className={styles.projectBtn}>
                            <Button type="primary" ghost onClick={this.edit.bind(this,item)}>编辑</Button>
                            <Button type="primary" ghost onClick={this.delete.bind(this,item)}>删除</Button>
                            <Button type="primary" ghost onClick={this.detail.bind(this,item)}>详情</Button>
                        </div>
                    </Card>
                </div>
            </Col>
        })
        function hasErrors(fieldsError) {
            return Object.keys(fieldsError).some(field => fieldsError[field]);
        }

        function onShowSizeChange(current, pageSize){
            dispatch({
                type: 'project/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'project/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            dispatch({
                type: 'project/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'project/updateState',
                payload:{
                    pageIndex: page,
                    pageSize: pageSize,
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        return (
            <div className={styles.indexWrap}>
                {/* <Breadcrumb>
                    <Breadcrumb.Item href="">
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>项目管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <Form>
                    <Row className={styles.search}>
                        <Col span={6}>
                            <FormItem>
                            {getFieldDecorator('deviceTypeCode', {
                                    initialValue: keywords,
                                })(<Search
                                    placeholder="请输入项目名称"
                                    onSearch={this.search.bind(this)}
                                    enterButton
                                    size="large"
                                    />)}
                            </FormItem>
                        </Col>
                        <Col span={18} style={{textAlign:'right'}}>
                            
                            <Button type="primary" onClick={this.add.bind(this)}>新增项目</Button>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={16}  className={styles.list}>
                    {total>0 ? items : <NullResult/>}
                </Row>
                {
                    total>0 ? 
                    <Pagination 
                        style={{textAlign:'right'}}
                        showTotal={showTotal}  
                        {...pagination}/> 
                        : ''
                }
                {
                    editModal? 
                    <EditModal {...editProps}/>
                    // <Modal
                    //     title="项目详情"
                    //     visible={true}
                    //     onOk={this.handleOk}
                    //     onCancel={this.handleCancel}
                    //     >
                    //     <p>项目详情</p>
                    // </Modal>
                    :''
                }    
                {
                    addModal? 
                    <AddModal {...addProps}/>
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

export default connect(({ project }) => ({ project }))(Form.create()(Project));


