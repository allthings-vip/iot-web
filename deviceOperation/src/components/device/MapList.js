/**
 *
 * @author 
 * @since 
 */
import { Button, Row, Col, Form, Tabs, Input, Modal, Timeline, Icon } from 'antd';
import styles from './MapList.less';
import React, {Component} from 'react';
import moment from 'moment';
import BMap from 'BMap';
import { getLocalTimeF } from '../../utils/time';
import lodash from 'lodash';
import {deviceStatus,deviceConnectStatus} from '../../utils/const';
const routeColors = ['#f00', '#999'];
const passedRouteColor = '#f00';
const unPassedRouteColor = '#999';

function tbHeightStyle() {
    let height = 0;
    const windowHeight = document.body.offsetHeight;
    const oTop = 46 + 30 + 37 + 16 + 60;
    height = windowHeight - oTop;
    return height;
}

function getPoint(lng, lat) {
    return new BMap.Point(lng, lat)
}

const mapHeight = tbHeightStyle();

class MapList extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }

    componentDidUpdate() {
        const {listMap} = this.props;
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
        //map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 12);
        let condictTime;
        // map.centerAndZoom(new BMap.Point(120.246917, 30.24597), 15);

        var aaa = new BMap.Geocoder();
        aaa.getLocation(new BMap.Point(120.246917, 30.24597), function(res) {
            //console.dir(res)
           // var point = new LatLng(res.point.lng, res.point.lat); 
        });
        //var point = new BMap.Point(120.246917, 30.24597);
        //console.log(listMap);
        // var point1 =  new BMap.Point(120.331398, 39.897445);
        let that = this;
        if(listMap&&listMap.length>0){
            listMap.forEach((v,index)=>{
                var point = new BMap.Point(v.longitude || 120.246917, v.latitude || 30.24597);
                var mk = new BMap.Marker(point);
                map.centerAndZoom(point, 12);
                //map.panTo(point);
                var opts = {    
                    width : 300,     // 信息窗口宽度    
                    title : ""  // 信息窗口标题   
                };   

                //时间中文化
                v.latestConnectDatetime = v.latestConnectDatetime ? getLocalTimeF(v.latestConnectDatetime) :'';

                //设置按钮隐显
                let statusC = v.status === "N" ? "<a style='margin-right:10px' id='enable"+v.iotDeviceId+"'>启用</a>" : "<a style='margin-right:10px' id='disable"+v.iotDeviceId+"'>停用</a></div>"
                let editC = "<a style='margin-right:10px' id='edit"+v.iotDeviceId+"'>编辑</a>"
                //状态转化中文化
                v.connectStatus = v.connectStatus && (deviceConnectStatus.filter(item=> item.value === v.connectStatus).length>0  ?
                deviceConnectStatus.filter(item=> item.value === v.connectStatus)[0].label : '') 
                
                const item = "<div style='font-size:16px'>"+
                    "<div style='margin-bottom:10px;background:#0289ff;padding:10px;color:#fff'><div  style='display:inline-block'>设备编码:</div>&nbsp;&nbsp;<div  style='display:inline-block;width:200px;word-break:break-all;vertical-align:text-top'>"+v.deviceCode+"</div></div>"+
                    "<div style='margin-bottom:10px;padding-left:10px'><span style='color:#888;text-align:right'>厂商编码:</span>&nbsp;&nbsp;"+v.supplierCode+"</div>"+
                    "<div style='margin-bottom:10px;padding-left:10px'><div  style='display:inline-block;color:#888'>设备名称:</div>&nbsp;&nbsp;<div  style='display:inline-block;width:200px;word-break:break-all;vertical-align:text-top'>"+v.deviceName+"</div></div>"+
                    "<div style='margin-bottom:10px;padding-left:10px'><div  style='display:inline-block;color:#888'>设备类型:</div>&nbsp;&nbsp;<div  style='display:inline-block;width:200px;word-break:break-all;vertical-align:text-top'>"+v.deviceTypeName+"</div></div>"+
                    "<div style='margin-bottom:10px;padding-left:10px'><span style='color:#888'>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;"+v.connectStatus+"</div>"+
                    "<div style='margin-bottom:10px;padding-left:10px'><span style='color:#888'>最近连接时间:</span>&nbsp;&nbsp;"+v.latestConnectDatetime+"</div>"+
                    "<div style='margin-bottom:10px;padding-left:10px'><span style='color:#888'>所在区域:</span>&nbsp;&nbsp;"+lodash.ceil(v.longitude,6)+","+lodash.ceil(v.latitude,6)+"</div>"+
                    "<div style='text-align:right;'><a style='margin-right:10px' href='/dosAdmin/#/device/detail?iotDeviceId="+v.iotDeviceId+"'>详情</a>"+
                    editC+statusC+ "</div>"
                //const item ="<div style='background:#ddd'><span>设备编码:</span>"+v.deviceCode+"</div>"+v.deviceCode

                //创建信息窗实体
                 let infoWindow = new BMap.InfoWindow(item, opts);
                
                //添加标记点
                map.addOverlay(mk);

                //鼠标移入标记点事件
                mk.addEventListener("mouseover", function(){     
                    let self = that;     
                    map.openInfoWindow(infoWindow, point);
                    let disableId = 'disable'+v.iotDeviceId;
                    let enableId = 'enable'+v.iotDeviceId;
                    let editId = 'edit'+v.iotDeviceId;
                    //监听编辑按钮
                    document.getElementById(editId) && document.getElementById(editId).addEventListener("click", function(){          
                        self.props.editDevice(v)
                    });
                    //监听停用按钮
                    document.getElementById(disableId) && document.getElementById(disableId).addEventListener("click", function(){          
                        self.props.dispatch({
                            type:'device/changeStatus',
                            payload:{
                                iotDeviceIds:[v.iotDeviceId],
                                status:0
                            }
                        })
                        
                    });
                    //监听启用按钮
                    document.getElementById(enableId) && document.getElementById(enableId).addEventListener("click", function(){          
                        self.props.dispatch({
                            type:'device/changeStatus',
                            payload:{
                                iotDeviceIds:[v.iotDeviceId],
                                status:1
                            }
                        })
                    });
                });
                
            })
        } else {
            var point = new BMap.Point(120.246917, 30.24597);
            map.centerAndZoom(point, 12);
        }
        
        
    }
    render() {
        return (
            <div>
                <div id="mapTrack" className={styles.mapWrap} style={{height: mapHeight + 'px',minHeight:'600px'}}></div>
            </div>
        )
    }
}


export default MapList;

