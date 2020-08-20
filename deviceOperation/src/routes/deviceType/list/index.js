import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Modal,Form, Spin } from 'antd';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../../utils/time';
import { imageUrl } from '../../../utils/common';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import AddModal from '../../../components/deviceType/AddModal';
import EditModal from '../../../components/deviceType/EditModal';
import DetailModal from '../../../components/deviceType/DetailModal';
import {Page} from '../../../utils/constant';
import NullResult from '../../../components/NullResult';
const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;
const formlayout = {
    style: {
        marginBottom: 0
    }
}
class DeviceType extends React.Component {
    constructor(props) {
        super(props);
    }
    device =(item)=>{
        const {history} = this.props;
        history.push('/device?iotDeviceTypeId='+item.iotDeviceTypeId);
    }
    detail =(item)=>{
        const {dispatch} = this.props;
        dispatch({
            type:'deviceType/changeDetailModal',
            payload:{
                detailModal:true
            }
        })
        dispatch({
            type:'deviceType/updateState',
            payload:{
                detailData:item
            }
        })
    }
    add =(e)=>{
        const {dispatch} = this.props;
        dispatch({
            type:'deviceType/queryDataAggType',
        })
        dispatch({
            type:'deviceType/changeAddModal',
            payload:{
                addModal:true
            }
        })
    }
    edit =(item)=>{
        const {dispatch} = this.props;
        dispatch({
            type:'deviceType/queryDataAggType'
        })
        dispatch({
            type:'deviceType/changeEditModal',
            payload:{
                editModal:true
            }
        })
        dispatch({
            type:'deviceType/updateState',
            payload:{
                editData:item
            }
        })
    }
    delete =(item)=>{
        let that = this;
        confirm({
            title: '删除',
            content: '确定删除？',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                that.props.dispatch({
                    type:'deviceType/delete',
                    payload:{
                        iotDeviceTypeIds:[item.iotDeviceTypeId]
                    }
                })
            }
        });
    }
    enable =(item) =>{
        let that = this;
        confirm({
            title: '启用',
            content: '确定启用？',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                that.props.dispatch({
                    type:'deviceType/changeStatus',
                    payload:{
                        iotDeviceTypeIds:[item.iotDeviceTypeId],
                        status: 1
                    }
                })
            }
        });
    }
    disable = (item) => {
        let that = this;
        confirm({
            title: '停用',
            content: '确定启用？',
            okText:'确定',
            cancelText:'取消',
            onOk: () => {
                that.props.dispatch({
                    type:'deviceType/changeStatus',
                    payload:{
                        iotDeviceTypeIds:[item.iotDeviceTypeId],
                        status: 0
                    }
                })
            }
        });
    }
    search = (value) =>{
        this.props.dispatch({
            type:'deviceType/updateState',
            payload:{
                keywords: value,
            }
        })
        this.props.dispatch({
            type:'deviceType/query',
            payload:{
                pageIndex: Page.pageIndex,
                pageSize: Page.pageSize
            }
        })
    }
    render() {
        const {deviceType, dispatch,
            form:{
                getFieldDecorator,
                setFieldsValue
            }, loading    
        } = this.props;
        const isloading = loading.effects['deviceType/query'];
        const {addData,detailData,editData,detailModal,addModal,
            editModal,pageSize,pageIndex,total,list,factors,tags,
            protocols,keywords} = deviceType;
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
        const items = (list ||[]).map(item=>{
            return<Row className={styles.item} key={item.iotDeviceTypeId}>
                <Col span={24} >
                    <Row className={styles.con}>
                        <Col span={18}>
                            <div  className={styles.titleWrap}>
                                    <div>
                                        <img src={item.imageUrl !=="" ? imageUrl+item.imageUrl : require('../../../assets/image/project/project.png')} style={{width:80,height:80,}}/>
                                    </div>
                                    <div className={styles.project}>
                                        <p className={styles.p}> {item.deviceTypeCode}&nbsp;&nbsp;&nbsp;&nbsp;{item.deviceTypeName}</p>
                                        <div className={styles.desc} title={item.description}>{item.description}</div>
                                        <div className={styles.else}>
                                            <Row>
                                                <Col span={4}>
                                                    <p>创建人：<span title={item.username}>{item.username}</span></p>
                                                </Col>
                                                <Col span={8}>
                                                    <p>创建时间：<span>{item.inputDate ?  getLocalTimeF(item.inputDate) : ''}</span></p>
                                                </Col>
                                                <Col span={6}>
                                                    <p>设备接入协议：<span title={item.protocolName}>{item.protocolName}</span></p>
                                                </Col>
                                                <Col span={6}>
                                                    <p>设备厂商：<span title={item.manufacturer}>{item.manufacturer}</span></p>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                            </div>
                        </Col>
                        <Col span={6}  className={styles.conR}>
                            {/* <Button onClick={this.detail.bind(this,item)}>详情</Button> */}
                            <Button type="primary" ghost onClick={this.edit.bind(this,item)}>编辑</Button>
                            <Button type="primary" ghost onClick={this.delete.bind(this,item)}>删除</Button>
                            <Button  onClick={this.device.bind(this,item)}>查看设备</Button>
                            {/* {
                                item.status === 'N' ? <Button type="primary" onClick={this.enable.bind(this,item)}>启用</Button> :
                                <Button type="primary" onClick={this.disable.bind(this,item)}>禁用</Button>
                            } */}
                            
                        </Col>
                    </Row>
                    {/* <Row  className={styles.foot}>
                        <Col span={6}>
                            <p>所属标签：
                                <span className={styles.tags}
                                 title={item.iotTags.map(v=>{
                                        return v.tagName
                                    }).toString()}>
                                    {item.iotTags.map(v=>{
                                        return v.tagName
                                    }).toString()}
                                </span>
                            </p>
                        </Col>
                        <Col span={4}>
                            <p>用户名：<span title={item.username}>{item.username}</span></p>
                        </Col>
                        <Col span={7}>
                            <p>创建人：<span title={item.username}>{item.username}</span></p>
                        </Col>
                        <Col span={7}>
                            <p>创建时间：<span>{item.inputDate ?  getLocalTimeF(item.inputDate) : ''}</span></p>
                        </Col>
                        <Col span={7}>
                            <p>设备接入协议：<span title={item.protocolName}>{item.protocolName}</span></p>
                        </Col>
                    </Row> */}
                </Col>
            </Row>
        })
        const detailProps={
            detailData,
            handleOk(){
                dispatch({
                    type:'deviceType/changeDetailModal',
                    payload:{
                        detailModal:false
                    }
                })
            },
            handleCancel (){
                dispatch({
                    type:'deviceType/changeDetailModal',
                    payload:{
                       detailModal:false
                    }
                })
            }
        }
        const addProps={
            addData,
            factors,
            tags,
            protocols,
            handleOk(item){
                dispatch({
                    type:'deviceType/add',
                    payload:item
                })
            },
            handleCancel (){
                dispatch({
                    type:'deviceType/changeAddModal',
                    payload:{
                        addModal:false
                    }
                })
            }
        }
        const editProps={
            editData,
            factors,
            tags,
            protocols,
            handleOk(item){
                dispatch({
                    type:'deviceType/edit',
                    payload:item
                })
            },
            handleCancel (){
                dispatch({
                    type:'deviceType/changeEditModal',
                    payload:{
                        editModal:false
                    }
                })
            }
        }
        function onShowSizeChange(current, pageSize){
            dispatch({
                type: 'deviceType/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'deviceType/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            dispatch({
                type: 'deviceType/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'deviceType/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>设备类型管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={styles.container}>
                <Form>
                    <FormItem {...formlayout}>
                        <Row className={styles.search}>
                            <Col span={6}>
                                {getFieldDecorator('keywords', {
                                        initialValue: keywords,
                                    })(<Search
                                        placeholder="设备类型编码/名称/设备厂商"
                                        onSearch={this.search.bind(this)}
                                        enterButton
                                        size="large"
                                        />)}
                                
                            </Col>
                            <Col span={18} style={{textAlign:'right'}}>
                                
                                <Button type="primary" onClick={this.add.bind(this)}>新增设备类型</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                    
                    <div className={styles.list}>
                        <Spin tip="加载中..." spinning={isloading}>
                            {total>0 ? items : <NullResult/>}
                        </Spin>
                        {/* {total>0 ? items : <NullResult/>} */}
                        {/* <Row className={styles.item}>
                            <Col span={24} >
                                <Row className={styles.con}>
                                    <Col span={12}>
                                        <div  className={styles.titleWrap}>
                                                <div>
                                                    <img src={require('../../../assets/image/project/project.png')} style={{width:100,height:100,}}/>
                                                </div>
                                                <div className={styles.project}>
                                                    <p> 慧通车联网项目</p>
                                                    <div>博实结车载终端，有GPS定位、单线油耗传感器，油箱体积200升
                                                    博实结车载终端，有GPS定位、单线油耗传感器，油箱体积200升
                                                    博实结车载终端，有GPS定位、单线油耗传感器，油箱体积200升
                                                    </div>
                                                </div>
                                        </div>
                                    </Col>
                                    <Col span={12}  className={styles.conR}>
                                        <Button >详情</Button>
                                        <Button >查看设备</Button>
                                        <Button type="primary" ghost>编辑</Button>
                                        <Button type="primary" ghost>删除</Button>
                                        <Button type="primary">启用</Button>
                                    </Col>
                                </Row>
                                <Row  className={styles.foot}>
                                    <Col span={6}>
                                        <p>设备接入协议：<span>JT/T808</span></p>
                                    </Col>
                                    <Col span={6}>
                                        <p>所属标签：<span>车联网;智慧物流</span></p>
                                    </Col>
                                    <Col span={6}>
                                        <p>用户名：<span>abc</span></p>
                                    </Col>
                                    <Col span={6}>
                                        <p>创建时间：<span>2018-02-12 14:32:12</span></p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}
                    </div>
                    {total>0 ? <Pagination 
                        style={{textAlign:'right'}}
                        {...pagination} /> : ''}
                    

                </div>
                {
                    detailModal? 
                    <DetailModal {...detailProps}/>
                    :''
                } 
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

export default connect(({ deviceType, loading }) => ({ deviceType, loading }))(Form.create()(DeviceType));
