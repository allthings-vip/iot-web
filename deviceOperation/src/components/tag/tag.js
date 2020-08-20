import React, {Component} from 'react';

import { Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;


class TagAdd extends React.Component {
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
                            <FormItem label='标签' {...formLayout}>
                                {getFieldDecorator('tagName',{
                                    rules: [{required: true, message: '请输入标签名称'}]
                                })(
                                    <Input maxLength={32}/>
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

TagAdd = Form.create()(TagAdd)

export default TagAdd;

