import { Button, Row, Col, Form, Tabs, Input, Modal, Timeline, Icon } from 'antd';
import styles from './Detail.less';
import React, { Component } from 'react';
import moment from 'moment';
import BMap from 'BMap';
import { getLocalTimeF } from '../../../utils/time';
import { deviceStatus,deviceConnectStatus } from '../../../utils/const';
import lodash,{isEmpty} from 'lodash';
import RoadModal from '../../deviceDistribution/RoadModal';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {detailAddress: ''}
    }
    componentDidUpdate() {
        if (this.state.detailAddress) return;
        const { deviceInfo } = this.props;
        const map = new BMap.Map("mapTrack");
        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
            // 靠左上角位置
            anchor: BMAP_ANCHOR_TOP_LEFT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: false
        });
        map.addControl(navigationControl);
        map.enableScrollWheelZoom();

        let that = this;
        if(!isEmpty(deviceInfo)){
            if (deviceInfo.longitude && deviceInfo.latitude) {
                var point = new BMap.Point(deviceInfo.longitude, deviceInfo.latitude);
                var mk = new BMap.Marker(point);
                var geo = new BMap.Geocoder();
                geo.getLocation(point, function(rt) {
                    const {
                        province,
                        city,
                        district,
                        street,
                        streetNumber
                    } = rt.addressComponents;
                    let detailAddress = province+city+district+street+streetNumber;
                    that.setState({detailAddress})
                });
                //添加标记点
                map.addOverlay(mk);
                // map.panTo(point);
                map.centerAndZoom(point, 12);
            } else {
                map.centerAndZoom(new BMap.Point(120.246917, 30.24597),6);
            }
        } else {
            var point = new BMap.Point(120.246917,30.24597);
            // var mk = new BMap.Marker(point);
            // //添加标记点
            // this.setState({
            //     marker: mk
            // });
            // map.addOverlay(mk);
            // map.panTo(point);
            map.centerAndZoom(point, 6);
        }
    }
    goRoute = () => {
        const {deviceInfo} = this.props;
        const endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
        const startTime =new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime();
        this.props.dispatch({
            type:'device/queryRoadData',
            payload:{
                deviceCode: deviceInfo.deviceCode,
                startTime,
                endTime
            }
        })
        this.props.dispatch({
            type:'device/updateState',
            payload:{
                roadModal:true
            }
        })
    }
    render() {
        const { deviceInfo,roadModal,dispatch,roadData } = this.props;
        const modalInfo = {
            onCancel: ()=>{
                dispatch({
                    type:'device/updateState',
                    payload:{
                        roadModal:false
                    }
                })
            },
            onSubmit: (item)=>{
                dispatch({
                    type:'device/queryRoadData',
                    payload:item
                })
            },
            deviceCode: deviceInfo.deviceCode
        }

        let patcharr = [];
        let tablepatch = deviceInfo.extendProperties ? (deviceInfo.extendProperties.length % 4) : 0;
        if(tablepatch) {
            for(let i=0;i<(4-tablepatch);i++) {
                patcharr.push(
                    <Col span={6}>&nbsp;</Col>
                )
            }
        }
        return (
            <div className={styles.container}>
                <Row className={styles.detail}>
                    <Col>
                        <div className={styles.item}>业务编码：<span title={deviceInfo.bizCode || ''}>{deviceInfo.bizCode || ''}</span></div>
                        <div className={styles.item}>设备名称：<span title={deviceInfo.deviceName || ''}>{deviceInfo.deviceName || ''}</span></div>
                        <div className={styles.item}>设备类型：<span title={deviceInfo.deviceTypeName || ''}>{deviceInfo.deviceTypeName || ''}</span></div>
                        <div className={styles.item}>所属机构<span title={deviceInfo.agencyName || ''}>{deviceInfo.agencyName || ''}</span></div>
                        <div className={styles.item}>mac地址：<span title={deviceInfo.mac || ''}>{deviceInfo.mac || ''}</span></div>
                        <div className={styles.item}>固件型号：<span title={deviceInfo.firmwareModel || ''}>{deviceInfo.firmwareModel || ''}</span></div>
                        <div className={styles.item}>固件版本号：<span title={deviceInfo.firmwareVersion || ''}>{deviceInfo.firmwareVersion || ''}</span></div>
                        <div className={styles.item}>创建人：
                            <span title={deviceInfo.createOperatorName || ''}>
                                {deviceInfo.createOperatorName || ''}
                            </span>
                        </div>
                        <div className={styles.item}>创建时间：
                            <span title={deviceInfo.inputDate ? getLocalTimeF(deviceInfo.inputDate) : ''}>
                                {deviceInfo.inputDate ? getLocalTimeF(deviceInfo.inputDate) : ''}
                            </span>
                        </div>
                        <div className={styles.item}>备注：<span title={deviceInfo.description || ''}>{deviceInfo.description || ''}</span></div>
                        <div className={styles.item}>启用状态：
                            <span title={deviceInfo.deviceCode}>{
                                deviceStatus.filter(item =>item.enable === deviceInfo.status).length>0 ?
                                deviceStatus.filter(item =>item.enable === deviceInfo.status)[0].label :''}
                            </span>
                        </div>
                        <div className={styles.item}>所在位置：
                            <span title={this.state.detailAddress || ''}>{this.state.detailAddress || ''}</span>
                        </div>
                        <a onClick={this.goRoute.bind(this)} style={{ textDecoration: 'underline' }}>历史轨迹</a>
                    </Col>
                    <Col style={{ marginLeft: '100px' }}>
                        <div id="mapTrack" style={{ height: '410px', width: '600px' }}></div>
                    </Col>
                </Row>
                <p className={styles.title}>扩展属性：{(deviceInfo.extendProperties && deviceInfo.extendProperties.length>0) ? '' : '暂无数据'}</p>
                <div className={styles.tableitem}>
                   
                        
                            {
                                (deviceInfo.extendProperties && deviceInfo.extendProperties.length>0) ? <Row>
                                {deviceInfo.extendProperties.map(v=>{
                                    return <Col span={6}>
                                        {v.extendName || ''}：<span title={v.extendValue || ''}>{v.extendValue || ''}</span>
                                    </Col>
                                }).concat(patcharr)} </Row> : ''
                            }
                       
                    
                </div>
                {
                    roadModal ? <RoadModal {...modalInfo} roadData = {roadData}/> :''
                }
            </div>
        )
    }

}
export default Form.create()(Detail)