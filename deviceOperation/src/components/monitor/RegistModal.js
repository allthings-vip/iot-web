import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Checkbox,message,Select } from 'antd';
import styles from './RegistModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import BMap from 'BMap';
import Address from './ChoseMap';
import {letterNumberLine,specialLetter} from '../../utils/verify'
const Option = Select.Option;
const {TextArea} =Input;
const CheckboxGroup = Checkbox.Group;
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
        span: 4
    },
    wrapperCol: {
        span: 18
    },
    style: {
        marginBottom: 10
    }
}
const formLayout2 = {
    labelCol: {
        span: 0
    },
    wrapperCol: {
        span: 24
    },
    style: {
        marginBottom: 5
    }
}
class RegistModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    componentDidMount() {
        this.props.dispatch({
            type:'monitor/getProjectName'
        })
    }

    onOk (){
        const {form,addressPoint,selectItem} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            fieldsValue.longitude = addressPoint.lng;
            fieldsValue.latitude = addressPoint.lat;
            fieldsValue.deviceCode = selectItem.deviceCode;
            fieldsValue.iotDeviceId = selectItem.iotDeviceId;
            fieldsValue.iotProjectId = fieldsValue.iotProjectId.key || '';
            fieldsValue.iotDeviceTypeId = fieldsValue.iotDeviceTypeId.key || '';
            fieldsValue.iotTagIds = (fieldsValue.iotTagIds || []).map(v=>{
                return v.key
            }) || '';
            this.props.dispatch({
                type:'monitor/regist',
                payload:fieldsValue
            })
          });
    }
    handleCancel(){
        this.props.dispatch({
            type:'monitor/updateState',
            payload:{
                registModal:false
            }
        })
    }
    onProjectChange =(item) =>{
        this.props.dispatch({
            type:'monitor/getDeviceTypeByProjectId',
            payload:{
                iotProjectId: item.key
            }
        })
        this.props.dispatch({
            type:'monitor/getTags',
            payload:{
                iotProjectId: item.key
            }
        })
    }
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            projects,
            deviceTypesByProjectId,
            addressPoint,
            selectItem,
            tags,
            dispatch
        } =  this.props;
        const addressProps={
            dispatch,
        }
        return (
            <div>
                <Modal
                    width="1100px"
                    maskClosable={false}
                    title="注册设备"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    >
                    <Row>
                        <Col span={10}>
                            <Form>
                                <FormItem {...formLayout} label="设备编码">
                                        {getFieldDecorator('deviceCode', {
                                            initialValue: selectItem.deviceCode || '',
                                            rules: [
                                                {required: true, message: '设备ID不能为空'},
                                                {max: 64, message: '最多输入64个字符'},
                                            ]
                                        })(<Input placeholder="请输入设备编码" disabled/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="业务编码">
                                        {getFieldDecorator('bizCode', {
                                            initialValue: '',
                                            rules: [
                                                {max: 64, message: '最多输入64个字符'},
                                            ]
                                        })(<Input placeholder="请输入业务编码"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="设备名称">
                                        {getFieldDecorator('deviceName', {
                                            initialValue: '',
                                            rules: [{max: 64, message: '最多输入64个字符'},
                                            {
                                                pattern: specialLetter,
                                                message: '请输入合法字符'
                                            }]
                                        })(<Input  placeholder="请输入设备名称"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="所属项目">
                                        {getFieldDecorator('iotProjectId', {
                                                rules: [{required: true, message: '所属项目'}]
                                            })(
                                            <Select size="default" 
                                                showSearch 
                                                placeholder="请选择所属项目" 
                                                onChange={this.onProjectChange.bind(this)}
                                                labelInValue
                                                optionFilterProp="children">
                                                {
                                                    (projects || []).map(v=>{
                                                        return <Option value={v.iotProjectId}>{v.projectName}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                                <FormItem {...formLayout} label="设备类型">
                                        {getFieldDecorator('iotDeviceTypeId', {
                                                rules: [{required: true, message: '设备类型'}]
                                            })(
                                            <Select size="default" showSearch placeholder="请选择设备类型" labelInValue optionFilterProp="children">
                                                {
                                                    (deviceTypesByProjectId || []).map(v=>{
                                                        return <Option value={v.iotDeviceTypeId}>{v.deviceTypeName}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                                <FormItem {...formLayout} label="所属标签">
                                    {getFieldDecorator('iotTagIds', {
                                        initialValue: [],
                                    })(
                                        <Select size="default" placeholder="请选择所属标签" optionFilterProp="children" mode="multiple"  labelInValue>
                                            {(tags || []).map(v=>{
                                                return <Option value={v.iotTagId} >{v.tagName}</Option>
                                            })}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem {...formLayout} label="mac地址">
                                        {getFieldDecorator('mac', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    max:64,
                                                    message:'请输入64个以内的字符'
                                                }
                                            ]
                                        })(<Input  placeholder="请输入mac地址"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="固件型号">
                                        {getFieldDecorator('firmwareModel', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    max:64,
                                                    message:'请输入64个以内的字符'
                                                }
                                            ]
                                        })(<Input  placeholder="请输入固件型号"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="固件版本号">
                                        {getFieldDecorator('firmwareVersion', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    max:64,
                                                    message:'请输入64个以内的字符'
                                                }
                                            ]
                                        })(<Input placeholder="请输入固件版本号"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="备注">
                                    {getFieldDecorator('description', {
                                        initialValue: '',
                                        rules: [ {max: 200, message: '最多输入200个字符'}]
                                    })(
                                        <TextArea placeholder="请输入200字以内备注"  type="textarea" autosize={{ minRows: 3, maxRows: 6 }}/>
                                    )}
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={14}>
                            <FormItem {...formLayout2}>
                                <span  style={{color:'#181818'}}>地址选择：</span><span style={{color:'#888'}}>（请在地图上点击选择设置所在位置）</span>
                            </FormItem>
                            <FormItem {...formLayout2}>
                                <Address {...addressProps}/>
                            </FormItem>
                            <FormItem {...formLayout2}>
                                <p style={{color:'#333'}}>
                                    经纬度：
                                    <span>
                                        经度<span>{addressPoint.lng || ''}</span>
                                        &nbsp;&nbsp;&nbsp;
                                        纬度<span>{addressPoint.lat || ''}</span>
                                    </span>
                                </p>
                                <p  style={{color:'#333'}}>
                                    地&nbsp;&nbsp;&nbsp;&nbsp;址：<span>{addressPoint.province || ''}{addressPoint.city || ''}{addressPoint.district || ''}{addressPoint.address || ''}</span>
                                </p>
                            </FormItem>
                            
                        </Col>
                    </Row>
                    
                </Modal>
            </div>
        )
    }
}


export default Form.create()(RegistModal);