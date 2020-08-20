import { Button, Row, Col, Form, Tabs, Input, Modal, Timeline, Icon, Select, Breadcrumb } from 'antd';
import React, {Component} from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BMap from 'BMap';
import BMapLib from 'BMapLib';
import RoadModal from '../../components/deviceDistribution/RoadModal';
import TfIcon from '../../components/common/TfIcon/index';
const FormItem = Form.Item;
const Option = Select.Option;

import styles from './index.less'
const endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
const startTime =new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime();
function tbHeightStyle() {
    let height = 0;
    const windowHeight = document.body.offsetHeight;
    const oTop = 80+40+44+10;
    height = windowHeight - oTop;
    return height;
}
class DeviceDistribution extends Component {
    constructor(props) {
        super(props);
        this.state={
            modalInfo: ''
        }
    }
    // componentDidMount() {
    //     const data = [{deviceCode: 123, longitude: 113, latitude: 30},{deviceCode: 345, longitude: 113.5, latitude: 30}]
    //     const modalOpen = (param) => {
    //         console.log('modalopen')
    //         this.setState({
    //             modalInfo: {
    //                 onCancel: this.onCancel,
    //                 onSubmit: (values)=>this.props.dispatch({
    //                     type: 'devicedistribution/queryRoad',
    //                     payload: values
    //                 }),
    //                 deviceCode: param
    //             }
    //         })
    //         this.props.dispatch({
    //             type: 'devicedistribution/queryRoad',
    //             payload: {deviceCode: param, startTime, endTime}
    //         })
    //     }
    //     const map = new BMap.Map("mapTrack");
    //     // 添加带有定位的导航控件
    //     var navigationControl = new BMap.NavigationControl({
    //         // 靠左上角位置
    //         anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
    //         // LARGE类型
    //         type: BMAP_NAVIGATION_CONTROL_LARGE,
    //         // 启用显示定位
    //         enableGeolocation: false
    //     });
    //     map.addControl(navigationControl);
    //     map.enableScrollWheelZoom();
    //     if (data && data.length) {
    //         // var point = new BMap.Point(120.246917, 30.24597);
    //         // var mk = new BMap.Marker(point);
    //         //添加标记点
    //         // map.addOverlay(mk);
    //         map.centerAndZoom(new BMap.Point(data[0].longitude, data[0].latitude), 6);

    //         for(var i=0;i < data.length;i++) {
    //             var point = new BMap.Point(data[i].longitude, data[i].latitude);
    //             var marker = new BMap.Marker(point)
    //             map.addOverlay(marker);

    //             var sContent = `<div style='padding: 10px'>`+`<p style='margin-bottom: 8px;font-size: 14px'><span style='letter-spacing: 9px'>设备名</span>称：${data[i].deviceName}</p>`+
    //             `<p style='margin-bottom: 8px;font-size: 14px'><span style='letter-spacing: 9px'>设备类</span>型：${data[i].iotDeviceTypeName}</p><p style='margin-bottom: 8px;font-size: 14px'><span style='letter-spacing: 56px'>状</span>态：${data[i].status}</p>`+
    //             `<p style='margin-bottom: 8px;font-size: 14px'>最近连接时间：${data[i].latestConnectDatetime}</p><p style='margin-bottom: 8px;font-size: 14px'><span style='letter-spacing: 56px'>位</span>置：${data[i].longitude},${data[i].latitude}</p>`+
    //             `<p style='margin-bottom: 8px;font-size: 14px'><span style='letter-spacing: 56px'>地</span>址：${data[i].address}</p>`+
    //             `<p style='margin: 15px;font-size: 16px;display: flex;justify-content: space-around'><a>详情</a><a id=${data[i].deviceCode}>轨迹</a></p>`
    //             +`</div>`

    //             addClickHandler(marker, sContent, data[i].deviceCode)
    //         }

    //         function addClickHandler(marker, sContent, param) {
    //             marker.addEventListener("click",function(e){
    //                 var p = e.target;
    //                 var singlepoint = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    //                 // var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象 
    //                 var infoWindow = new BMapLib.SearchInfoWindow(map,sContent,{
    //                     title: "设备编码："+param, //标题
    //                     width: 320, //宽度
    //                     height: 200, //高度
    //                     panel : "panel", //检索结果面板
    //                     enableAutoPan : true, //自动平移
    //                     searchTypes :[
    //                     ]
    //                 });
    //                 // map.openInfoWindow(infoWindow,singlepoint); //开启信息窗口
    //                 infoWindow.open(singlepoint)
    //                 setTimeout(() => {
    //                     document.getElementById(param) && document.getElementById(param).addEventListener('click', function(){
    //                         modalOpen(param);
    //                         console.log('oooooooo')
    //                     })
    //                 }, 0)
                    
    //             });
    //         }
    //     }
    // }
    componentDidMount() {
        console.log('firstxuanran')
        const map = new BMap.Map("mapTrack");
        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
            // 靠左上角位置
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: false
        });
        map.addControl(navigationControl);
        map.enableScrollWheelZoom();
        map.centerAndZoom(new BMap.Point(108, 36), 5);
    }
    componentDidUpdate(prevProps) {
        const { data } = this.props.devicedistribution;
        const toDetail = (param, param1, param2) => {
            const {history} = this.props;
            history.push(`/device?iotDeviceId=${param1}&deviceCode=${param}&iotProjectId=${param2}`);
        }
        if (prevProps.devicedistribution.data != data) {
            const modalOpen = (param) => {
                console.log('modalopen')
                this.setState({
                    modalInfo: {
                        onCancel: this.onCancel,
                        onSubmit: (values)=>this.props.dispatch({
                            type: 'devicedistribution/queryRoad',
                            payload: values
                        }),
                        deviceCode: param
                    }
                })
                this.props.dispatch({
                    type: 'devicedistribution/queryRoad',
                    payload: {deviceCode: param, startTime, endTime}
                })
            }
            const map = new BMap.Map("mapTrack");
            // 添加带有定位的导航控件
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: false
            });
            map.addControl(navigationControl);
            map.enableScrollWheelZoom();
            if (data && data.length) {
                let pointdata = data.filter(item => {
                     return item.longitude != null && item.latitude != null 
                })

                let markers = []
                // map.centerAndZoom(new BMap.Point(pointdata[0].longitude, pointdata[0].latitude), 5);
                map.centerAndZoom(new BMap.Point(108, 36), 5);
                // for(var i=0;i < pointdata.length;i++) {
                //     var point = new BMap.Point(pointdata[i].longitude, pointdata[i].latitude);
                //     var marker = new BMap.Marker(point)
                //     markers.push(marker)
                //     // map.addOverlay(marker);
                //     let pointAddress = '';
                //     var myGeo = new BMap.Geocoder();
                //     myGeo.getLocation(point, function(res){
                //         if (res) {
                //             console.log('mygeo', res)
                //           const {province, city, district, street, streetNumber} = res.addressComponents;
                //           pointAddress = province+city+district+street+streetNumber;
                //         }
                //     })
                //     var sContent = `<div style='padding: 10px'>`+`<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 18.6px'>设备名</span>称：</span><span style='color: #333'>${pointdata[i].deviceName || ''}</span></p>`+
                //     `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 18.6px'>设备类</span>型：</span><span style='color: #333'>${pointdata[i].deviceTypeName || ''}</span></p>`+
                //     `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>状</span>态：</span><span style='color: #333'>${pointdata[i].connected ? '在线' : '离线'}</span></p>`+
                //     `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 5.6px'>最近连接时</span>间：</span><span style='color: #333'>${pointdata[i].latestConnectDatetime ? moment(pointdata[i].latestConnectDatetime).format('YYYY-MM-DD HH:mm:ss') : ''}</span></p>`+
                //     `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'>最近上报数据时间：</span><span style='color: #333'>${pointdata[i].latestUploadDatetime ? moment(pointdata[i].latestUploadDatetime).format('YYYY-MM-DD HH:mm:ss') : ''}</span></p>`+
                //     `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>位</span>置：</span><span style='color: #333'>${pointdata[i].longitude || ''}${pointdata[i].longitude ? ',' : ''}${pointdata[i].latitude || ''}</span></p>`+
                //     `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>地</span>址：</span><span style='color: #333'>${pointdata[i].address || ''}</span></p>`+
                //     `<p style='margin: 15px;font-size: 16px;display: flex;justify-content: space-around'><a id=${pointdata[i].iotDeviceId}>详情</a><a id=${pointdata[i].deviceCode}>轨迹</a></p>`
                //     +`</div>`
    
                //     addClickHandler(marker, sContent, pointdata[i].deviceCode, pointdata[i].iotDeviceId, pointdata[i].iotProjectId)
                // }

                function renderContent(marker, point, address) {
                    // var sContent = `<div style='padding: 10px'>`+`<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 18.6px'>设备名</span>称：</span><span style='color: #333'>${point.deviceName || ''}</span></p>`+
                    // `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 18.6px'>设备类</span>型：</span><span style='color: #333'>${point.deviceTypeName || ''}</span></p>`+
                    // `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>状</span>态：</span><span style='color: #333'>${point.connected ? '在线' : '离线'}</span></p>`+
                    // `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 5.6px'>最近连接时</span>间：</span><span style='color: #333'>${point.latestConnectDatetime ? moment(point.latestConnectDatetime).format('YYYY-MM-DD HH:mm:ss') : ''}</span></p>`+
                    // `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'>最近上报数据时间：</span><span style='color: #333'>${point.latestUploadDatetime ? moment(point.latestUploadDatetime).format('YYYY-MM-DD HH:mm:ss') : ''}</span></p>`+
                    // `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>位</span>置：</span><span style='color: #333'>${point.longitude || ''}${point.longitude ? ',' : ''}${point.latitude || ''}</span></p>`+
                    // `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>地</span>址：</span><span style='color: #333'>${point.address || address || ''}</span></p>`+
                    // `<p style='margin: 15px;font-size: 16px;display: flex;justify-content: space-around'><a id=${point.iotDeviceId}>详情</a><a id=${point.deviceCode}>轨迹</a></p>`
                    // +`</div>`
    
                    addClickHandler(marker, point, point.deviceCode, point.iotDeviceId, point.iotProjectId)
                }
                
                // for循环阻塞解析到的地址字段反写，因而弃用
                let i = 0;
                // markers = pointdata.map(v=>{
                //     var point = new BMap.Point(v.longitude, v.latitude);
                //     var marker =new BMap.Marker(point)
                //     // let pointAddress = '';
                //     // if (isEmpty(v.address)) {
                //     //     var myGeo = new BMap.Geocoder();
                //     //     myGeo.getLocation(point, function(res){
                //     //         if (res) {
                //     //         const {province, city, district, street, streetNumber} = res.addressComponents;
                //     //         pointAddress = province+city+district+street+streetNumber;
                //     //         }
                //     //     })
                //     // } 
                //     // renderContent(marker, v, v.address);
                //     return marker
                // })
                // var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                function renderPoint() {
                    if (i < pointdata.length) {
                        var point = new BMap.Point(pointdata[i].longitude, pointdata[i].latitude);
                        var marker = new BMap.Marker(point)
                        markers.push(marker)
                        // map.addOverlay(marker);
                        let pointAddress = '';
                        if (!pointdata[i].address) {
                            // var myGeo = new BMap.Geocoder();
                            // myGeo.getLocation(point, function(res){
                            //     if (res) {
                            //     const {province, city, district, street, streetNumber} = res.addressComponents;
                            //     pointAddress = province+city+district+street+streetNumber;
                            //     renderContent(marker, pointdata[i], pointAddress)
                                
                            //     i += 1;
                            //     renderPoint();
                            //     }
                            // })

                            renderContent(marker, pointdata[i], pointAddress)
                            
                            i += 1;
                            renderPoint();
                        } else {
                            renderContent(marker, pointdata[i], pointAddress);
                            i += 1;
                            renderPoint();
                        }
                    } else {
                        var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                    }
                }

                renderPoint();

                function addClickHandler(marker, point, param, param1, param2) {
                    marker.addEventListener("click",function(e){
                        var p = e.target;
                        var singlepoint = new BMap.Point(p.getPosition().lng, p.getPosition().lat);

                        var myGeo = new BMap.Geocoder();
                        myGeo.getLocation(new BMap.Point(point.longitude, point.latitude), function(res){
                            if (res) {
                                const {province, city, district, street, streetNumber} = res.addressComponents;
                                let pointAddress = province+city+district+street+streetNumber;

                                var sContent = `<div style='padding: 10px'>`+`<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 18.6px'>设备名</span>称：</span><span style='color: #333'>${point.deviceName || ''}</span></p>`+
                                `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 18.6px'>设备类</span>型：</span><span style='color: #333'>${point.deviceTypeName || ''}</span></p>`+
                                `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>状</span>态：</span><span style='color: #333'>${point.connected ? '在线' : '离线'}</span></p>`+
                                `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 5.6px'>最近连接时</span>间：</span><span style='color: #333'>${point.latestConnectDatetime ? moment(point.latestConnectDatetime).format('YYYY-MM-DD HH:mm:ss') : ''}</span></p>`+
                                `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'>最近上报数据时间：</span><span style='color: #333'>${point.latestUploadDatetime ? moment(point.latestUploadDatetime).format('YYYY-MM-DD HH:mm:ss') : ''}</span></p>`+
                                `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>位</span>置：</span><span style='color: #333'>${point.longitude || ''}${point.longitude ? ',' : ''}${point.latitude || ''}</span></p>`+
                                `<p style='margin-bottom: 8px;font-size: 14px'><span style='color: #999'><span style='letter-spacing: 84px'>地</span>址：</span><span style='color: #333'>${pointAddress}</span></p>`+
                                `<p style='margin: 15px;font-size: 16px;display: flex;justify-content: space-around'><a id=${point.iotDeviceId}>详情</a><a id=${point.deviceCode}>轨迹</a></p>`
                                +`</div>`
                                
                                // var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象 
                                var infoWindow = new BMapLib.SearchInfoWindow(map,sContent,{
                                    title: "设备编码："+param, //标题
                                    width: 450, //宽度
                                    // height: 250, //高度
                                    panel : "panel", //检索结果面板
                                    enableAutoPan : true, //自动平移
                                    searchTypes :[
                                    ]
                                });
                                // map.openInfoWindow(infoWindow,singlepoint); //开启信息窗口
                                infoWindow.open(singlepoint)
                                setTimeout(() => {
                                    document.getElementById(param) && document.getElementById(param).addEventListener('click', function(){
                                        modalOpen(param);
                                        console.log('oooooooo')
                                    });
                                    document.getElementById(param1) && document.getElementById(param1).addEventListener('click', function(){
                                        toDetail(param,param1,param2);
                                        
                                    });
                                }, 0)
                            }
                        })

                        
                    });
                }
            } else {
                map.centerAndZoom(new BMap.Point(108, 36), 5);
            }
        }
    }

    onCancel = () => {
        this.setState({
            modalInfo: ''
        })
    }

    handleSubmit = () => {
        
        this.props.form.validateFields((err, values) => {
            if (err) {return}
            this.props.dispatch({
                type: "devicedistribution/query",
                payload: values
            })
        })
    }

    render() {
        const {form: {getFieldDecorator}, devicedistribution} = this.props;
        const {tagData, deviceData, roadData} = devicedistribution || {}
        const {modalInfo} = this.state;
        const formLayout = {
            style: {width: '100%'},
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        }
        const formLayout2 = {
            style: {width: '100%'},
            wrapperCol: {span: 24}
        }
        const formLayout3 = {
            style: {marginLeft: '20px'}
        }
        const Height =tbHeightStyle();
        return (
            
                <div className={styles.container}>
                    <Breadcrumb className={styles.crumb}>
                        <Breadcrumb.Item>
                            <TfIcon type="local" style={{color:'#0385ff'}}/>
                            <span>设备分布</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={styles.queryDiv}>
                        <Form layout='inline' style={{width: '100%'}}>
                            <Row>
                                <Col span={6}>
                            <FormItem label='设备类型' {...formLayout}>
                                {getFieldDecorator('iotDeviceTypeId', {
                                    
                                })(
                                        <Select allowClear={true}>
                                            {deviceData && deviceData.length && deviceData.map((item) => {
                                                return <Option value={item.iotDeviceTypeId} key={item.iotDeviceTypeId}>{item.deviceTypeName}</Option>
                                            })}
                                        </Select>
                                )}
                            </FormItem>
                            </Col>
                            <Col span={4}>
                            <FormItem label='标签' {...formLayout}>
                                {getFieldDecorator('iotTagId', {
                                    
                                })(
                                    <Select allowClear={true}>
                                            {tagData && tagData.length && tagData.map((item) => {
                                                return <Option value={item.iotTagId} key={item.iotTagId}>{item.tagName}</Option>
                                            })}
                                        </Select>
                                )}
                            </FormItem>
                            </Col>
                            <Col span={4}>
                            <FormItem label='状态' {...formLayout}>
                                {getFieldDecorator('connected', {
                                    
                                })(
                                        <Select allowClear={true}>
                                            <Option value='true' key={1}>在线</Option>
                                            <Option value='false' key={2}>不在线</Option>
                                        </Select>
                                )}
                            </FormItem>
                            </Col>
                            <Col span={5} offset={1}>
                            <FormItem {...formLayout2}>
                                {getFieldDecorator('keywords')(
                                        <Input placeholder='设备编码/业务编码/设备名称'/>
                                )}
                            </FormItem>
                            </Col>
                            <Col span={2}>
                            <FormItem {...formLayout3}>
                                    <Button type="primary" onClick={this.handleSubmit}>
                                        查询
                                    </Button>
                            </FormItem>
                            </Col>
                            </Row>
                        </Form>
                    </div>
                    <div id="mapTrack" className={styles.map} style={{minHeight:Height+'px'}}>
                    </div>
                    {
                        modalInfo ? <RoadModal {...modalInfo} roadData={roadData}/> : ''
                    }
                    
                </div>
            
        )
    }
}

export default connect(({devicedistribution}) => ({devicedistribution}))(Form.create()(DeviceDistribution))