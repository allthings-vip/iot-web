import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Checkbox,Select,message  } from 'antd';
import styles from './AddModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {uploadUrl} from '../../utils/constant'
import {imageUrl} from '../../utils/common'
import {letterNumberLine,specialLetter} from '../../utils/verify'
import {requestCsrfToken} from '../../utils/request'
const {TextArea} =Input;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
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
class EditModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            previewVisible: false,
            previewImage: '',
            imageUrl: this.props.editData.imageUrl,
            fileList: this.props.editData.imageUrl ? [{
                uid: 1,
                name: '',
                status: 'done',
                url:  imageUrl+ this.props.editData.imageUrl ,          
            }] : [],
            imageUpdateUrl: ''
        };
    }
    componentDidMount() {
       
    }
    onOk (){
        const {form,editData} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            console.log(fieldsValue)
            fieldsValue.imageUrl = this.state.imageUrl;
            //fieldsValue.imageUrl = fieldsValue.imageUrl.length>0 ? fieldsValue.imageUrl[0].url : '';
            fieldsValue.iotDeviceTypeId = editData.iotDeviceTypeId;
            // fieldsValue.iotFactorIds = (fieldsValue.iotFactorIds || []).map(v=>{
            //     return v.iotTagId
            // });
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
    handleChange = (info) => 
    {
         console.log(info);
        const {file,fileList} = info;
        let that = this;
        if (file.status === 'done') {
            const res = file.response;
            if (res && res.rc === 0) {
                const imageUrl = res.ret;
                if (imageUrl) {
                    that.setState({
                        imageUrl,
                        fileList:fileList
                    })
                }
            }
        } else if (file.status === 'error') {
            message.error('上传失败');
            that.setState({
                imageUrl: '',
                fileList:{}
            });
        }
        
        if(fileList.length>0){
            if(fileList[0].response){
                if(fileList[0].response.rc == 0){
                    this.setState({ imageUrl:fileList[0].response.ret || '' });
                    this.setState({fileList:fileList});
                } 
                
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
            editData,
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
        // let factors = (editData.iotFactors || []).map((ele) => ({
        //     label: `${ele.iotFactorName}`,
        //     value: `${ele.iotFactorId}`
        // }));
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
                    title="编辑设备类型"
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
                                    initialValue: editData.deviceTypeCode,
                                    rules: [{required: true, message: '设备类型编码不能为空'}, {max: 255, message: '最多输入255个字符'}]
                                })(<Input disabled/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="设备类型名称">
                                {getFieldDecorator('deviceTypeName', {
                                    initialValue: editData.deviceTypeName,
                                    rules: [{required: true, message: '设备类型名称不能为空'},
                                    {max: 32, message: '最多输入32个字符'},
                                    {
                                        pattern: specialLetter,
                                        message: '请输入合法字符'
                                    }]
                                })(<Input/>)}
                        </FormItem>
                        <FormItem {...formLayout} label="设备厂商">
                                {getFieldDecorator('manufacturer', {
                                    initialValue: editData.manufacturer || '',
                                })(<Input />)}
                        </FormItem>
                        <FormItem {...formLayout} label="设备接入协议">
                            {getFieldDecorator('iotProtocolId', {
                                initialValue: editData.iotProtocolId  || '',
                                rules: [{required: true, message: '请选择设备接入协议'}]
                            })(
                                <Select size="default"  placeholder="请填写设备类型" disabled>
                                     {(protocols || []).map(v=>{
                                        return <Option value={v.iotProtocolId} key={v.iotProtocolId} labelInValue>{v.protocolName}</Option>
                                     })}
                                </Select>
                            )}
                        </FormItem>
                        {/* <FormItem {...formLayout} label="所属标签">
                            {getFieldDecorator('iotTagIds', {
                                initialValue:  (editData.iotTags || []).map(v=>{
                                    return v.iotTagId
                                }),
                                rules: [{required: true, message: '所属标签不能为空'}]
                            })(
                                <Select size="default" placeholder="请选择所属标签"  mode="multiple">
                                    {(tags || []).map(v=>{
                                        return <Option value={v.iotTagId} key={v.iotTagId}>{v.tagName}</Option>
                                     })}
                                </Select>
                            )}
                        </FormItem> */}
                        {/* <FormItem {...formLayout} label="测量因子">
                            {getFieldDecorator('iotFactorIds', {
                                initialValue: (editData.iotFactors || []).map(v=>{
                                    return v.iotFactorId
                                }),
                                rules: [{required: true, message: '设备类型协议不能为空'}]
                            })(
                                <Select size="default" placeholder="请选择测量因子"  mode="multiple">
                                    {(factors || []).map(v=>{
                                        return <Option value={v.iotFactorId} key={v.iotFactorId}>{v.factorName}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="连接服务器">
                            <Row gutter={8}>
                                <Col span={18}>
                                    <FormItem>
                                        {getFieldDecorator('serverDomain', {
                                            initialValue: editData.serverDomain,
                                            rules: [{ required: true, message: '服务器地址' }],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem>
                                        {getFieldDecorator('serverPort', {
                                            initialValue: editData.serverPort,
                                            rules: [{ required: true, message: '端口号'}],
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem> */}
                        <FormItem {...formLayout} label="简介">
                            {getFieldDecorator('description', {
                                initialValue: editData.description,
                                rule:[{
                                    max:200,
                                    message:'请输入200字以内的简介'
                                }]
                            })(
                                <TextArea placeholder="请输入简介"  type="textarea" autosize={{ minRows: 4, maxRows: 6 }}/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout1} label="图片">
                            <span>图片推荐大小180*180</span>
                            {getFieldDecorator('imageUrl', {
                                initialValue:   fileList || [],
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


export default Form.create()(EditModal);