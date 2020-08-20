import { Button, Row, Col, Form, Tabs, Input, Modal, Timeline, Icon, Select, DatePicker, message, Spin } from 'antd';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import BMap from 'BMap';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

import styles from './RoadModal.less'
import NullResult from '../NullResult';
const endDates = moment().clone().set({hour:23,minute:59});
const startDates = moment().clone().set({hour:0,minute:0});
class RoadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {spinning: false}
    }
    componentDidUpdate(prevProps) {
        const {roadData} = this.props;
        if (roadData.length <= 1) {
            if (prevProps.roadData == this.props.roadData) return;
            const maptrack = new BMap.Map("maptrack");
            // 添加带有定位的导航控件
            var navigationControlmodal = new BMap.NavigationControl({
                // 靠右上角位置
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_LARGE,
                // 启用显示定位
                enableGeolocation: false
            });
            maptrack.addControl(navigationControlmodal);
            maptrack.enableScrollWheelZoom();
            maptrack.centerAndZoom(new BMap.Point(107, 36),5);
            message.info('无历史轨迹数据')
            return;
        }
        if (prevProps.roadData == this.props.roadData) return;
        const maptrack = new BMap.Map("maptrack");
        // 添加带有定位的导航控件
        var navigationControlmodal = new BMap.NavigationControl({
            // 靠右上角位置
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: false
        });
        maptrack.addControl(navigationControlmodal);
        maptrack.enableScrollWheelZoom();
        // maptrack.centerAndZoom(new BMap.Point(120.246917, 30.24597),6)
        const that = this;
        // for(var i=0;i < roadData.length-1;i++) {
        //      var startPoint = new BMap.Point(roadData[i].longitude, roadData[i].latitude)
        //      var EndPoint = new BMap.Point(roadData[i+1].longitude, roadData[i+1].latitude)
        //     //  setTimeout(()=>{showPath(startPoint, EndPoint, i)},0)
        //      showPath(startPoint, EndPoint, i)
        // }
        // 加载中
        that.setState({spinning: true})
        // 防止渲染线程被阻塞
        let count = -1
        function creatPath(){
            count += 1;
            if (count < roadData.length-1){
                var startPoint = new BMap.Point(roadData[count].longitude, roadData[count].latitude)
                var EndPoint = new BMap.Point(roadData[count+1].longitude, roadData[count+1].latitude)
                showPath(startPoint, EndPoint, count)
                setTimeout(creatPath, 0)
            } else {
                that.setState({spinning: false})
            }
        }

        creatPath();
        // 绘制驾车路线
        function showPath(startPoint, EndPoint, i){
            if (i==0) {
                maptrack.centerAndZoom(startPoint,6)
                var trackDriving = new BMap.DrivingRoute(maptrack, { renderOptions: { map: maptrack, autoViewport: false }, onMarkersSet:function(routes) {
                        maptrack.removeOverlay(routes[1].marker);//删除终点
                    }
                });
            } else if (i==roadData.length-2) {
                var trackDriving = new BMap.DrivingRoute(maptrack, { renderOptions: { map: maptrack, autoViewport: false }, onMarkersSet:function(routes) {
                        maptrack.removeOverlay(routes[0].marker); //删除起点
                    }
                });
            } else {
                var trackDriving = new BMap.DrivingRoute(maptrack, { renderOptions: { map: maptrack, autoViewport: false}, onMarkersSet:function(routes) {
                        maptrack.removeOverlay(routes[0].marker); //删除起点
                        maptrack.removeOverlay(routes[1].marker);//删除终点
                    }
                });
            }
            
            trackDriving.search(startPoint, EndPoint);
        }
    
    }

    handleSubmit = () => {
       this.props.form.validateFields((err, values) => {
           if (err) return;
           let startTime = new Date(moment(values.time[0]).format('YYYY-MM-DD') + ' 00:00:00').getTime()
           let endTime = new Date(moment(values.time[1]).format('YYYY-MM-DD') + ' 23:59:59').getTime()
           if ((endTime - startTime)>(86400000*3)) {
               message.error('最大查询范围为3天');
               return;
           }
           values.startTime = moment(values.time[0]).valueOf()
           values.endTime =moment(values.time[1]).valueOf()
           delete values.time
           this.props.onSubmit(values);
       })
    }

    render() {
        const {form: {getFieldDecorator}, deviceCode, roadData} = this.props;
        const formLayout = {
            style: {width: '100%'},
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        }
        const formLayout1 = {
            style: {width: '100%'},
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        }
        // const formLayout2 = {
        //     style: {width: '100%'},
        //     wrapperCol: {span: 24}
        // }
        // const formLayout3 = {
        //     style: {width: '100%'},
        //     labelCol: {span: 12},
        //     wrapperCol: {span: 12}
        // }
        return (
            <div>
            <Modal 
                visible={true}
                width='900px'
                title='历史轨迹'
                footer={false}
                onCancel={this.props.onCancel}
                style={{top: '3%'}}
            >
                <div className={styles.container}>
                    <div className={styles.queryDiv}>
                        <Form layout='inline' style={{width: '100%'}}>
                            <Row>
                                <Col span={8}>
                            <FormItem label='设备编码' {...formLayout}>
                                {getFieldDecorator('deviceCode', {
                                    rules: [{required: true, message: '请输入设备编码'}],
                                    initialValue: deviceCode
                                })(
                                        <Input />
                                )}
                            </FormItem>
                            </Col>
                            <Col span={12}>
                            {/* <Row>
                                <Col span={16}>
                                    <FormItem label='时间' {...formLayout3}>
                                        {getFieldDecorator('startTime', {
                                            rules: [{required: true, message: '请选择时间'}]
                                        })(
                                                <DatePicker />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formLayout2}>
                                        {getFieldDecorator('endTime', {
                                            rules: [{required: true, message: '请选择时间'}]
                                        })(
                                                <DatePicker />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row> */}
                                <FormItem label='时间' {...formLayout1}>
                                    {getFieldDecorator('time', {
                                        rules: [{required: true, message: '请选择时间'}],
                                        initialValue: [startDates,endDates]
                                        })(
                                            <RangePicker size="default" showTime={{ format: 'HH:mm' }} format={'YYYY-MM-DD HH:mm'} placeholder={['开始', '截止']}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={3} offset={1}>
                            <FormItem>
                                    <Button type="primary" onClick={this.handleSubmit}>
                                        查询
                                    </Button>
                            </FormItem>
                            </Col>
                            </Row>
                        </Form>
                    </div>
                    <Spin spinning={this.state.spinning} tip='正在加载历史轨迹，请稍候'>
                    <div id="maptrack" className={styles.map}>
                    </div>
                    </Spin>
                </div>
            </Modal>
            </div>
        )
    }
}

 RoadModal=Form.create()(RoadModal)

export default RoadModal