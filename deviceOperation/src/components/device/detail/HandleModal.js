import { Button, Row, Col, Form,Input, Modal,Upload,Icon } from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
const {TextArea} =Input;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 10
    }
}
const formLayout1 = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 10
    }
}
class HandleModal extends Component {
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
            fieldsValue.iotDeviceEventId = this.props.iotDeviceEventId;
            this.props.dispatch({
                type:'device/handleEvent',
                payload:fieldsValue
            })
          });
    }
    handleCancel(){
        this.props.dispatch({
            type:'device/updateState',
            payload:{
                eventModal:false
            }
        })
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
                    width="600px"
                    maskClosable={false}
                    title="事件处理"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.handleCancel.bind(this)}
                    okText={"确定"}
                    cancelText={"取消"}
                    >
                    <Row>
                        <Col>
                            <Form onSubmit={this.onOk.bind(this)}>
                                <FormItem {...formLayout} label="处理说明">
                                    {getFieldDecorator('description', {
                                        initialValue: '',
                                        rules: [ {max: 200, message: '最多输入200个字符'}]
                                    })(
                                        <TextArea placeholder="请输入200字以内备注"  type="textarea" autosize={{ minRows: 3, maxRows: 6 }}/>
                                    )}
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(HandleModal);