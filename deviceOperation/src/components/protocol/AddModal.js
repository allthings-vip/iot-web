import { Button, Row, Col, Form,Input, Modal,Select } from 'antd';
import styles from './AddModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {isNumber ,letterNumberLine,specialLetter,serviceAddress,serverDomain} from '../../utils/verify'
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} =Input;
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
 
    }
    onOk (){
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            console.log(fieldsValue)
            this.props.handleOk(fieldsValue);
        });
    }
    checkPort = (rule, value, callback) => {
        if (value>65535){
            callback('输入有误');
        }
        callback();
        
    };
    render() {
        const {
            factors,
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } =  this.props;
        return (
            <div>
                <Modal
                    width={"800px"}
                    title="新增协议类型"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="协议类型编码" >
                            {getFieldDecorator('protocolCode', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: '协议类型编码不能为空'},
                                    {max: 64, message: '最多输入64个字符'},
                                    {
                                        pattern: letterNumberLine,
                                        message: '请输入字母,数字,下划线'
                                    }
                            ]
                            })(<Input  placeholder="请输入字母,数字,下划线"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="协议类型名称">
                            {getFieldDecorator('protocolName', {
                                initialValue: '',
                                rules: [
                                    {required: true, message: '因子代码不能为空'},
                                    {max: 30, message: '最多输入32个字符'}, 
                                ]
                            })(<Input  placeholder="请输入协议类型名称"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="正式连接服务器" required  className={styles.port}>
                            <Row gutter={8}>
                                <Col span={9}>
                                    <FormItem>
                                        {getFieldDecorator('serverIp', {
                                            rules: [
                                                { required: true, message: '请输入IP' },
                                                {
                                                    pattern: serviceAddress ,
                                                    // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                    message: '请输入IP'
                                                }
                                                
                                            ],
                                        })(
                                            <Input   placeholder="请输入IP"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={9}>
                                    <FormItem>
                                        {getFieldDecorator('serverDomain', {
                                            rules: [
                                                { required: true, message: '请输入域名' },
                                                {
                                                    pattern: serverDomain ,
                                                    // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                    message: '请输入正确域名'
                                                }]
                                        })(
                                            <Input placeholder="请输入域名"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        {getFieldDecorator('serverPort', {
                                            rules: [
                                            { required: true, message: '端口号'},
                                            {
                                                pattern: /^[0-9]*$/ ,
                                                // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                message: '请输入数字'
                                            },
                                            {validator: this.checkPort}]
                                            ,
                                        })(
                                            <Input placeholder="端口号"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...formLayout} label="测试连接服务器" required  className={styles.port}>
                            <Row gutter={8}>
                                <Col span={9}>
                                    <FormItem>
                                        {getFieldDecorator('testServerIp', {
                                            rules: [
                                                { required: true, message: '请输入IP' },
                                                {
                                                    pattern: serviceAddress ,
                                                    // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                    message: '请输入IP'
                                                }
                                                
                                            ],
                                        })(
                                            <Input   placeholder="请输入IP"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={9}>
                                    <FormItem>
                                        {getFieldDecorator('testServerDomain', {
                                            rules: [
                                                { required: true, message: '请输入域名' },
                                                {
                                                    pattern: serverDomain ,
                                                    // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                    message: '请输入正确域名'
                                                }
                                                ],
                                        })(
                                            <Input placeholder="请输入域名"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        {getFieldDecorator('testServerPort', {
                                            rules: [
                                                { required: true, message: '端口号'},
                                                {validator: this.checkPort},
                                                {
                                                    pattern: /^[0-9]*$/ ,
                                                    // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                    message: '请输入数字'
                                                },
                                            ],
                                        })(
                                            <Input placeholder="端口号"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...formLayout} label="测量因子">
                                {getFieldDecorator('iotFactorIds', {
                                    initialValue: [],
                                    rules: [{required: true, message: '测量因子不能为空'}]
                                })(
                                    <Select size="default" placeholder="请选择测量因子"  mode="multiple" optionFilterProp="children">
                                        {(factors || []).map(v=>{
                                            return <Option value={v.iotFactorId}>{v.factorName}</Option>
                                        })}
                                    </Select>
                                )}
                        </FormItem>
                        <FormItem {...formLayout} label="备注">
                            {getFieldDecorator('description', {
                                initialValue: '',
                                rule:[{
                                    max:500,
                                    message:'请输入500字以内的备注'
                                }]
                            })(
                                <TextArea placeholder="请输入500字以内的备注"  type="textarea" autosize={{ minRows: 4, maxRows: 6 }}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(AddModal);