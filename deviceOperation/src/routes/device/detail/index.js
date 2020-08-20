import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Tabs,Form,Select,DatePicker,Modal   } from 'antd';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../../utils/time';
import { deviceStatus,deviceConnectStatus } from '../../../utils/const';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import MapList from '../../../components/device/MapList';
import ChartModal from '../../../components/device/ChartModal';
const FormItem = Form.Item;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

const formLayout = {
    style: {
        marginBottom: 0
    }
}
const formLayout1 = {

    style: {
        marginBottom: 0
    }
}
let timer = null;
let timer1 = null;
let fTimer= null;
class DeviceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.showChart.bind(this)
    }
    componentDidMount() {
        
        const {dispatch,deviceInfo} = this.props
        
    }
    componentWillUnmount(){
        const {dispatch,deviceDetail} = this.props;
        const {deviceInfo,factorTimer} = deviceDetail;
        console.log(factorTimer);
        clearInterval(timer1);
        clearInterval(fTimer);
    }
    showChart = (item) =>{
        const {dispatch,deviceDetail} = this.props;
        const {deviceInfo,factorTimer} = deviceDetail;
        clearInterval(factorTimer);
        clearInterval(fTimer);
        dispatch({
            type:'deviceDetail/getChartVlaue',
            payload:{
                factorCodes:[item.factorCode || ''],
                deviceCode: deviceInfo.deviceCode || ''
            }
        })
        timer = setInterval(function () {
            dispatch({
                type:'deviceDetail/getChartVlaue',
                payload:{
                    factorCodes:[item.factorCode || ''],
                    deviceCode: deviceInfo.deviceCode || ''
                }
            })
        }, 3000);
        dispatch({
            type:'deviceDetail/updateState',
            payload:{
                factorName:item.factorName,
                chartModal:true
            }
        })
    }
    handleOk = (e) =>{
        const {dispatch,deviceDetail} = this.props;
        const {deviceInfo,factorTimer} = deviceDetail;
        
        dispatch({
            type:'deviceDetail/getFactorValues',
            payload:{
                factorCodes: (deviceInfo.factorList || []).map(v=>{
                    return v.factorCode
                }),
                deviceCode: deviceInfo.deviceCode || ''
            }
        })
        //factorTimer()
        fTimer = setInterval(function () {
            dispatch({
                type:'deviceDetail/getFactorValues',
                payload:{
                    factorCodes: (deviceInfo.factorList || []).map(v=>{
                        return v.factorCode
                    }),
                    deviceCode: deviceInfo.deviceCode || ''
                }
            })
        }, 3000);
        
        dispatch({
            type:'deviceDetail/updateState',
            payload:{
                factorTimer: fTimer,
                chartList:[],
                chartModal:false
            }
        })
        clearInterval(timer);
    }
    handleCancel = (e) =>{
        const {dispatch,deviceDetail} = this.props;
        const {deviceInfo,factorTimer} = deviceDetail;
        
        dispatch({
            type:'deviceDetail/getFactorValues',
            payload:{
                factorCodes: (deviceInfo.factorList || []).map(v=>{
                    return v.factorCode
                }),
                deviceCode: deviceInfo.deviceCode || ''
            }
        })
        //factorTimer()
        fTimer = setInterval(function () {
            dispatch({
                type:'deviceDetail/getFactorValues',
                payload:{
                    factorCodes: (deviceInfo.factorList || []).map(v=>{
                        return v.factorCode
                    }),
                    deviceCode: deviceInfo.deviceCode || ''
                }
            })
        }, 3000);
        
        dispatch({
            type:'deviceDetail/updateState',
            payload:{
                factorTimer: fTimer,
                chartList:[],
                chartModal:false
            }
        })
        clearInterval(timer);
    }
    tabsChange = (e) =>{
        const {deviceDetail,dispatch} = this.props;
        const {deviceInfo} = deviceDetail;
        if(e === '2')
        {
            dispatch({
                type:'deviceDetail/getAlarm',
                payload:{
                    deviceCode: deviceInfo.deviceCode
                }
            })
        }
    }
    render() {
        const {deviceDetail, dispatch,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {deviceInfo,alarmInfo,list,total,pageSize,pageIndex,
                totalA,pageSizeA,pageIndexA,
                chartModal,factorValue,chartList,deviceCode,factorCodes,factorName,series} = deviceDetail;
        const chartProps={
            dispatch,
            chartList,
            deviceCode,
            factorCodes,
            factorName,
            series,
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
            showTotal:showTotal
        }
        function onShowSizeChange(current, pageSize){
            dispatch({
                type: 'deviceDetail/getFactorList',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
            dispatch({
                type: 'deviceDetail/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                }
            });
        }
        function setPage(page){
            dispatch({
                type: 'deviceDetail/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const paginationA = {
            total: totalA,
            current: pageIndexA,
            defaultCurrent: pageIndexA,
            pageSize: pageSizeA,
            onChange: setPageA,
            onShowSizeChange:onShowSizeChangeA,
            showQuickJumper:true,
            showSizeChanger:true,
            showTotal:showTotalA
        }
        function onShowSizeChangeA(current, pageSize){
            dispatch({
                type: 'deviceDetail/updateState',
                payload:{
                    pageIndexA:current,
                    pageSizeA:pageSize,
                }
            });
        }
        function setPageA(page){
            dispatch({
                type: 'deviceDetail/updateState',
                payload:{
                    pageIndexA:page,
                    pageSizeA:pageSize,
                }
            });
        }
        function showTotalA(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const dataSource= deviceInfo.factorList || []
        const factorDataSource= factorValue || []
        const dataSource1= alarmInfo || []

        const columns = [{
                title: '因子',
                dataIndex: 'factorName',
                render: (text, record) => {
                    return (record.factorName)
                }
            },{
                title: '时间',
                dataIndex: 'inputDate',
                render: (text, record) => {
                    return factorDataSource.filter(item=>item.factorCode === record.factorCode).length >0 ?
                    getLocalTimeF(factorDataSource.filter(item=>item.factorCode === record.factorCode)[0].inputDate) : ''
                }
            },{
                title: '值',
                dataIndex: 'value',
                render: (text, record) => {
                    return factorDataSource.filter(item=>item.factorCode === record.factorCode).length >0 ?
                        factorDataSource.filter(item=>item.factorCode === record.factorCode)[0].value : ''
                }
            },{
                title: '单位',
                dataIndex: 'unitName',
                render: (text, record) => {
                    return record.unitName+'' 
                    //+ record.unitSymbol
                }
            },{
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                return (
                    <div>
                        <a onClick={this.showChart.bind(this,record)}>实时曲线</a>
                    </div>
                );
                },
            }];
        const columns1 = [{
                title: '发生时间',
                dataIndex: 'inputDate',
                render: (text, record) => {
                    return  record.inputDate ? getLocalTimeF(record.inputDate) : ''
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
            }];

        return (
            <div>
                {/* <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <Link to="/device">设备管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <span>设备详情</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div  className={styles.container}>
                    <Form  className={styles.search} style={{paddingBottom:'0px'}}>
                        <Row type="flex" justify="start">
                            <Col span={5}>
                                设备编码：<span className={styles.spanTitle} title={deviceInfo.deviceCode || ''}>{deviceInfo.deviceCode || ''}</span>
                            </Col>
                            <Col span={5}>
                                厂商编码：<span className={styles.spanTitle} title={deviceInfo.supplierCode || ''}>{deviceInfo.supplierCode || ''}</span>
                            </Col>
                            <Col span={5}>
                                设备名称：<span className={styles.spanTitle} title={deviceInfo.deviceName || ''}>{deviceInfo.deviceName || ''}</span>
                            </Col>
                            <Col span={4}>
                                是否在线：<span className={styles.spanTitle} title={deviceConnectStatus.filter(item =>item.value === deviceInfo.connectStatus).length>0 ? deviceConnectStatus.filter(item =>item.value === deviceInfo.connectStatus)[0].label :''}>
                                {deviceConnectStatus.filter(item =>item.value === deviceInfo.connectStatus).length>0 ? deviceConnectStatus.filter(item =>item.value === deviceInfo.connectStatus)[0].label :''}</span>
                            </Col>
                            <Col span={5}>
                                最近连接时间：<span className={styles.spanTitle} title={deviceInfo.latestConnectDatetime ? getLocalTimeF(deviceInfo.latestConnectDatetime) : ''}>{deviceInfo.latestConnectDatetime ? getLocalTimeF(deviceInfo.latestConnectDatetime) : ''}</span>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.container}>
                    <div className={styles.deviceDetail}>设备详情</div>
                    <Form>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                
                                    设备类型：<span  className={styles.spanTitle} title={deviceInfo.deviceTypeName || ''}>{deviceInfo.deviceTypeName || ''}</span>
                                
                            </Col>
                            <Col span={6}>
                                
                                    mac地址：<span className={styles.spanTitle}  title={deviceInfo.mac || ''}>{deviceInfo.mac || ''}</span>
                                   
                                
                            </Col>
                            <Col span={6}>
                                
                                    
                                    固件型号：<span className={styles.spanTitle}  title={deviceInfo.firmwareModel || ''}>{deviceInfo.firmwareModel || ''}</span>
                                
                                
                            </Col>
                            <Col span={6}>
                                
                                   
                                固件版本号：<span  className={styles.spanTitle}  title={deviceInfo.firmwareVersion || ''}>{deviceInfo.firmwareVersion || ''}</span>
                                
                                
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                
                                    地址：<span className={styles.spanTitle}  title={deviceInfo.longitude   || ''}>{deviceInfo.latitude   || ''} {deviceInfo.longitude   || ''}</span>
                                
                            </Col>
                            <Col span={6}>
                                
                                用户名：<span className={styles.spanTitle}  title={deviceInfo.username || ''}>{deviceInfo.username || ''}</span>
                                
                            </Col>
                            <Col span={6}>
                                
                                创建时间：<span  className={styles.spanTitle}  title={deviceInfo.inputDate ? getLocalTimeF(deviceInfo.inputDate) : ''}>{deviceInfo.inputDate ? getLocalTimeF(deviceInfo.inputDate) : ''}</span>
                                
                            </Col>
                            <Col span={6}>
                                状态：
                                        <span  className={styles.spanTitle} >
                                            {
                                                deviceStatus.filter(item =>item.value === deviceInfo.status).length>0 ?
                                                deviceStatus.filter(item =>item.value === deviceInfo.status)[0].label :''
                                            }
                                        </span>
                                
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.container}>
                    <div className={styles.list}> 
                        <Tabs  onChange={this.tabsChange.bind(this)}>
                            <TabPane tab="实时数据" key="1">
                                <Table dataSource={dataSource} columns={columns} style={{textAlign:'center'}} pagination={false}/>
                            </TabPane>
                            <TabPane tab="实时报警" key="2">
                                <Table dataSource={dataSource1} columns={columns1} style={{textAlign:'center'}} pagination={paginationA}/>
                                {/* <MapList {...mapProps}/> */}
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                {
                    chartModal?
                    <Modal
                        width="1000px"
                        title="实时曲线"
                        visible={true}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText={"确定"}
                        cancelText={""}
                        footer={null}
                        maskClosable={false}
                        >
                        <ChartModal {...chartProps}/>
                    </Modal>
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

export default connect(({ deviceDetail }) => ({ deviceDetail }))(Form.create()(DeviceDetail));
