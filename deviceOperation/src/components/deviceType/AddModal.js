import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Checkbox,Select,message  } from 'antd';
import styles from './AddModal.less';
import React, {Component} from 'react';
import { getStampTime,getLocalTime } from '../../utils/time';
import {uploadUrl} from '../../utils/constant'
import moment from 'moment';
import {letterNumberLine,specialLetter,serviceAddress} from '../../utils/verify'
import {requestCsrfToken} from '../../utils/request'
const {TextArea} =Input;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 12
    },
    style: {
        marginBottom: 10
    }
}
const formLayout1 = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
    },
    style: {
        marginBottom: 10
    }
}
class AddModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            imageUrl:"",
            imageUpdateUrl: ''
        };
    }
    componentDidMount() {
       
    }
    onOk (){
        const {form} = this.props;

        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            console.log(fieldsValue);
            fieldsValue.imageUrl = this.state.imageUrl;
            // fieldsValue.iotTagIds = fieldsValue.iotTagIds.map(v=>{
            //     return v.key
            // })
            // fieldsValue.iotFactorIds = fieldsValue.iotFactorIds.map(v=>{
            //     return v.key
            // });
            // fieldsValue.iotProtocolId = fieldsValue.iotProtocolId.key;
            console.log(fieldsValue);
            //fieldsValue.iotProtocolId = fieldsValue.iotProtocolId.key;
            this.props.handleOk(fieldsValue);
          });
    }
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
        });
    }
    handleChange = ({ fileList }) => 
    {
        
        if(fileList.length>0){
            if(fileList[0].response){
                this.setState({ imageUrl:fileList[0].response.ret || '' })
                this.setState({fileList:fileList});
            }
        } else {
            this.setState({fileList:fileList});
        }
    }

    getCsrfToken = () => {
        // csrfToken
        requestCsrfToken(uploadUrl.uploadUrl).then(res => {
            if(res) {
                this.setState({imageUpdateUrl: res})
            } else {
                this.setState({imageUpdateUrl: ''})
            }
        })
    }
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            addData,
            factors,
            tags,
            protocols
        } =  this.props;
        const uploadButton = (
            <div onClick={this.getCsrfToken}>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
        );
        const { previewVisible, previewImage, fileList } = this.state;
        let that = this;
        const uploadProps = {

            onChange(info) {
                // self.setState({
                //     uploading: true,
                // });
                const {file} = info
                const isImage = info.file.name.indexOf('.jpg')>-1 || file.name.indexOf('.gif')>-1 || file.name.indexOf('.png')>-1 || file.name.indexOf('.bmp')>-1 || file.name.indexOf('.webp')>-1;    
                let fileSize = info.file.size / 1024 / 1024;
                if (!isImage || fileSize>5) {
                    that.setState({
                        imageUrl: '',
                        fileList:[],
                    });
                } else {
                    that.setState({
                        fileList:info.fileList,
                    });
                }
                if (info.file.status === 'done') {
                    if (info.file.response.code === 0) {
                        that.setState({
                            imageUrl:info.file.response.data || '',
                            fileList:info.fileList,
                        });
                        message.success(`${info.file.name} 上传成功！`);
                    } else {
                        that.setState({
                            imageUrl: '',
                            fileList:[],
                        });
                        message.error(info.file.response.message);
                    }
                } else if (info.file.status === 'error') {
                    that.setState({
                        imageUrl: '',
                        fileList:[],
                    });
                    message.error(`${info.file.name} 文件上传失败！`);
                } 
            },
            beforeUpload: (file) => {
                // const isEXCEL = (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                const isImage = file.name.indexOf('.jpg')>-1 || file.name.indexOf('.gif')>-1 || file.name.indexOf('.png')>-1 || file.name.indexOf('.bmp')>-1 || file.name.indexOf('.webp')>-1;    
                if (!isImage) {
                    that.setState({
                        imageUrl: '',
                        fileList:[],
                    });
                    message.error('图片上传失败,不支持的图片格式(仅支持jpg、gif、png、bmp、webp)');
                    return false;
                }
                const {name, size} = file;
                
                const fileSize = size / 1024 / 1024;
                if (fileSize > 5) {
                    message.error('图片文件不超过5M');
                    that.setState({
                        imageUrl: '',
                        fileList:[],
                    });
                    return false;
                }
                return true;
            }

        }
        return (
            <div>
                <Modal
                    width="800px"
                    title="新增设备类型"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="设备类型编码">
                                {getFieldDecorator('deviceTypeCode', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '设备类型编码不能为空'}, 
                                        {max: 32, message: '最多输入32个字符'},
                                        // {
                                        //     pattern: letterNumberLine,
                                        //     message: '请输入字母,数字,下划线'
                                        // }
                                    ]
                                })(<Input placeholder="请输入设备类型编码"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="设备类型名称">
                                {getFieldDecorator('deviceTypeName', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '设备类型名称不能为空'},
                                        {max: 32, message: '最多输入32个字符'},
                                        {
                                            pattern: specialLetter,
                                            message: '请输入合法字符'
                                        }
                                    ]
                                })(<Input placeholder="请输入设备类型名称"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="设备厂商">
                                {getFieldDecorator('manufacturer', {
                                    initialValue: '',
                                })(<Input placeholder="请输入设备厂商"/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="设备接入协议">
                            {getFieldDecorator('iotProtocolId', {
                                initialValue: '',
                                rules: [{required: true, message: '设备类型协议不能为空'}]
                            })(
                                <Select size="default"  placeholder="请填写设备类型" optionFilterProp="children" >
                                     {(protocols || []).map(v=>{
                                        return <Option value={v.iotProtocolId}>{v.protocolName}</Option>
                                     })}
                                </Select>
                            )}
                        </FormItem>
                        {/* <FormItem {...formLayout} label="所属标签">
                            {getFieldDecorator('iotTagIds', {
                                initialValue: [],
                                rules: [{required: true, message: '所属标签不能为空'}]
                            })(
                                <Select size="default" placeholder="请选择所属标签" optionFilterProp="children" mode="multiple"  labelInValue>
                                    {(tags || []).map(v=>{
                                        return <Option value={v.iotTagId} >{v.tagName}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem> */}
                        {/* <FormItem  {...formLayout} label="测量因子">
                            {getFieldDecorator('iotFactorIds', {
                                initialValue: [],
                                rules: [{required: true, message: '测量因子不能为空'}]
                            })(
                                <Select size="default" placeholder="请选择测量因子"  mode="multiple" labelInValue optionFilterProp="children">
                                    {(factors || []).map(v=>{
                                        return <Option value={v.iotFactorId}>{v.factorName}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="连接服务器" required>
                            <Row gutter={8}>
                                <Col span={18}>
                                    <FormItem>
                                        {getFieldDecorator('serverDomain', {
                                            rules: [
                                                { required: true, message: '请输入服务器地址' },
                                                {
                                                    pattern: serviceAddress ,
                                                    // [a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?
                                                    message: '请输入IP地址或域名'
                                                }
                                                
                                            ],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        {getFieldDecorator('serverPort', {
                                            rules: [
                                                { required: true, message: '请输入端口号' },
                                                {max: 65535, message: '最多输入3个字符'}],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem> */}
                        <FormItem {...formLayout} label="简介">
                            {getFieldDecorator('description', {
                                initialValue: '',
                                rule:[{
                                    max:200,
                                    message:'请输入200字以内的简介'
                                }]
                            })(
                                <TextArea placeholder="请输入500字以内的简介"  type="textarea" autosize={{ minRows: 4, maxRows: 6 }}/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout1} label="图片">
                            <span>图片推荐大小180*180</span>
                            {getFieldDecorator('imageUrl', {
                                initialValue:   [],
                                rules: [ ]
                            })(
                                <Upload
                                    {...uploadProps} 
                                    action={this.state.imageUpdateUrl || ''}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreview}
                                    >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            )}
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} maskClosable={false}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}


export default Form.create()(AddModal);