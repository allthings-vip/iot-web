import React, {Component} from 'react';

import { Form, Input, Row, Col, Modal, Button } from 'antd';
const FormItem = Form.Item;
import md5 from 'md5';

import { patternMobile, password, patterEmail } from '../../utils/verify';

class AppsecretrModal extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            verification: '获取验证码',
            btnCode: false
        }
    }

    onCancel = () => {
        this.props.onCancel()
    }
    onSubmit = () => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        this.props.form.validateFields((err, value) => {
            if (err) {return}
            delete value.mobile;
            //value.password = md5(value.password)
            this.props.getAppSecret({...value, iotProjectId})
        })
    }
    // 获取验证码
    getVerificatCode = () => {
        let i = 60;
        let that = this;

            that.setState({
                btnCode:true
            })
            that.props.dispatch({
                type: 'projectDetail/getCode',
            })

            let timer = setInterval(function(){
                i=i-1;
                if(i>0){
                    that.setState({
                        verification:i+'秒'
                    })
                } else if(i<=0){
                    clearInterval(timer);
                    that.setState({
                        verification:'重新获取',
                        btnCode:false
                    })
                }
            },1000);
    }
    render() {
        const that = this
        const {form: {getFieldDecorator}} = that.props;
        const formLayout = {
            style: {width: '100%', marginBottom:10},
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        }
        return (
            <div>
                <Modal
                    visible={true}
                    onOk={this.onCancel}
                    onCancel={this.onCancel}
                    title='获取AppSecret'
                >
                 <Form layout='horizontal'>
                     <Row>
                        <Col span={18}>
                            <FormItem label='手机号' {...formLayout}>
                                {getFieldDecorator('mobile',{
                                    initialValue: localStorage.getItem('mobilenumber') || ''
                                })(
                                    <Input disabled={true} placeholder='请确认手机号'
                                        addonAfter={
                                            <span onClick={this.state.btnCode?'':this.getVerificatCode} style={{cursor:'pointer'}}>{this.state.verification}</span>
                                        }
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={18}>
                            <FormItem {...formLayout} label="验证码" >
                                {getFieldDecorator('code', {
                                    rules :[
                                        { required: true, message: '请输入验证码' },]
                                    
                                })(
                                <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        {/* <Col span={18}>
                            <FormItem label='登录密码' {...formLayout}>
                                {getFieldDecorator('password', {
                                    rules: [{required: true,  message: '密码格式要求为6-20位字母和数字'}]
                                })(
                                    <Input type='password' placeholder='请输入密码'/>
                                )}
                            </FormItem>
                        </Col> */}
                        <Col span={6}>
                            <FormItem {...formLayout}>
                                <Button type='primary' onClick={this.onSubmit}>获取</Button>
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            &ensp;&ensp;AppSecret:&ensp;<span style={{color:'rgb(109, 138, 229)'}}>{this.props.data || ''}</span>
                        </Col>
                    </Row>
                 </Form>
                 </Modal>
            </div>
        )
    }

    componentDidMount() {
        
    }
}

AppsecretrModal = Form.create()(AppsecretrModal)

export default AppsecretrModal;

