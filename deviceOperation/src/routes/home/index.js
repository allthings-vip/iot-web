import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import lodash from 'lodash';
import { Spin,Form, Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Modal } from 'antd';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../utils/time';
import styles from './index.less';
import TfIcon from '../../components/common/TfIcon/index';
import { imageUrl } from '../../utils/common';
import { createForm } from 'rc-form';
import EditModal from '../../components/project/EditModal';
import AddModal from '../../components/project/AddModal';
import {Page} from '../../utils/constant';
import NullResult from '../../components/NullResult';
const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
const formItemLayout = {
    style: {
        marginBottom: 0
    }
}
class Home extends React.Component {
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
        // this.props.dispatch({
        //     type:'home/queryCollaborators'
        // })
        this.props.dispatch({
            type:'home/updateState',
            payload:{
                addModal:true
            }
        })
    }
    detail = (item)=>{
        const {history} = this.props;
        if(item.status === '未审核'){
            
        } else {
            localStorage.setItem('iotProjectId',item.iotProjectId)
            history.push('/project');
        }
        
    }
    edit = (item) => {
        // this.props.dispatch({
        //     type:'home/queryCollaborators'
        // })
        this.props.dispatch({
            type:'home/detail',
            payload: {iotProjectId: item.iotProjectId}
        })
        this.props.dispatch({
            type:'home/updateState',
            payload:{
                editModal:true,
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
                    type:'home/delete',
                    payload:{
                        iotProjectIds:items
                    }
                })
            }
        });
    }
    confirm = (item) =>{
        let that = this;
        // let items = [];
        // items.push(item.iotProjectId || '');
        confirm({
            title: '审核',
            content: '确认'+item.projectName+'项目审核通过吗？？',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                that.props.dispatch({
                    type:'home/confirmProject',
                    payload:{
                        iotProjectId:item.iotProjectId
                    }
                })
            }
        });
    }
    search = (value) => {
        this.props.dispatch({
            type:'home/updateState',
            payload:{
                projectName: value,
            }
        })
        this.props.dispatch({
            type:'home/query',
            payload:{
                projectName: value,
                pageIndex:  1,
                pageSize:12
            }
        })
    }
    
    render() {
        const {home, dispatch,loading,app,
            form: {
                getFieldDecorator,
                setFieldsValue
            }} = this.props;
        const { userInfo } = app || {};
        const { roleCode } = userInfo || {};
        const {editModal,addModal,collaborators} = home;
        const {list,total,pageSize,pageIndex,editData,deviceTypes,projectName,overview} = home;
        const isloading = loading.effects['home/query'];
        const isloadingO = loading.effects['home/queryOverview'];
        const editProps={
            dispatch,
            editData,
            collaborators,
            handleOk(item){
                dispatch({
                    type:'home/edit',
                    payload:{
                        item:item
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'home/updateState',
                    payload:{
                        editModal:false,
                        collaborators: []
                    }
                })
            },
            queryTeamer(item) {
                dispatch({
                    type:'home/queryCollaborators',
                    payload:{
                        keywords: item
                    }
                })
            }
        }
        const addProps={
            dispatch,
            collaborators,
            handleOk(item){
                dispatch({
                    type:'home/add',
                    payload:{
                        item:item
                    }
                })
                
            },
            handleCancel (){
                dispatch({
                    type:'home/updateState',
                    payload:{
                        addModal:false,
                        collaborators: []
                    }
                })
            },
            queryTeamer(item) {
                dispatch({
                    type:'home/queryCollaborators',
                    payload:{
                        keywords: item
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
        const items = list.length <= 0 ? <NullResult/> : (list ||[]).map(item=>{
            const title =<div  className={styles.titleWrap} onClick={this.detail.bind(this,item)}>
                    <div>
                        <img src={item.imageUrl !=="" ? imageUrl+item.imageUrl : require('../../assets/image/project/project.png')} style={{width:100,height:100,}}/>
                    </div>
                    <div className={styles.project}>
                        <div className={styles.projectTitle} style={{position:'relative'}}>
                            <div className={styles.projectName} title={item.projectName}> {item.projectName}</div>
                            
                        </div>
                        <div  className={styles.desc} title={item.description}>{item.description}</div>
                    </div>
                    <div title={item.status} className={item.status === '已审核' ? styles.status : styles.statusU}>
                    </div>
                </div>
            return<Col className={styles.item} span={6} key={item.iotProjectId}>
                <div  className={styles.gutterbox} >
                    <Card  onClick={this.detail.bind(this,item)} title={title} bordered={false} className={styles.projectWrap}>
                        <div >
                            <p>创建人：<span>{item.createOperator || ''}</span></p>
                            <p>创建时间：<span>{item.inputDate ?  getLocalTimeF(item.inputDate) : ''}</span></p>
                            <p>所属单位：<span style={styles.company} title={item.companyName}>{item.companyName}</span></p>
                            <p>设备类型：
                                <span title={item.deviceTypes.map(v=>{
                                        return v.deviceTypeName
                                    }).toString()}>
                                    {item.deviceTypes.map(v=>{
                                        return v.deviceTypeName
                                    }).toString()}
                                </span>
                            </p>
                            <p>设备总数：<span style={{color:'#0289ff'}}>{item.deviceTotal}</span></p>
                        </div>
                        
                    </Card>
                    <div className={styles.projectBtn}>
                        {
                            roleCode == "admin" ? (
                                item.status === '未审核' ?  <Button type="primary" ghost onClick={this.confirm.bind(this,item)}>审核</Button> :''
                            ) : ('')
                        }
                       
                        <Button type="primary" ghost onClick={this.edit.bind(this,item)}>编辑</Button>
                        <Button type="danger" ghost onClick={this.delete.bind(this,item)}>删除</Button>
                    
                    </div>
                </div>
            </Col>
        })
        function hasErrors(fieldsError) {
            return Object.keys(fieldsError).some(field => fieldsError[field]);
        }

        function onShowSizeChange(current, pageSize){
            dispatch({
                type: 'home/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                    projectName
                }
            });
            dispatch({
                type: 'home/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                    projectName
                }
            });
        }
        function setPage(page){
            dispatch({
                type: 'home/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                    projectName
                }
            });
            dispatch({
                type: 'home/updateState',
                payload:{
                    pageIndex: page,
                    pageSize: pageSize,
                    projectName
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        //let bigData =overview.totalPointCounts ? overview.totalPointCounts : 0;
        let totalPointCounts = 0;
        if(overview.totalPointCounts > 100000000){
            totalPointCounts = lodash.ceil(overview.totalPointCounts / 100000000,2) +'亿+';
        }else if(overview.totalPointCounts > 10000){
            totalPointCounts = lodash.ceil(overview.totalPointCounts / 10000,0) +'万+';
        }else {
            totalPointCounts = overview.totalPointCounts
        }
        return (
            <div className={styles.indexWrap}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>首页</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Form>
                    <Row className={styles.headWrap}>
                        <Col span={6} className={styles.title}>
                            <div className={styles.titleImg}>
                                <div className = {styles.circle1}>
                                    <img  src={require('../../assets/image/index/1.png')}/>
                                </div>
                            </div>
                            <div className={styles.con}>
                                <p className={styles.countTitle}> 接入项目数(个)</p>
                                <p className={styles.count}>{overview.projectCounts || '0'}</p>
                            </div>
                        </Col>
                        <Col span={6} className={styles.title}>
                            <div className={styles.titleImg}>
                                <div className = {styles.circle2}>
                                    <img  src={require('../../assets/image/index/2.png')}/>
                                </div>
                            </div>
                            <div className={styles.con}>
                                <p className={styles.countTitle}> 设备类型数(个)</p>
                                <p className={styles.count}>{overview.deviceTypeCounts || '0'}</p>
                            </div>
                            
                        </Col>
                        <Col span={6} className={styles.title}>
                            <div className={styles.titleImg}>
                                <div className = {styles.circle3}>
                                    <img  src={require('../../assets/image/index/3.png')}/>
                                </div>
                            </div>
                            <div className={styles.con}>
                                <p className={styles.countTitle}> 接入设备数(台)</p>
                                <p className={styles.count}>{overview.deviceCounts || '0'}</p>
                            </div>
                            
                        </Col>
                        <Col span={6} className={styles.title}>
                            <div className={styles.titleImg}>
                                <div className = {styles.circle4}>
                                    <img  src={require('../../assets/image/index/4.png')}/>
                                </div>
                            </div>
                            <div className={styles.con}>
                                <p className={styles.countTitle}> 数据点数(条)</p>
                                <p className={styles.count}>{totalPointCounts || '0'}</p>
                            </div>
                            
                        </Col>
                    </Row>
                    <Row className={styles.search}>
                        <Col span={6}>
                            <FormItem {...formItemLayout}>
                            {getFieldDecorator('projectName', {
                                    initialValue: projectName,
                                })(<Search
                                    placeholder="请输入项目名称"
                                    onSearch={this.search.bind(this)}
                                    enterButton
                                    size="default"
                                    />)}
                            </FormItem>
                        </Col>
                        <Col span={18} style={{textAlign:'right'}}>
                            <FormItem {...formItemLayout}>
                                <Button type="primary" onClick={this.add.bind(this)}>新增项目</Button>
                            
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Row gutter={16}  className={styles.list}>
                    <Spin tip="加载中..." spinning={isloading}>
                        {items }
                    </Spin>
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

export default connect(({ home,loading, app }) => ({ home,loading, app }))(Form.create()(Home));
