import { Button, Row, Col, Form,Input, Modal,Select } from 'antd';
import styles from './AddModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {verify} from '../../utils/verify'
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
class EditModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
    }
    componentDidMount() {
        
    }
    onOk (){
        const {form,elementData} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            fieldsValue.iotDataAggTypeId = elementData.iotDataAggTypeId || ''
            fieldsValue.iotFactorId = elementData.iotFactorId || ''
            this.props.handleOk(fieldsValue);
          });
    }
    render() {
        const {
            elementData,
            dataAggType,
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } =  this.props;
        return (
            <div>
                <Modal
                    width={"600px"}
                    title="编辑因子"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="因子代码">
                                {getFieldDecorator('factorCode', {
                                    initialValue: elementData.factorCode || '',
                                    rules: [{required: true, message: '因子代码不能为空'},{max: 30, message: '最多输入30个字符'}]
                                })(<Input disabled/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="因子名称">
                                {getFieldDecorator('factorName', {
                                    initialValue: elementData.factorName || '',
                                    rules: [{required: true, message: '因子名称不能为空'}, {min: 2, message: '最少输入2个字符'}, {max: 255, message: '最多输入255个字符'}]
                                })(<Input disabled/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="聚合类型">
                            {getFieldDecorator('iotDataAggTypeId', {
                                initialValue: elementData.iotDataAggTypeId || '',
                                rules: [{required: true, message: '聚合类型不能为空'}]
                                
                            })(
                                <Select size="default" showSearch placeholder="请填写设备类型" disabled>
                                {(dataAggType || []).map(v=>{
                                    return <Option value={v.iotDataAggTypeId}>{v.dataAggTypeName}</Option>
                                })}

                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="单位名称">
                            {getFieldDecorator('unitName', {
                                initialValue: elementData.unitName || '',
                                rules :[{max: 10, message: '最多输入10个字符'},]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="单位符号">
                            {getFieldDecorator('unitSymbol', {
                                initialValue: elementData.unitSymbol || '',
                                rules :[{max: 10, message: '最多输入10个字符'},]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(EditModal);