import { Button, Row, Col, Form,Input, Modal,Upload,Icon, Table } from 'antd';
import React, {Component} from 'react';
import videojs from 'video.js';
import Flash from 'videojs-flash';
import 'video.js/dist/video-js.css';
import moment from 'moment';
import styles from './EventModal.less';
import { getLocalTimeF } from '../../../utils/time';
import {imageUrl, stringTransform} from '../../../utils/common'
const {TextArea} =Input;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 10
    }
}
const formLayout1 = {
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 22
    },
    style: {
        marginBottom: 10
    }
}
class EventModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            previewVisible: false,
            previewImage: '',
        }
        this.videoNode = [];
        this.player = []
    }

    onOk (){
        const {form} = this.props;
        this.props.dispatch({
            type:'device/updateState',
            payload:{
                eventModal:false
            }
        })
    }
    handleCancel(){
        this.props.dispatch({
            type:'device/updateState',
            payload:{
                eventModal:false
            }
        })
    }
    handleImgCancel = () => this.setState({ previewVisible: false })
    
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            dispatch,
            eventDetailData
        } =  this.props;
        const { previewVisible, previewImage } = this.state;
        const { eventData, eventDescription, eventSource, eventTime, eventTypeName, image, video } = eventDetailData || {}
        // 初始化图片和视频URL
        // let fileList = [{
        //     uid: 1,
        //     name: '',
        //     status: 'done',
        //     url:  'http://pic.58pic.com/58pic/15/68/59/71X58PICNjx_1024.jpg' , 
        // },{
        //     uid: 1,
        //     name: '',
        //     status: 'done',
        //     url:  'http://pic1.nipic.com/2008-12-30/200812308231244_2.jpg' , 
        // },{
        //     uid: 1,
        //     name: '',
        //     status: 'done',
        //     url:  'http://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/lvpics/w=1000/sign=a669f57d3a12b31bc76cc929b628377a/503d269759ee3d6d801feef140166d224f4ade2b.jpg' ,
        // },{
        //     uid: 1,
        //     name: '',
        //     status: 'done',
        //     url:  'http://img.bimg.126.net/photo/31kQlCGP44-34Q5yxvoqmw==/5770237022569104952.jpg' , 
        // }];
        let fileList = ''
        image && (fileList = image.split(',http').map(item => {
            return {
                uid: 1,
                name: '',
                status: 'done',
                url:  item.indexOf('http')>-1 ? stringTransform(item) : stringTransform('http'+item),          
            }
        }))

        let patcharr = [];
        let tablepatch = eventData ? (eventData.length % 2) : 0;
        if(tablepatch) {
            patcharr.push(
                <Col span={12}>&nbsp;</Col>
            )
            
        }
        return (
            <div>
                {/* <Modal
                    width="900px"
                    maskClosable={false}
                    title="事件详情"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel.bind(this)}
                    okText={"关闭"}
                    cancelText={"取消"}
                    > */}
                    <Row>
                            <Col span={8}>
                                <FormItem {...formLayout} label="发生时间">
                                    {getLocalTimeF(eventTime)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formLayout} label="事件源">
                                    {eventSource || ''}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem {...formLayout} label="事件类型">
                                    {eventTypeName || ''}
                                </FormItem>
                            
                            </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formLayout1} label="事件内容">
                                {eventDescription || ''}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formLayout1} label="事件数据" className={styles.item}>
                            {
                                (eventData && eventData.length>0) ? <Row type="flex">
                                {(eventData || []).map(v=>{
                                    return <Col span={12}>
                                            {v.dataName || ''}：{v.dataValue || ''}
                                        </Col>
                                }).concat(patcharr)} </Row> : '暂无数据'
                            }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={styles.imgStyle}>
                        <Col>
                            <FormItem {...formLayout1} label="附件">
                                {(fileList && fileList.length) ? 
                                    (<div>
                                        <Upload 
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={this.handlePreview}
                                            >
                                        </Upload>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel} maskClosable={false}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>)
                                : ''}

                                {
                                    video && video.split(',').map((item,index) => {
                                        return (
                                            <div className={styles.videoDiv} key={index}>
                                                <div data-vjs-player>
                                                    <video ref={node => this.videoNode.push(node)} width='200px' height='200px' className='video-js vjs-default-skin vjs-big-play-centered'>
                                                        <p className='vjs-no-js'>暂不支持此种格式</p>
                                                    </video>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                {/* <div>
                                <div data-vjs-player>
                                    <video ref={node => this.videoNode = node} width='200px' height='200px' className='video-js vjs-default-skin vjs-big-play-centered'>
                                    </video>
                                </div>
                                </div> */}
                            </FormItem>
                        </Col>
                    </Row>
                {/* </Modal> */}
            </div>
        )
    }

    // componentWillUpdate() {
    //     this.videoNode = []
    // }

    componentDidUpdate(prevProps) {
        const { eventDetailData } = this.props;
        const { video } = eventDetailData || {}
        if(prevProps.eventDetailData.video != video) {
            let videoUrl = []
            video && (videoUrl = video.replace(/&amp;/g, "&").split(','))
            this.videoNode.length && (this.player = this.videoNode.map((item, index) => {
                let videotype = '';
                if(videoUrl[index].indexOf('rtmp')>(-1)) {
                    videotype = [
                        {
                            src: videoUrl[index],
                            type: 'rtmp/flv'
                        },{
                            src: videoUrl[index],
                            type: 'rtmp/mp4'
                        }
                    ]
                } 
                else if(videoUrl[index].indexOf('m3u8')>(-1)) {
                    videotype = [
                        {
                            src: videoUrl[index],
                            type: 'application/x-mpegURL'
                        }
                    ]
                } 
                else {
                    videotype = [
                        {
                            src: videoUrl[index],
                            type: 'video/mp4'
                        },{
                            src: videoUrl[index], 
                            type: "video/webm"
                        },{
                            src: videoUrl[index], 
                            type: 'video/ogg'
                        }
                    ]
                }
                return videojs(item, {
                    autoplay: videoUrl[index].indexOf('rtmp')>(-1)?true:false,
                    controls: true,
                    bigPlayButton: videoUrl[index].indexOf('rtmp')>(-1)?false:true,
                    // children: [ 'ControlBar','MediaLoader', 'LoadingSpinner', 'TextTrackDisplay', 'PlayToggle', 'FullscreenToggle', 'TextTrackSettings'],
                    controlBar: {
                        volumePanel: false,
                    },
                    language: 'zh-CN',
                    techOrder: ['html5','flash'],
                    sources: videotype
                })
            }))
        }
        
    }

    componentWillUnmount() {
        this.player && this.player.length && this.player.forEach(item => {
            item.dispose();
        })
    }
}


export default Form.create()(EventModal);