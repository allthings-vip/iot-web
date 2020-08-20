import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import {Form, Table, Pagination, Input, Button, Row, Col, Modal, Breadcrumb} from 'antd';

import styles from './index.less';
import {Page} from '../../utils/constant';
import UserEdit from '../../components/usermanage/userEditModal';
import TfIcon from '../../components/common/TfIcon/index';
const FormItem = Form.Item;

class UserManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalParams: {
                visible: false,
            }
        }
    }

    onCancel = () => {
        this.setState({
            modalParams: {
                visible: false
            },
            record: ''
        })
    }

    edit = (record, dispatch) => {
        record.project = ''
        const project = record.iotProjects && record.iotProjects.length && record.iotProjects.map(item => {
            return item.projectName
        })
        project && (record.project = project.join(','))
        this.setState({
            modalParams: {
                visible: true,
                width: 600,
                title: '编辑用户',
                onOk: () => {
                    this.refs.useredit.validateFields((err, values) => {
                        if (err) {return}
                        console.log('modalvalues', values)
                        dispatch({
                            type: 'usermanage/edit',
                            payload: {...values, iotUserId: record.iotUserId}
                        })
                        this.onCancel();
                    })
                },
                onCancel: this.onCancel
            },
        })
        setTimeout(() => {this.refs.useredit.setFieldsValue(record)},0)
    }

    open = (record) => {
        const that = this;
        if (record.enabled) {
            Modal.confirm({
                title: '确认禁用吗',
                onOk: () => {
                    that.props.dispatch({
                        type: 'usermanage/openClose',
                        payload: {enabled: 0, iotUserId: record.iotUserId} 
                    })
                }
            })
        } else {
            Modal.confirm({
                title: '确认启用吗',
                onOk: () => {
                    that.props.dispatch({
                        type: 'usermanage/openClose',
                        payload: {enabled: 1, iotUserId: record.iotUserId} 
                    })
                }
            })
        }
    }
    
    render() {
        const { form: {getFieldDecorator}, usermanage, dispatch } = this.props;
        const { dataSource, total, pageIndex, pageSize, keywords, loading } = usermanage || {}
        const columns = [
            {
                key: 'num',
                dataIndex: 'num',
                title: '序号',
                width: '7%',
                align: 'center',
                render: (text, record, index) => {
                    return index + 1
                }
            },
            {
                key: 'enabled',
                dataIndex: 'enabled',
                title: '状态',
                width: '7%',
                align: 'center',
                render: (text, record, index) => {
                    return record.enabled ? '启用' : '禁用'
                }
            },
            {
                key: 'username',
                title: '用户名',
                dataIndex: 'username',
                width: '10%',
                align: 'center'
            },
            {
                key: 'realName',
                title: '姓名',
                dataIndex: 'realName',
                width: '10%',
                align: 'center'
            },
            {
                key: 'mobile',
                title: '手机号码',
                dataIndex: 'mobile',
                width: '12%',
                align: 'center'
            },
            {
                key: 'email',
                title: '邮箱',
                dataIndex: 'email',
                width: '12%',
                align: 'center'
            },
            {
                key: 'companyName',
                title: '公司名称',
                dataIndex: 'companyName',
                width: '15%',
                align: 'center'
            },
            {
                key: 'project',
                title: '拥有项目',
                width: '15%',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <span>{record.iotProjects && record.iotProjects.length && record.iotProjects.map(
                            item => {
                                return item.projectName
                            }
                        ).join(';')}</span>
                    )
                }
            },
            {
                key: 'handle',
                title: '操作',
                width: '20%',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <div>
                            <span onClick={()=>this.edit(record, dispatch)} className={styles.button}>编辑</span>
                            <span onClick={()=>this.open(record)} className={styles.button}>{record.enabled ? '禁用':'启用'}</span>
                        </div>
                    )
                }
            },
        ]

        const handleSubmit = () => {
            this.props.form.validateFields(
                (err, values) => {
                    dispatch({
                        type: 'usermanage/updateState',
                        payload:{ loading: true }
                    })
                    dispatch({
                        type: 'usermanage/query',
                        payload:{...values, pageIndex: Page.pageIndex, pageSize: pageSize}
                    })    
                }
            )
        }

        const setPage = (page) => {
            dispatch({
                type: 'usermanage/updateState',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                    loading: true
                }
            });
            dispatch({
                type: 'usermanage/query',
                payload:{
                    pageIndex:page,
                    pageSize:pageSize,
                    keywords
                }
            });
        }

        const onShowSizeChange = (current, pageSize) => {
            dispatch({
                type: 'usermanage/updateState',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                    loading: true
                }
            });
            dispatch({
                type: 'usermanage/query',
                payload:{
                    pageIndex:current,
                    pageSize:pageSize,
                    keywords
                }
            });
        }

        const showTotal = (total, range) => {
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }

        const pagination = {
            total: total || 0,
            current: pageIndex,
            defaultCurrent: pageIndex,
            pageSize: pageSize,
            onChange: setPage,
            onShowSizeChange:onShowSizeChange,
            showQuickJumper:true,
            showSizeChanger:true,
            showTotal:showTotal
        }
        return (
             <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>用户管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={styles.container}>
                    <div className={styles.form}>
                        <Form layout='inline'>
                            <Row gutter={16}>
                                <Col span={5}>
                                    <FormItem style={{width: '100%'}} wrapperCol={{span: 24}}>
                                        {getFieldDecorator('keywords',{
                                            rules: [{require: true, message: '请输入有效信息'}]
                                        })(<Input placeholder='用户名/姓名/手机号/公司名称' />)}
                                    </FormItem>
                                </Col>
                                <Col span={1.5}>
                                    <FormItem>
                                        <Button type="primary" onClick={handleSubmit}>
                                            查询
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <Table
                        dataSource={dataSource || []} 
                        columns={columns} 
                        style={{textAlign:'center'}} 
                        pagination={pagination}
                        loading={loading}/>
                </div>
                <Modal {...this.state.modalParams}>
                    <UserEdit ref='useredit'/>
                </Modal>
             </div>
        )
    }
}

export default connect(({ usermanage }) => ({ usermanage }))(Form.create()(UserManage));