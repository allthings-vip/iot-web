import React, {Component} from 'react';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

import { patternMobile, patterEmail, patternPhoneOrTel } from '../../utils/verify';

class UserEdit extends React.Component {
    constructor(props) {
        super (props);
    }

    render() {
        const {form: {getFieldDecorator}} = this.props;
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
                                {getFieldDecorator('username')(
                                    <Input disabled={true} />
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
                             <Input placeholder='请确认手机号'/>
                         )}
                     </FormItem>
                     </Col>
                     <Col span={24}>
                     <FormItem label='邮箱' {...formLayout}>
                         {getFieldDecorator('email', {
                             rules: [{
                                pattern: patterEmail,
                                message: '请输入正确的邮箱'
                             }]
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
                     <Col span={24}>
                     <FormItem label='拥有项目' {...formLayout}>
                         {getFieldDecorator('project')(
                             <Input.TextArea autosize={true} disabled={true}/>
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

UserEdit = Form.create()(UserEdit)

export default UserEdit;

