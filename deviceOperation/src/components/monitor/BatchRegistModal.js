import { Button, Row, Col, Form,Input, Modal,Select,message } from 'antd';
import styles from './BatchRegistModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {letterNumberLine,specialLetter} from '../../utils/verify'
const FormItem = Form.Item;
const Option = Select.Option;
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
class BatchRegistModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }
    componentDidMount() {
        
    }
    onOk (){
        const {form,iotDeviceIds,selectItems} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            if(iotDeviceIds.length<=0){
                message.warn('请选择要注册的设备');
                return;
            }
            fieldsValue.iotDeviceIds = iotDeviceIds;
            fieldsValue.iotDeviceTypeId = fieldsValue.iotDeviceTypeId.key;
            fieldsValue.iotProjectId= fieldsValue.iotProjectId.key;
            this.props.dispatch({
                type:'monitor/batchRegist',
                payload:fieldsValue
            });
          });
    }
    handleCancel(){
        this.props.dispatch({
            type:'monitor/updateState',
            payload:{
                batchRegistModal:false
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
    }
    render() {
        const {
            projects,
            deviceTypesByProjectId,
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } =  this.props;
        return (
            <div>
                <Modal
                    width={"600px"}
                    title="批量注册"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        {/* <FormItem {...formLayout} label="所属项目" >
                                {getFieldDecorator('projectId', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '请选择所属项目'},
                                ]
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
                        </FormItem> */}
                        <FormItem {...formLayout} label="所属项目">
                            {getFieldDecorator('iotProjectId', {
                                    rules: [{required: true, message: '请选择所属项目'}]
                                })(
                                <Select 
                                    size="default" 
                                    showSearch 
                                    placeholder="请选择所属项目" 
                                    labelInValue 
                                    onChange={this.onProjectChange.bind(this)}
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
                                        rules: [{required: true, message: '请选择设备类型'}]
                                    })(
                                    <Select 
                                        size="default" 
                                        showSearch 
                                        placeholder="请选择设备类型" 
                                        labelInValue 
                                        optionFilterProp="children">
                                        {
                                            (deviceTypesByProjectId || []).map(v=>{
                                                return <Option value={v.iotDeviceTypeId}>{v.deviceTypeName}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(BatchRegistModal);