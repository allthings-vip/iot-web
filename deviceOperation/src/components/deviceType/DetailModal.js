import { Button, Row, Col, Form,Input, Modal } from 'antd';
import styles from './DetailModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime,getLocalTimeF } from '../../utils/time';
import {deviceTypeStatus} from '../../utils/const'
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 12
    },
    style: {
        marginBottom: 10
    }
}
class DetailModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
    }
    componentDidMount() {
       
    }
    onOk (){
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            this.props.handleOk();
          });
    }
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            detailData
        } =  this.props;
        return (
            <div className={styles.detailModal}>
                <Modal
                    width="600px"
                    title="设备类型详情"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleOk}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk} className={styles.detailForm}>
                        <FormItem {...formLayout} label="设备类型编码">
                            <span>{detailData.deviceTypeCode || ''}</span>
                        </FormItem>
                        <FormItem {...formLayout} label="设备类型名称">
                            <span>{detailData.deviceTypeName || ''}</span>
                        </FormItem>
                        <FormItem {...formLayout} label="设备厂商">
                            <span>{detailData.manufacturer || ''}</span>
                        </FormItem>
                        <FormItem {...formLayout} label="设备接入协议">
                        <span>{detailData.protocolName || ''}</span>
                        </FormItem>
                        {/* <FormItem {...formLayout} label="链接服务器">
                        <span>{detailData.serverDomain || ''}{detailData.serverPort ? ':' + detailData.serverPort : ''}</span>
                        </FormItem> */}
                        <FormItem {...formLayout} label="所属标签">
                        <span>{(detailData.iotTags || []).map(v=>{
                            return v.tagName
                        }) || ''}</span>
                        </FormItem>
                        <FormItem {...formLayout} label="简介">
                        <span>{detailData.description || ''}</span>
                        </FormItem>
                        {/* <FormItem {...formLayout} label="测量因子">
                        <span>{(detailData.iotFactors || []).map(v=>{
                            return v.factorName
                        }).toString() || ''}</span>
                        </FormItem> */}
                        <FormItem {...formLayout} label="用户名">
                        <span>{detailData.username || ''}</span>
                        </FormItem>
                        <FormItem {...formLayout} label="创建时间">
                        <span>{ detailData.inputDate ? getLocalTimeF(detailData.inputDate) : ''}</span>
                        </FormItem>
                        {/* <FormItem {...formLayout} label="状态">
                        <span>{deviceTypeStatus.filter(item => item.value === detailData.status)[0].label}</span>
                        </FormItem> */}
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(DetailModal);