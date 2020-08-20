import React, {Component} from 'react';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

import { patternMobile, password, patterEmail } from '../../utils/verify';

class RegisterModal extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            verification: '获取验证码',
            btnCode: false
        }
    }

    getVerificatCode = () => {
        let i = 60;
        let that = this;

        that.props.form.validateFields(['mobile'], (err, value) => {
            if (!!err) {return}
            that.setState({
                btnCode:true
            })
            that.props.dispatch({
                type: 'login/getCode',
                payload: value
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
        })
    
        
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
                 <Form layout='horizontal'>
                     <Row>
                        <Col span={24}>
                            <FormItem label='用户名' {...formLayout}>
                                {getFieldDecorator('username1', {
                                    rules: [{required: true, message: '请输入用户名'}]
                                })(
                                    <Input placeholder='请输入'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='密码' {...formLayout}>
                                {getFieldDecorator('password1', {
                                    rules: [{required: true, pattern: password, message: '密码格式要求为6-20位字母和数字'}]
                                })(
                                    <Input type='password' placeholder='请输入密码'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='确认密码' {...formLayout}>
                                {getFieldDecorator('password2', {
                                    rules: [{required: true, pattern: password, message: '密码格式要求为6-20位字母和数字'}]
                                })(
                                    <Input type='password' placeholder='请确认密码'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='姓名' {...formLayout}>
                                {getFieldDecorator('realName',{
                                    rules: [{required: true, max:32, message: '请输入姓名'}]
                                })(
                                    <Input maxLength={32} placeholder='请输入姓名'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='手机号' {...formLayout}>
                                {getFieldDecorator('mobile', {
                                    rules: [{
                                        required: true,
                                        pattern: patternMobile,
                                        message: '请输入正确的手机号'
                                    }]
                                })(
                                    <Input placeholder='请确认手机号'
                                        addonAfter={
                                            <span onClick={this.state.btnCode?'':this.getVerificatCode} style={{cursor:'pointer'}}>{this.state.verification}</span>
                                        }
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...formLayout} label="验证码" >
                                {getFieldDecorator('code', {
                                    rules :[
                                        { required: true, message: '请输入验证码' },]
                                    
                                })(
                                <Input placeholder="请输入" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='邮箱' {...formLayout}>
                                {getFieldDecorator('email', {
                                    rules: [{pattern: patterEmail, message: '请输入正确的邮箱'}]
                                })(
                                    <Input placeholder='请输入邮箱地址'/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='公司名称' {...formLayout}>
                                {getFieldDecorator('companyName', {
                                    rules: [{required: true, max: 64, message: '请输入公司名称'}]
                                })(
                                    <Input maxLength={64} placeholder='请输入公司名称'/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                 </Form>
            </div>
        )
    }

    componentDidMount() {
        
    }
}

RegisterModal = Form.create()(RegisterModal)

export default RegisterModal;

