import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Select,message } from 'antd';
import styles from './EditModal.less';
import React, {Component} from 'react';
import moment from 'moment';
import { getStampTime,getLocalTime } from '../../utils/time';
import {uploadUrl} from '../../utils/constant'
import {imageUrl} from '../../utils/common'
import {letterNumberLine,specialLetter} from '../../utils/verify'
import {requestCsrfToken} from '../../utils/request'
const {TextArea} =Input;
const FormItem = Form.Item;
const Option = Select.Option;
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
        span: 6
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 10
    }
}
const formLayout2 = {
    wrapperCol: {
        span: 16,
        style: {float: 'right'}
    },
    style: {
        marginBottom: 10,
        width: '75%',
        display: 'inline-block'
    }
}
const formLayout3 = {
    style: {
        paddingRight: '8%',
        marginBottom: 10,
        width: '25%',
        display: 'inline-block',
        textAlign: 'right'
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
            imageUrl:'',
            imageUpdateUrl: ''
        };
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps) {
        console.log('prevProps', prevProps)
        if (this.props.collaborators != prevProps.collaborators) {
            let iotUserIds = this.props.collaborators.length && this.props.collaborators.map(item =>{
                return item.iotUserId
            })
            iotUserIds && this.props.form.setFieldsValue({iotUserIds})
        }
    }
    onOk (){
        const {form} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            fieldsValue.imageUrl = this.state.imageUrl;
            delete fieldsValue.keywords;
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
            }
        } else {
            this.setState({ fileList })
        }
        
    }

    queryTeamer = () => {
        const keywords = this.props.form.getFieldValue('keywords')
        if (!keywords) {
            message.info('请输入查询条件');
            return;
        }
        this.props.queryTeamer(keywords)
    }

    onDeselect = (value, option) => {
        console.log('option', value)
        let collaborators = this.props.collaborators.length && this.props.collaborators.filter(item => {
            return item.iotUserId != value
        })
        this.props.dispatch({
            type: 'home/updateState',
            payload: {collaborators: collaborators || []}
        })
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
        console.log('imageUpdateUrl', this.state.imageUpdateUrl)
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            collaborators
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
                        message.error(info.file.response.msg);
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
                    this.setState({
                        imageUrl: '',
                        fileList:[],
                    });
                    message.error('图片文件不超过5M');
                    return false;
                }

                return true;
            }

        }
        return (
            <div>
                <Modal
                    title="新增项目"
                    visible={true}
                    onOk={this.onOk}
                    onCancel={this.props.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form onSubmit={this.onOk}>
                        <FormItem {...formLayout} label="项目名称" >
                                {getFieldDecorator('projectName', {
                                    initialValue: '',
                                    rules: [
                                        {required: true, message: '项目名称不能为空'}, 
                                        {max: 32, message: '最多输入32个字符'},
                                        // {
                                        //     pattern: specialLetter,
                                        //     message: '输入有特殊字符'
                                        // }
                                ]
                                })(<Input placeholder="请输入项目名称"/>)}
                        </FormItem>
                        {/* <FormItem {...formLayout} label="包含设备类型" >
                                {getFieldDecorator('iotDeviceTypeIds', {
                                    initialValue: [],
                                    rules: [{required: true, message: '设备类型不能为空'}]
                                })(
                                    <Select size="default" placeholder="请选择设备类型"  mode="multiple">
                                       {(deviceTypes || []).map(v=>{
                                           return <Option value={v.iotDeviceTypeId} key={v.iotDeviceTypeId}>{v.deviceTypeName}</Option>
                                       })}
                                    </Select>
                                )}
                        </FormItem> */}
                        <FormItem {...formLayout} label="所属组织">
                            {getFieldDecorator('companyName', {
                                initialValue: '',
                                rules: [{max: 64, message: '最多输入64个字符'}]
                            })(
                                <Input placeholder="请输入所属组织"/>
                            )}
                        </FormItem>
                        <FormItem {...formLayout} label="协作人员" >
                            {getFieldDecorator('iotUserIds', {
                                initialValue: []
                            })(
                                <Select 
                                size="default" 
                                placeholder="请选择协作人员"  
                                mode="multiple"
                                onDeselect={this.onDeselect}
                                >
                                    {collaborators.map(v=>{
                                        return <Option value={v.iotUserId} key={v.iotUserId}>{v.username}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem {...formLayout2} >
                            {getFieldDecorator('keywords')(
                                <Input placeholder="用户名或手机号精确查询"/>
                            )}
                        </FormItem>

                        <FormItem {...formLayout3}>
                            <Button onClick={this.queryTeamer}>添加</Button>
                        </FormItem>
                        
                        <FormItem {...formLayout1} label="简介">
                            {getFieldDecorator('description', {
                                initialValue: '',
                                rules: [ {max: 100, message: '最多输入100个字符'}]
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


export default Form.create()(AddModal);