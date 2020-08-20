import { Button, Row, Col, Form,Input, Modal,Upload,Icon,Checkbox,message,Select } from 'antd';
import reqwest from 'reqwest';
import styles from './Detail.less';
import React, {Component} from 'react';
import moment from 'moment';
import request from '../../utils/request';
import qs from 'qs';
import {Page} from '../../utils/constant';
// import {uploadFileUrl,Page} from '../../../utils/constant'
const {TextArea} =Input;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const formLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span:8
    },
    style: {
        marginBottom: 10
    }
}
const formLayout1 = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 20
    },
    style: {
        marginBottom: 5
    }
}
const formLayout2 = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 14
    },
    style: {
        marginBottom: 5
    }
}

class ImportModal extends Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            fileList: [],
            uploading: false,
            errMsg:""
        }
    }  
    handleUpload = () => {
        const {form, dispatch} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            } else {
                const { fileList } = this.state;
                if(fileList.length>0){
                    const formData = new FormData();
                    const csrfType = +new Date() + '-' + Math.floor(Math.random() * Math.pow(10, 18)).toString(16);
                    fileList.forEach((file) => {
                        formData.append('deviceFile', file);
                        formData.append('iotProjectId', localStorage.getItem('iotProjectId'));
                    });
    
                    this.setState({
                        uploading: true,
                    });
                    request('/dos/csrfTokenServlet',{
                        csrfToken:'1',
                        method: 'POST',
                        body: qs.stringify({
                            csrfType,
                        })
                       
                    }).then(data=> {
                        console.log(data);
                        if(data&&data.code === 0){
                            reqwest({
                                url:'/dos/devices/import'+'?csrfType='+csrfType+"&csrfToken=" + data.data,
                                //url: this.props.uploadFileUrl+'?csrfType='+csrfType+"&csrfToken=" + data.ret,
                                method: 'post',
                                processData: false,
                                data: formData,
                                success: (data) => {
                                    if(data.code===0){
                                        this.setState({
                                            fileList: [],
                                            uploading: false,
                                        });
                                        message.success('上传成功');
                                        dispatch({
                                            type:'device/updateState',
                                            payload:{
                                                importModal:false,
                                                searchData: {}
                                            }
                                        });
                                        dispatch({
                                            type:'device/query',
                                            payload:{
                                                pageIndex:Page.pageIndex,
                                                pageSize:Page.pageSize
                                            }
                                        })
                                        dispatch({
                                            type: 'device/queryDeviceCounts'
                                        })
                                    } else {
                                        this.setState({
                                           // fileList: [],
                                            uploading: false,
                                            errMsg: data.data ? (data.data || []).map(v=>{
                                                return <p>{'第'+ v.rowNum+'行' + (v.errorMsgList || []).map(item=> {
                                                    return item + '\n'
                                                })}</p>
                                            }) : data.msg
                                        });
                                        // message.error(data.err || data.ret.map(v=>{
                                        //     return '第'+ v.rowNum+'行' + (v.errorMsgList || []).map(v=> {
                                        //         return v + '\n'
                                        //     },5)
                                        // }));
                                    }
                                    
                                },
                                error: () => {
                                    this.setState({
                                    uploading: false,
                                    });
                                    message.error('上传失败');
                                },
                            });
                        } else {
                            message.error(data.msg || '导入失败,请重试');
                        }
                        
                    })
                    
                    // request('/iov/csrfTokenServlet',{
                    //     csrfToken:'1',
                    //     method: 'POST',
                    //     body: qs.stringify({
                    //         csrfType,
                    //     })
                       
                    // }).then(data=> {
                    //     reqwest({
                    //         url:'/dos/devices/import',
                    //        // url: this.props.uploadFileUrl+'?csrfType='+csrfType+"&csrfToken=" + data.ret,
                    //         method: 'post',
                    //         processData: false,
                    //         data: formData,
                    //         success: (data) => {
                    //             if(data.rc===0){
                    //                 this.setState({
                    //                     fileList: [],
                    //                     uploading: false,
                    //                 });
                    //                 message.success('上传成功');
                    //                 this.props.handleOk();
                    //             } else {
                    //                 this.setState({
                    //                    // fileList: [],
                    //                     uploading: false,
                    //                     errMsg:(data.err || (data.ret || []).map(v=>{
                    //                         return <p>{'第'+ v.rowNum+'行' + (v.errMsg || []).map(item=> {
                    //                             return item + '\n'
                    //                         })}</p>
                    //                     }))
                    //                 });
                    //                 // message.error(data.err || data.ret.map(v=>{
                    //                 //     return '第'+ v.rowNum+'行' + (v.errorMsgList || []).map(v=> {
                    //                 //         return v + '\n'
                    //                 //     },5)
                    //                 // }));
                    //             }
                                
                    //         },
                    //         error: () => {
                    //             this.setState({
                    //             uploading: false,
                    //             });
                    //             message.error('上传失败');
                    //         },
                    //     });
                    // })
                } else {
                    message.error('请选择需要上传的文件');
                }
                
                
            }
        });
        
    
    }
    onOk (){
        
    }
    render() {
        const {
            form: {
                getFieldDecorator,
                setFieldsValue
            },
            dispatch
        } =  this.props;
        const { uploading } = this.state;
        const importProps = {
            action: this.props.uploadFileUrl,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
                this.setState({errMsg:''})
        },
            beforeUpload: (file) => {
                const isExcel = file.name.indexOf('.xlsx')>-1;    
                if (!isExcel) {
                        message.error('文件上传失败,不支持的文件格式(仅支持xlsx)');
                        this.setState({
                            fileList: [],
                        });
                        
                } else {
                    this.setState(({ fileList }) => ({
                        fileList: [...fileList, file],
                    }));
                }
                return false;
            },
        fileList: this.state.fileList,
        };
        let letter = "设备批量导入";
        
        return (
            <div>
                <Modal
                    width="800px"
                    title={'批量导入'}
                    visible={true}
                    onOk={this.handleUpload}
                    onCancel={this.props.handleCancel}
                    okText={"确定导入"}
                    cancelText={"取消"}
                    maskClosable={false}
                    >
                    <Form className={styles.container}>
                        <FormItem {...formLayout1}>
                           <Row>
                                <Col span={24} style={{textAlign:'left'}}>
                                    <span>请选择要导入的文件(支持xlsx):</span>
                                    <a style={{marginLeft:'20px',textDecoration:'underline'}} type='default' href="./deviceTemplate.xlsx" download="设备批量导入模板">下载模板</a>
                               </Col>
                           </Row>
                           <Row>
                                <Col span={20}>
                                    <Upload {...importProps} disabled={uploading}>
                                        <Button type='normal' loading={uploading} disabled={this.state.fileList.length > 0}>{uploading ? '上传中...' : '上传文件' }</Button>
                                    </Upload>
                                    <p style={{color:'#aaa'}}>注意：如果系统中已存在相同<span>{letter}</span>的记录，导入后将会覆盖该记录数据</p>
                               </Col>
                           </Row>
                           <Row>
                                <div style={{color:'red'}}>{this.state.errMsg}</div>
                           </Row>
                        </FormItem>
                        
                    </Form>
                </Modal>
            </div>
        )
    }
    
}


export default Form.create()(ImportModal);