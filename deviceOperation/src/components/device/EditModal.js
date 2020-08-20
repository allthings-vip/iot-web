import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Checkbox,message,Select } from 'antd';
import styles from './AddModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import BMap from 'BMap';
import Address from './ChoseMap';
import {isEmpty} from 'lodash';
import {letterNumberLine,specialLetter} from '../../utils/verify'
import { isString } from 'zrender/lib/core/util';
const {TextArea} =Input;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
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
class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pointAddress: ''
        }
        this.onOk = this.onOk.bind(this);
    }
    componentDidMount() {
        this.props.dispatch({
            type:'device/getDeviceType'
        })
        this.props.dispatch({
            type:'device/queryTags'
        })
    }

    componentDidUpdate(prevProps) {
        const that = this;
        const {pointAddress} = that.state;
        const { editData } = this.props;
        if (!isEmpty(editData) && !this.state.pointAddress && !pointAddress && editData.longitude && editData.latitude) {
            
             var addresspoint = new BMap.Point(editData.longitude, editData.latitude);
             var myGeo = new BMap.Geocoder();
             myGeo.getLocation(addresspoint, function(res){
                  if (res) {
                    const {province, city, district, street, streetNumber} = res.addressComponents;
                    that.setState({pointAddress: province+city+district+street+streetNumber})
                  }
             })
        }
    }

    onOk (){
        const {form,editData,addressEditPoint} = this.props;
        form.validateFields((errors, fieldsValue) => {
            console.log(fieldsValue)
            if (errors) {
                return;
            }
            fieldsValue.iotDeviceId = editData.iotDeviceId;
            fieldsValue.iotProjectId = editData.iotProjectId || '';
            fieldsValue.iotDeviceTypeId = fieldsValue.iotDeviceTypeId.key || '';
            fieldsValue.iotTagIds = fieldsValue.iotTagIds.map(v=>{
                return v.key
            })
            fieldsValue.longitude = addressEditPoint.lng;
            fieldsValue.latitude = addressEditPoint.lat;
            this.props.handleOk(fieldsValue);
          });
    }
    onProjectChange =(item) =>{
        let iotProjectId = localStorage.getItem('iotProjectId');
        this.props.dispatch({
            type:'device/getDeviceTypeByProjectId',
            payload:{
                iotProjectId: iotProjectId
            }
        })
    }
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            editData,
            tags,
            deviceTypes,
            addressEditPoint,
            dispatch
        } =  this.props;
        const addressProps={
            dispatch,
            editData,
        }
        let { lng, lat } = addressEditPoint || {}
        // let address = editData.address;
        let address = ''
        if(addressEditPoint.lng ||  addressEditPoint.lat){
            address = addressEditPoint.province+addressEditPoint.city+addressEditPoint.district+addressEditPoint.address
            //address = addressPoint.province+addressPoint.city+addressPoint.district+addressPoint.address;
        } else {
        }
        lng = lng ? lng : editData.longitude;
        lat = lat ? lat : editData.latitude;
        
        
        return (
            <div>
                <Modal
                    width="1000px"
                    title="编辑设备"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Row>
                        <Col span={10}>
                        <Form>
                                {/* <FormItem {...formLayout} label="所属项目">
                                        {getFieldDecorator('iotProjectId', {
                                                initialValue:  {key: editData.iotProjectId || '', 
                                                label: projects.filter(item => item.iotProjectId === editData.iotProjectId).length>0 ? 
                                                projects.filter(item => item.iotProjectId === editData.iotProjectId)[0].projectName : ''
                                            },
                                                rules: [{required: true, message: '所属项目'}]
                                            })(
                                            <Select 
                                                size="default" 
                                                showSearch 
                                                placeholder="请选择所属项目"
                                                labelInValue
                                                onChange={this.onProjectChange.bind(this)}
                                                allowClear={true}
                                                optionFilterProp="children"
                                            >
                                                {
                                                    (projects || []).map(v=>{
                                                        return <Option value={v.iotProjectId}>{v.projectName}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem> */}
                                <FormItem {...formLayout} label="设备编码">
                                        {getFieldDecorator('deviceCode', {
                                            initialValue:  editData.deviceCode || '',
                                            rules: [{required: true, message: '设备ID不能为空'},{max: 64, message: '最多输入64个字符'}]
                                        })(<Input placeholder="请输入设备编码" disabled/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="业务编码">
                                        {getFieldDecorator('bizCode', {
                                            initialValue: editData.bizCode || '',
                                            rules: [
                                                {max: 64, message: '最多输入64个字符'},
                                                // {
                                                //     pattern: letterNumberLine,
                                                //     message: '请输入字母,数字,下划线'
                                                // }
                                            ]
                                        })(<Input placeholder="请输入厂商编码"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="设备名称">
                                        {getFieldDecorator('deviceName', {
                                            initialValue: editData.deviceName || '',
                                            rules: [{max: 64, message: '最多输入64个字符'},{
                                                pattern: specialLetter,
                                                message: '请输入合法字符'
                                            }]
                                        })(<Input  placeholder="请输入设备名称"/>)}
                                </FormItem>
                                <FormItem {...formLayout} label="设备类型">
                                        {getFieldDecorator('iotDeviceTypeId', {
                                                initialValue: {key: editData.iotDeviceTypeId || '',
                                                    label:editData.deviceTypeName || ''
                                                },
                                                rules: [{required: true, message: '设备类型'}]
                                            })(
                                            <Select 
                                                size="default" 
                                                placeholder="请选择设备类型"
                                                filterOption={() => true}
                                                labelInValue
                                                showSearch={true} 
                                                allowClear={true}
                                                optionFilterProp="children">
                                                {
                                                    (deviceTypes || []).map(v=>{
                                                        return <Option value={v.iotDeviceTypeId}>{v.deviceTypeName}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                                <FormItem {...formLayout} label="所属机构">
                                        {getFieldDecorator('agencyName', {
                                            initialValue: editData.agencyName || ''
                                        })(
                                            <Input  placeholder="请输入所属机构"/>
                                        )}
                                </FormItem>
                                <FormItem {...formLayout} label="所属标签">
                                    {getFieldDecorator('iotTagIds', {
                                        initialValue:(editData.iotTagIds || []).map(v=>{
                                            return {
                                                key:v,
                                                label: v
                                            }
                                        }),
                                    })(
                                        <Select size="default" placeholder="请选择所属标签" optionFilterProp="children" mode="multiple"  labelInValue>
                                            {(tags || []).map(v=>{
                                                return <Option value={v.iotTagId} key={v.iotTagId} >{v.tagName}</Option>
                                            })}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem {...formLayout} label="mac地址">
                                        {getFieldDecorator('mac', {
                                            initialValue: editData.mac || '',
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
                                            initialValue: editData.firmwareModel || '',
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
                                            initialValue: editData.firmwareVersion || '',
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
                                        initialValue: editData.description || '',
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
                                            经度<span>{lng || ''}</span>
                                            &nbsp;&nbsp;&nbsp;
                                            纬度<span>{lat || ''}</span>
                                        </span>
                                    </p>
                                    <p  style={{color:'#333'}}>
                                        地&nbsp;&nbsp;&nbsp;&nbsp;址：<span>{address || this.state.pointAddress}</span>
                                    </p>
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(EditModal);