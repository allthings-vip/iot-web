import { Button, Row, Col, Form,Input, Modal,Select } from 'antd';

import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {password,letter,specialLetter} from '../../utils/verify'
import md5 from 'md5';
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
class UpdatePasswordModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            confirmDirty: false
        }
    }
    componentDidMount() {
        
    }
    onOk (){
        const {form,editData} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            //fieldsValue.password = md5(fieldsValue.password);
           // fieldsValue.newPassword = md5(fieldsValue.newPassword);
           // fieldsValue.password2 = md5(fieldsValue.password2);
           // delete fieldsValue.password1;
            this.props.dispatch({
                type:'app/updatePassword',
                payload:fieldsValue
            })
          });
    }
    handleCancel() {
        const {dispatch} = this.props;
        dispatch({
            type:'app/updateState',
            payload:{
                updatePasswordModal:false
            }
        })
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }
    
      compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
          callback('两次密码输入不一致，请重新输入');
        } else {
          callback();
        }
      }
    
      validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }    
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } =  this.props;
        return (
            <div>
                <Modal
                    width={"600px"}
                    title="修改密码"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel.bind(this)}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="原密码" >
                                {getFieldDecorator('password', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '原密码不能为空'}, 
                                        {
                                           // pattern: password,
                                           // message: '请输入6位-20位字母和数字'
                                        }
                                    ]
                                })(<Input  placeholder="6位-20位字母和数字" type="password"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="新密码" >
                                {getFieldDecorator('newPassword', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '新密码不能为空'}, 
                                        {   
                                            
                                            pattern: password,
                                            message: '请输入6位-20位字母和数字'
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        }
                                    ]
                                })(<Input  placeholder="6位-20位字母和数字" type="password"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="确认密码" >
                                {getFieldDecorator('password2', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '确认密码不能为空'}, 
                                        {   
                                            
                                            pattern: password,
                                            message: '请输入6位-20位字母和数字'
                                        },
                                         {
                                            validator: this.compareToFirstPassword,
                                          }
                                    ]
                                })(<Input  placeholder="6位-20位字母和数字" type="password" onBlur={this.handleConfirmBlur.bind(this)}/>)}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(UpdatePasswordModal);