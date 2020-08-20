import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Checkbox,message,Select } from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
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
        width: '100%',
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
class OpsAddModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
    }

    onOk = ()=>{
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }

            this.props.dispatch({
                type: 'opsmonitor/addService',
                payload: {
                    ...fieldsValue
                }
            });
          });
    }

    handleCancel = () => {
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                addModal: false
            }
        });
    }

    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            dispatch
        } =  this.props;
        
        return (
            <div>
                <Modal
                    width="700px"
                    maskClosable={false}
                    title="新增服务"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    >
                    <Form layout='horizontal'>
                     <Row>
                        <Col span={24}>
                            <FormItem label='服务名称' {...formLayout}>
                                {getFieldDecorator('serviceName', {
                                    rules: [{required: true, message: '请输入服务名称'}]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='IP地址' {...formLayout}>
                                {getFieldDecorator('ip', {
                                    rules: [{required: true, message: '请输入IP地址'}]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='端口' {...formLayout}>
                                {getFieldDecorator('port', {
                                    rules: [{required: true, message: '请输入端口号'}]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='依赖的外部服务' {...formLayout}>
                                {getFieldDecorator('dependencyService',{
                                    
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='服务所属层' {...formLayout}>
                                {getFieldDecorator('levels',{
                                    rules: [{required: true, message: '请输入服务所属层'}]
                                })(
                                    <Select>
                                        <Option key='1' value={1}>应用使能层</Option>
                                        <Option key='2' value={2}>设备接入层</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                 </Form>
                    
                </Modal>
            </div>
        )
    }
}


export default Form.create()(OpsAddModal);