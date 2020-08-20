import React, {Component} from 'react';
import {Modal, Form, Button, Row, Col, Table, Input, message} from 'antd';
import BMap from 'BMap';
import styles from './AddModal.less';
import {isEmpty} from 'lodash';
class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null,
            marker: null,
            inputAddress: this.props.inputAddress || '',
            lng: '',
            lat: '',
            address: '',
            province: '',
            city: '',
            district: ''
        };
        this.renderMap = this.renderMap.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount() {
        // const map = new BMap.Map("mapPoint");
        // map.enableScrollWheelZoom();
        // map.centerAndZoom(new BMap.Point(120.246917, 30.24597), 15);
        this.renderMap();
    }
    // shouldComponentUpdate(){
    //     return true;
    // }
    componentDidUpdate(prevProps) {
        if ((prevProps.editData != this.props.editData) && !isEmpty(this.props.editData)) {this.renderMap();}
    }
    // componentWillReceiveProps(nextProps) {
    //    // setTimeout(() => this.renderMap(), 0);
    // }
    onConfirm() {
        const {lng, lat, address, province, city, district} = this.state;
        if (!lng && !lat) {
            message.error('请选择地址');
        } else {
            this.props.onConfirm({latitude: lat, longitude: lng, detailAddress: address, province, city, region: district});
        }
    }
    onSearchChange(e) {
        const value = e.target.value || '';
        this.setState({
            inputAddress: value
        });
    }
    onSearch() {
        let that = this;
        const {map, inputAddress} = this.state;
        if (!inputAddress) {
            return;
        }
        map.clearOverlays();
        let local = new BMap.LocalSearch(map, {
            renderOptions: {
                map: map
            }
        });
        local.search(inputAddress);
        local.disableFirstResultSelection();
        local.setMarkersSetCallback(function(res) {
            if (res && res.length > 0) {
                res.forEach(function(item) {
                    item.marker.addEventListener("click", function() {
                        var geo = new BMap.Geocoder();
                        geo.getLocation(item.point, function(rt) {
                            const {
                                province,
                                city,
                                district,
                                street,
                                streetNumber
                            } = rt.addressComponents;
                            that.setState({
                                address: street + streetNumber + item.title,
                                lng: item.point.lng,
                                lat: item.point.lat,
                                province,
                                city,
                                district
                            });
                        });
                    });
                });
            }
        });
    }
    renderMap() {
        let that = this;
        const {editData} = this.props;
        let searchAddress = '';
        const map = new BMap.Map("mapPoint", {
            enableMapClick : false
            });
        map.addEventListener("click",

            function(e) {
                that.addPoint(e);
                map.closeInfoWindow();
            }
        )
        map.enableScrollWheelZoom();
        // map.centerAndZoom(new BMap.Point(120.246917, 30.24597), 12);        
        this.setState({map});
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
        var geolocation = new BMap.Geolocation();
        if(!isEmpty(editData)){
            if (editData.longitude && editData.latitude) {
                var point = new BMap.Point(editData.longitude, editData.latitude);
                var mk = new BMap.Marker(point);
                //添加标记点
                this.setState({
                    marker: mk
                });
                map.addOverlay(mk);
                // map.panTo(point);
                map.centerAndZoom(point, 12);
            } else {
                map.centerAndZoom(new BMap.Point(120.246917, 30.24597),6)
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
        // geolocation.getCurrentPosition(function(r) {
        //     // 尝试浏览器定位
        //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //         // var mk = new BMap.Marker(r.point);
        //         // map.addOverlay(mk);
        //         map.panTo(r.point);
        //         map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 12);
        //         // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        //     } else {
        //         // 根据IP定位
        //         var myCity = new BMap.LocalCity();
        //         myCity.get(function(result) {
        //             var cityName = result.name;
        //             map.setCenter(cityName);
        //         });
        //     }
        // }, {
        //     enableHighAccuracy: true
        // });
    }

    addPoint(e) {
        let that = this;
        const {map, marker} = this.state;
        if (marker) {
            map.removeOverlay(marker);
        }
        const customPt =e.point;
        const customMarker = new BMap.Marker(customPt);
        map.addOverlay(customMarker);
        customMarker.enableDragging();

        const geo = new BMap.Geocoder();
        geo.getLocation(customPt, function(res) {
            const {province, city, district, street, streetNumber} = res.addressComponents;
            const {dispatch} = that.props;
            that.setState({
                address: street + streetNumber,
                lng: customPt.lng,
                lat: customPt.lat,
                province,
                city,
                district
            });
            dispatch({
                type:'device/updateState',
                payload:{
                    addressPoint:{
                        address: street + streetNumber,
                        lng: customPt.lng,
                        lat: customPt.lat,
                        province,
                        city,
                        district
                    },
                    addressEditPoint:{
                        address: street + streetNumber,
                        lng: customPt.lng,
                        lat: customPt.lat,
                        province,
                        city,
                        district
                    }
                }
            })
        });
        customMarker.addEventListener("dragend", function(e) {
            geo.getLocation(e.point, function(res) {
                const {province, city, district, street, streetNumber} = res.addressComponents;
                const {dispatch} = that.props;
                that.setState({
                    address: street + streetNumber,
                    lng: e.point.lng,
                    lat: e.point.lat,
                    province,
                    city,
                    district
                });
                dispatch({
                    type:'device/updateState',
                    payload:{
                        addressPoint:{
                            address: street + streetNumber,
                            lng: e.point.lng,
                            lat: e.point.lat,
                            province,
                            city,
                            district
                        },
                        addressEditPoint:{
                            address: street + streetNumber,
                            lng: customPt.lng,
                            lat: customPt.lat,
                            province,
                            city,
                            district
                        }
                    }
                })
            });
        });
        this.setState({
            marker: customMarker
        });
    }
    render() {
        const {inputAddress, address, lng, lat, province, city, district} = this.state;
        //this.renderMap();
        return (
            <div>
                {/* <Row>
                    <Col span={20}>
                        <Input value={inputAddress} className={styles.mapSearchInput} onChange={this.onSearchChange} />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" style={{width: '100%'}} onClick={this.onSearch}>搜索</Button>
                    </Col>
                </Row> */}
                <div id="mapPoint" className={styles.mapWrap}></div>
            </div>
        );
    }
}

export default Address;
