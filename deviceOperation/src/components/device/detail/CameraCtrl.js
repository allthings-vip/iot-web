import React, {Component} from 'react';
import {Row, Col, Icon} from 'antd';

import styles from './CameraCtrl.less';
import { stringTransform } from '../../../utils/common';

class CameraCtrl extends Component {
    constructor(props) {
        super(props);
    }

    onCameraCtrl = (command) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'device/cameraCtrl',
            payload: {
                 command,
                 speed: 1
            }
        })
        // .then(data => {
        //     if(data && data.code === 0) {
        //         console.log('hahahahkkkkk')
        //         this.onCameraStop()
        //     }
        // })
    }

    onCameraStop = () => {
        this.props.dispatch({
            type: 'device/cameraStop',
            payload: {

            }
        })
    }

    render() {
        return(
            <div className={styles.ctrlAll}>
                <div className={styles.ctrlTop}>
                    <span title={stringTransform(this.props.channelName)}> 云台 | {stringTransform(this.props.channelName)}</span>
                </div>
                <div className={styles.ctrlBottom}>
                    <div className={styles.ctrlButton} onClick={()=>this.onCameraCtrl(8)}>
                        <Icon type="plus" />
                    </div>
                    <div className={styles.ctrlBody}>
                        <Row style={{width: '90px'}}>
                            <Col span={8}>
                                <div className={styles.firstLeft} onClick={()=>this.onCameraCtrl(0)}><Icon type='left'/></div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.firstMiddle} onClick={()=>this.onCameraCtrl(6)}><Icon type='left'/></div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.firstRight} onClick={()=>this.onCameraCtrl(3)}><Icon type='left'/></div>
                            </Col>
                        </Row>
                        <Row style={{width: '90px'}}>
                            <Col span={8}>
                                <div className={styles.secondLeft} onClick={()=>this.onCameraCtrl(4)}><Icon type='left'/></div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.secondMiddle} onClick={this.onCameraStop}></div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.secondRight} onClick={()=>this.onCameraCtrl(7)}><Icon type='right'/></div>
                            </Col>
                        </Row>
                        <Row style={{width: '90px'}}>
                            <Col span={8}>
                                <div className={styles.thirdLeft} onClick={()=>this.onCameraCtrl(2)}><Icon type='left'/></div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.thirdMiddle} onClick={()=>this.onCameraCtrl(5)}><Icon type='left'/></div>
                            </Col>
                            <Col span={8}>
                                <div className={styles.thirdRight} onClick={()=>this.onCameraCtrl(1)}><Icon type='left'/></div>
                            </Col>
                        </Row>
                    </div>
                    <div className={styles.ctrlButton} onClick={()=>this.onCameraCtrl(9)}>
                        <Icon type="minus" />
                    </div>
                </div>
            </div>
        )
    }
}

export default CameraCtrl;