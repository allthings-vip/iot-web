import { Button, Row, Col, Form,Input, Modal,Select } from 'antd';
import styles from './AddModal.less';
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
class AddModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
    }
    componentDidMount() {
        this.props.dispatch({
            type:'project/queryDataAggType',
            payload:{
                // projectName: value,
                // pageIndex: Page.pageIndex,
                // pageSize: Page.pageSize
            }
        })
        
    }
    onOk (){
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            fieldsValue.iotDataAggTypeId = fieldsValue.iotDataAggTypeId.key || ''
            this.props.handleOk(fieldsValue);
          });
    }
    render() {
        const {
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
                    title="新增因子"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="因子代码" >
                                {getFieldDecorator('factorCode', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '因子代码不能为空'},
                                        {max: 100, message: '最多输入100个字符'}, 
                                        {
                                            pattern: letterNumberLine,
                                            message: '请输入字母,数字,下划线'
                                        }
                                ]
                                })(<Input  placeholder="请输入字母,数字,下划线"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="因子名称" >
                                {getFieldDecorator('factorName', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '因子名称不能为空'}, 
                                        {max: 32, message: '最多输入32个字符'},
                                        {
                                            pattern: specialLetter,
                                            message: '输入不合法'
                                        }
                                    ]
                                })(<Input  placeholder="最多输入32个字符"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="聚合类型">
                            {getFieldDecorator('iotDataAggTypeId', {
                                initialValue: '',
                                rules: [{required: true, message: '聚合类型不能为空'}]
                                
                            })(
                                <Select 
                                size="default" 
                                placeholder="请填写聚合类型"
                                filterOption={() => true}
                                labelInValue
                                optionFilterProp="children"
                                showSearch={true} 
                                allowClear={true}>
                                    {(dataAggType || []).map(v=>{
                                        return <Option value={v.iotDataAggTypeId}>{v.dataAggTypeName}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="单位名称">
                            {getFieldDecorator('unitName', {
                                initialValue: '',
                                rules :[{max: 10, message: '最多输入10个字符'},]
                            })(
                                <Input  placeholder="请输入单位名称"/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="单位符号">
                            {getFieldDecorator('unitSymbol', {
                                initialValue: '',
                                rule:[{
                                    max:10,
                                    message:'最多输入10个字符'
                                }]
                            })(
                                <Input  placeholder="请输入单位符号"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(AddModal);