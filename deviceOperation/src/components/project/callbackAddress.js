import React, {Component} from 'react';

import { Form, Input, Row, Col, Modal, Button } from 'antd';
const FormItem = Form.Item;
import md5 from 'md5';

import { patternMobile, password, patterEmail } from '../../utils/verify';

class AddressModal extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            verification: '获取验证码',
            btnCode: false
        }
    }

    onCancel = () => {
        this.props.dispatch({
            type: 'projectDetail/updateState',
            payload: {
                addressModal: false
            }
        })
    }
    onOk = () => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        this.props.form.validateFields((err, value) => {
            if (err) {return}
            this.props.dispatch({
                type: 'projectDetail/saveCallbackAddress',
                payload: {...value, iotProjectId}
            })
            this.onCancel();
        })
    }
    
    render() {
        const that = this
        const {form: {getFieldDecorator}, data} = that.props;
        const formLayout = {
            style: {width: '100%', marginBottom:10},
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        }
        return (
            <div>
                <Modal
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    title='事件回调地址'
                >
                 <Form layout='horizontal'>
                     <Row>
                        <Col span={18}>
                            <FormItem label='回调地址' {...formLayout}>
                                {getFieldDecorator('pushUrl',{
                                    initialValue: data || ''
                                })(
                                    <Input placeholder='请输入接收事件的回调地址' />
                                )}
                            </FormItem>
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

AddressModal = Form.create()(AddressModal)

export default AddressModal;

