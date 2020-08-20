import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {DatePicker, Row, Col, Icon} from 'antd';
import videojs, {Button} from 'video.js';
import Flash from 'videojs-flash';
import 'video.js/dist/video-js.css';
import styles from './VideoModal.less';
import CameraCtrl from './CameraCtrl';

const {RangePicker} = DatePicker;

class VideoModal extends Component {
     constructor(props) {
         super(props);
         this.state = {
             liveState: true,
             openState: false
         }
     }

     onClick = () => {
         this.props.onCancel();
     }

     playLive = () => {
         this.setState({
             liveState: true,
             openState: false
         })
         this.player.controlBar.playToggle.hide();
         this.menubut.show();
         this.ctrlButton.show();
         this.player.controlBar.playbackRateMenuButton.el_.setAttribute('style', 'display: none');
         this.menubut.menuButton_.el_.querySelectorAll('span')[0].innerHTML = '标清'
        
        this.player.src([
            {
                src:  this.props.videoUrl.hlsLive,
                type: 'application/x-mpegURL'
            }
        ])
     }

     playRiview = () => {
        this.setState({
            liveState: false,
            openState: true
        })
        this.controlbut.close();
     }

     onChange = (value) => {
         const {dispatch} = this.props;
        this.setState({
            openState: false
        })
        dispatch({
            type: 'device/getPlayBack',
            payload: {
                startTime: value[0].valueOf(),
                endTime: value[1].valueOf()
            }
        }).then((data) => {
            if(data && data.code === 0) {
                this.player.controlBar.playToggle.show();
                this.menubut.hide();
                this.ctrlButton.hide();
                this.player.controlBar.playbackRateMenuButton.el_.removeAttribute('style');
                this.player.src([
                           {
                               src:  data.data.address,
                               type: 'application/x-mpegURL'
                           }
                       ]) 
            } else {
                this.setState({
                    liveState: true,
                })
            }
        })
     }
     onOpen = () => {
         if(!this.state.openState) {
            this.setState({
                openState: true
            })
         }
     }

     render() {
         const {liveState, openState} = this.state;
         return(
             <div className={styles.videoPlayer}>
                <Row>
                    <Col span={2} offset={1} className={styles.channelChange} onClick={this.playLive}>
                        <div>
                            <img src={liveState?require('../../../assets/image/video/playSelected.png'):require('../../../assets/image/video/playBlur.png')} />
                            <span style={{color: liveState ? '#0289FF' : '#fff'}}>播放</span>
                        </div>
                    </Col>
                    <Col span={2} className={styles.channelChange} onClick={this.playRiview}>
                        <div>
                            <img src={liveState?require('../../../assets/image/video/reviewBlur.png'):require('../../../assets/image/video/reviewSelected.png')} />
                            <span style={{color: liveState ? '#fff' : '#0289ff'}}>回放</span>
                        </div>
                    </Col>
                    <Col span={17} style={{visibility: liveState ? 'hidden' : 'visible'}} className={styles.timePicker} onClick={this.onOpen}>
                        <RangePicker
                             open={openState}
                             showTime={{defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}}
                             allowClear={false}
                             format="YYYY-MM-DD HH:mm:ss"
                             onOk={this.onChange}
                             dropdownClassName={styles.timeModal}
                        ></RangePicker>
                    </Col>
                    <Col span={2} className={styles.closeIcon}>
                         <img src={require('../../../assets/image/video/closeVideo.png')} onClick={this.onClick}/>
                    </Col>
                    <Col span={24}>
                        <div data-vjs-player style={{width: '100%'}}>
                            <video ref={node => this.videoNode = node} width='100%' height='440px' className='video-js vjs-default-skin vjs-big-play-centered'>
                                
                            </video>
                        </div>
                    </Col>
                </Row>
             </div>
         )
    }

    componentDidMount() {
        const { videoUrl } = this.props;
            
            
                let videotype = '';
                if(videoUrl.hlsLive.indexOf('rtmp')>(-1)) {
                    videotype = [
                        {
                            src: videoUrl.hlsLive,
                            type: 'rtmp/flv'
                        },{
                            src: videoUrl.hlsLive,
                            type: 'rtmp/mp4'
                        }
                    ]
                } 
                else if(videoUrl.hlsLive.indexOf('m3u8')>(-1)) {
                    videotype = [
                        {
                            src: videoUrl.hlsLive,
                            type: 'application/x-mpegURL'
                        }
                    ]
                } 
                else {
                    videotype = [
                        {
                            src: videoUrl.hlsLive,
                            type: 'video/mp4'
                        },{
                            src: videoUrl.hlsLive, 
                            type: "video/webm"
                        },{
                            src: videoUrl.hlsLive, 
                            type: 'video/ogg'
                        }
                    ]
                }
                this.videoNode && (this.player = videojs(this.videoNode, {
                    autoplay: true,
                    controls: true,
                    bigPlayButton: false,
                    controlBar: {
                        volumePanel: false,
                    },
                    playbackRates: [0.5, 1, 1.5, 2],
                    
                    language: 'zh-CN',
                    techOrder: ['html5','flash'],
                    sources: videotype,
                }))
                
                this.player.controlBar.liveDisplay.el_.style = 'visibility: hidden';
                this.player.controlBar.playToggle.hide();   
                this.player.controlBar.playbackRateMenuButton.el_.style = 'display: none';

                const that = this;
                const MenuButton = videojs.getComponent('MenuButton')
                const MenuItem = videojs.getComponent('MenuItem');
                const Button = videojs.getComponent('Button');

                const ctrlImg = document.createElement('img');
                ctrlImg.className = styles.controlButton;
                ctrlImg.src = require('../../../assets/image/video/cameraCtrl.png');
                this.ctrlButton = new Button(this.player,{el: ctrlImg})
                this.player.controlBar.addChild(this.ctrlButton, {}, 14);
                
                const littlebut = document.createElement('div');
                ReactDOM.render(<CameraCtrl dispatch={this.props.dispatch} channelName={this.props.channelSelected.passName}/>, littlebut);
               
                class controlBut extends videojs.getComponent('Component') {
                    constructor(player, options) {
                        super(player, options);
                        this.opened = false;
                    }
                    createEl(){
                        return videojs.createEl('div', {
                            className: 'vjs-controlmodal vjs-hidden'
                        }, {}, littlebut)
                    }
                    open(){
                        console.log('hexielou')
                        this.show();
                        this.el().setAttribute('aria-hidden', 'false');
                        this.opened = true;
                    }
                    close(){
                        this.hide();
                        this.el().setAttribute('aria-hidden', 'true');
                        this.opened = false
                    }
                }
                videojs.getComponent('Component').registerComponent('controlBut', controlBut)
                this.controlbut = new controlBut(this.player)
                this.player.addChild(this.controlbut);
                this.ctrlButton.el_.onclick = function() {
                    if(that.controlbut.opened) {
                        that.controlbut.close();
                    } else {
                        that.controlbut.open()
                    }
                }
                
                this.menubut = new MenuButton(that.player, {createEl: true});
                
                this.player.controlBar.addChild(this.menubut,{},15);
                this.menubut.menuButton_.el_.querySelectorAll('span')[0].innerHTML = '标清'
                
                MenuItem.prototype.handleClick = function() {
                    if(this.options_.label == '高清') {
                        that.menubut.menuButton_.el_.querySelectorAll('span')[0].innerHTML = '高清'
                        that.player.src([
                            {
                                src:  videoUrl.hlsHD,
                                type: 'application/x-mpegURL'
                            }
                        ])
                    } else if (this.options_.label == '标清'){
                        that.menubut.menuButton_.el_.querySelectorAll('span')[0].innerHTML = '标清'
                        that.player.src([
                            {
                                src: videoUrl.hlsLive,
                                type: 'application/x-mpegURL'
                            }
                        ])
                    }
                    
                }
                const menuitem1 = new MenuItem(this.player, {label: '高清'})
                const menuitem2 = new MenuItem(this.player, {label: '标清'})
                
                this.menubut.menu.addChild(menuitem1)
                this.menubut.menu.addChild(menuitem2)
                
    }

    componentWillUnmount() {
        this.player && this.player.dispose();
    }
}

export default VideoModal;


