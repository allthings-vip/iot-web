import { Button, Row, Col, Form,Input, Modal,Select,message } from 'antd';

import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {letterNumberLine,specialLetter,username, patternMobile,patternTel,patterEmail,number6} from '../../utils/verify'
import { func } from 'prop-types';
import qs from 'qs';
import styles from './updateInfo.less'
import request from '../../utils/request';
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
const formLayout2 = {
    labelCol: {
        span: 0
    },
    wrapperCol: {
        span: 0
    },
    style: {
        marginBottom: 0
    }
}
class UpdateUserInfo extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            codeMsg:'获取验证码',
            btnCode:false
        }
    }
    componentDidMount() {
        
    }
    onOk (){
        const {form,userInfo} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            fieldsValue.iotUserId = userInfo.iotUserId || '',
            delete fieldsValue.username;
            delete fieldsValue.projectName;
            this.props.dispatch({
                type:'app/updateUserInfo',
                payload:fieldsValue
            })
            //this.props.handleOk(fieldsValue);
          });
    }
    handleCancel() {
        const {dispatch} = this.props;
        dispatch({
            type:'app/updateState',
            payload:{
                updateUserInfoModal:false
            }
        })
    }
    getCode(){
        const {form} = this.props;
        

        
        if(form.getFieldValue('mobile')&&patternMobile.test(form.getFieldValue('mobile'))){
           // let csrfType = +new Date() + '-' + Math.floor(Math.random() * Math.pow(10, 18)).toString(16);
            request('/dos/code/get',{
                method: 'get',
                body: qs.stringify({
                    mobile:form.getFieldValue('mobile')
                })
               
            }).then(data=> {
                if(data&&data.code === 0){
                    let i = 60;
                    let that = this;
                    that.setState({
                        btnCode:true
                    })
                    let timer = setInterval(function(){
                        i=i-1;
                        if(i>0){
                            that.setState({
                                codeMsg:i+'秒'
                            })
                        } else if(i<=0){
                            clearInterval(timer);
                            that.setState({
                                codeMsg:'重新获取',
                                btnCode:false
                            })
                        }
                    },1000);
                }
            })
            
        } else {
            message.error('手机号码输入有误请重新输入')
        }
    }
    checkUserName = (rule, value, callback) => {
        // if (username.test(value)){
        //     callback('用户名不能为1开头的11位数字');
        // } else if(username.test(value)){

        // }
        // callback();
        
    };
    render() {
        const {
            userInfo,
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } =  this.props;
        let editData = userInfo;
        let {btnCode} = this.state;
        
        return (
            <div>
                <Modal
                    width={"600px"}
                    title="更新用户信息"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel.bind(this)}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="用户名" >
                                {getFieldDecorator('username', {
                                    initialValue: editData.username || '',
                                    rules: [
                                        {max: 20, message: '请输入20个字符'},
                                        {required: true, message: '用户名不能为空'},
                                        {/* {validator: this.checkUserName} */}
                                ]
                                })(<Input  placeholder="请输入用户名" disabled/>)}
                        </FormItem>
                    
                        <FormItem {...formLayout} label="姓名">
                            {getFieldDecorator('realName', {
                                initialValue: editData.realName ||'',
                                rules :[{max: 16, message: '最多输入16个字符'},]
                            })(
                                <Input  placeholder="请输入姓名"/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="手机号"  className={btnCode ? styles.iptCode : styles.ipt} >
                            {getFieldDecorator('mobile', {
                                initialValue: '',
                                  rules :[
                                    { required: true, message: '请输入手机号' },
                                    { pattern:patternMobile,message: '请输入正确的号码',}
                                ]
                            })(
                            <Input  
                                placeholder="请输入手机号" 
                                addonAfter={
                                    <span onClick={btnCode ? '':this.getCode.bind(this) } style={{cursor:'pointer'}}>{this.state.codeMsg}</span>
                                }/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="验证码"  className={btnCode ? styles.iptCode : styles.ipt} >
                            {getFieldDecorator('code', {
                                initialValue: '',
                                  rules :[
                                    { required: true, message: '请输入验证码' },
                                    {max: 6, message: '请输入6位字符'},
                                    // { pattern:number6,message: '请输入6位数字',}
                                    ]
                                
                            })(
                            <Input placeholder="请输入验证码" />
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="邮箱">
                            {getFieldDecorator('email', {
                                initialValue: editData.email || '',
                                rules:[{
                                    pattern: patterEmail,
                                    message: '请输入正确的邮箱'
                                 }]
                            })(
                                <Input  placeholder="请输入邮箱"/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="公司名称" >
                            {getFieldDecorator('companyName', {
                                initialValue: editData.companyName || '',
                                rules: [{ required: true, message: '请输入公司名称' }],
                               
                            })(
                                <Input  placeholder="请输入公司名称"/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="拥有项目" >
                            {getFieldDecorator('projectName', {
                                initialValue: editData.iotProjects.map(v=>{
                                    return v.projectName
                                }).toString() || ''
                            })(
                                <Input.TextArea  autosize={true} disabled/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(UpdateUserInfo);