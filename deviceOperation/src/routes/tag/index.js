import React, {Component} from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import {Form, Table, Pagination, Input, Button, Row, Col, Modal, Transfer, Icon, Breadcrumb, message} from 'antd';
const FormItem = Form.Item;
import TfIcon from '../../components/common/TfIcon/index';
import TagAdd from '../../components/tag/tag';

import styles from './index.less'
function tbHeightStyle() {
    let height = 0;
    const windowHeight = document.body.offsetHeight;
    const oTop = 80+40+44+10;
    height = windowHeight - oTop;
    return height;
}
class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftRowKeys: '', 
            leftRows: [],
            rightRowKeys: '',
            rightRows: [],
            // iotTagId: this.props.tagmanage.iotTagId || '1',
            modalInfo: {
                visible: false
            }
        }
        console.log('iotid', this.props.tagmanage.iotTagId)
    }

    toLeft = () => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        const {rightRowKeys, rightRows, leftRows} = this.state;
        const {iotTagId} = this.props.tagmanage || {};
        const iotDeviceIds = rightRows.map((item) => {
            return item.iotDeviceId
        })
        this.props.dispatch({
            type:'tagmanage/deleteDevice',
            payload: {
                iotProjectId,
                iotTagId,
                iotDeviceIds
            },
            callback: (res) => {
                if (res == '0') {
                    console.log('async', res)
                    this.setState({leftRows: leftRows.concat(rightRows), rightRows: []})
                    this.props.form.resetFields();
                }
            }
        })
        
    }

    toRight = () => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        const {leftRowKeys, leftRows, rightRows} = this.state;
        const {iotTagId} = this.props.tagmanage || {};
        const iotDeviceIds = leftRows.map((item) => {
            return item.iotDeviceId
        })
        this.props.dispatch({
            type:'tagmanage/addDevice',
            payload: {
                iotProjectId,
                iotTagId,
                iotDeviceIds
            }, 
            callback: (res) => {
                if (res == '0') {
                    console.log('async', res)
                    this.setState({rightRows: rightRows.concat(leftRows), leftRows: []})
                    this.props.form.resetFields();
                }
            }
        })
    }

    chooseTag = (iotTagId) => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        this.props.dispatch({
            type: 'tagmanage/updateState',
            payload: {
                iotTagId,
                rightloading: true,
                leftloading: true
            }
        })
        this.props.form.resetFields();
        this.props.dispatch({
            type: 'tagmanage/haveDeviceList',
            payload: {iotProjectId, iotTagId},
            callback: (res) => {
                if(res == '0') {
                    this.setState({
                        rightRows: []
                    })
                }
            }
        })
        this.props.dispatch({
            type: 'tagmanage/unDeviceList',
            payload: {iotProjectId, iotTagId},
            callback: (res) => {
                if(res =='0') {
                    this.setState({
                        leftRows: []
                    })
                }
            }
        })
    }

    onRow = (record, direc) => {
        console.log('iiiiiiiiiiiiii')
        const { leftRows, rightRows } = this.state;
            
            if(direc == 'left') {
                const leftRowsJudge = leftRows.some(item => {
                    return item.deviceCode == record.deviceCode
                })
                if (leftRowsJudge) {
                    const leftrow = leftRows.filter(item => {
                        return item.deviceCode != record.deviceCode 
                    })
                    this.setState({leftRows: leftrow})
                } else {
                    this.setState({
                        leftRows: leftRows.concat(record)
                    })
                }
            } else {
                const rightRowsJudge = rightRows.some(item => {
                    return item.deviceCode == record.deviceCode
                })
                if (rightRowsJudge) {
                    const rightrow = rightRows.filter(item => {
                        return item.deviceCode != record.deviceCode 
                    })
                    this.setState({rightRows: rightrow})
                } else {
                    this.setState({
                        rightRows: rightRows.concat(record)
                    })
                }
            }
    }

    rowClassName = (record) => {
        const {leftRows, rightRows} = this.state;
        console.log('classnameleft', leftRows)
        console.log('classnameright', rightRows)
        const rows = leftRows.concat(rightRows)
        const choosedStyle = (rows != []) && rows.some(item => {
            return item.deviceCode == record.deviceCode
        }) 

        if (choosedStyle) {
            return styles.cell
        } else {
            return styles.cellover
        }
    }

    search = (choose) => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        const { dispatch, form: {getFieldValue}, tagmanage } = this.props;
        const { iotTagId } = tagmanage || {}
        if (!iotTagId) {
            message.info('没有选中标签')
            return;
        }
        if(choose == 'notchoosed') {
            dispatch({
                type: 'tagmanage/updateState',
                payload: {leftloading: true}
            })
             dispatch({
                 type: 'tagmanage/unDeviceList',
                 payload: {
                     keywords: getFieldValue('keywordsleft'),
                     iotTagId,
                     iotProjectId
                 },
                 callback: (res) => {
                     if(res == '0') {
                         this.setState({
                             leftRows: []
                         })
                     }
                 }
             })
        } else {
            dispatch({
                type: 'tagmanage/updateState',
                payload: {rightloading: true}
            })
            dispatch({
                type: 'tagmanage/haveDeviceList',
                payload: {
                    keywords: getFieldValue('keywordsright'),
                    iotTagId,
                    iotProjectId
                },
                callback: (res) => {
                    if(res == '0') {
                        this.setState({
                            rightRows: []
                        })
                    }
                }
            })
        }
    }

    deleteTag = (e,iotTagId) => {
        e.stopPropagation()
        let iotProjectId = localStorage.getItem('iotProjectId')
        const that = this;
        Modal.confirm({
            title: '删除标签',
            content: '确认删除标签吗？',
            onOk: () => {
                that.props.dispatch({
                    type: 'tagmanage/deleteTag',
                    payload:{iotTagId, iotProjectId},
                    callback: () => {
                            that.setState({leftRows: [], rightRows: []});
                            that.props.form.resetFields();
                    }
                })
            }
        })
    }

    addTag = () => {
        let iotProjectId = localStorage.getItem('iotProjectId')
        this.setState({
            modalInfo: {
                visible: true,
                width: '500px',
                title: '新增标签',
                onOk: () => {
                    this.refs.tagadd.validateFields((err, value) => {
                        if (!!err) {return}
                        this.props.dispatch({
                            type: 'tagmanage/addTag',
                            payload: {...value, iotProjectId},
                            callback: () => {
                                    this.setState({leftRows: [], rightRows: []});
                                    this.props.form.resetFields();
                            }
                        });
                        this.onCancel();
                    });
                },
                onCancel: this.onCancel
            }
        })
    }

    onCancel = () => {
        this.setState({
            modalInfo: {
                visible: false
            }
        })
    }
    
    
    render() {
        console.log('leftRows',this.state.leftRows)
        console.log('rightRows', this.state.rightRows)

        const { form:{getFieldDecorator}, tagmanage, dispatch } = this.props
        const { haveDeviceList, unDeviceList, tagList, iotTagId, leftloading, rightloading } = tagmanage || {}
        const { rightRows, leftRows } = this.state;
        const columns = [
            {
                key: 'deviceCode',
                dataIndex: 'deviceCode',
                title: '设备编码',
                width: '25%',
            },
            {
                key: 'bizCode',
                dataIndex: 'bizCode',
                title: '业务编码',
                width: '25%',
            },
            {
                key: 'deviceName',
                dataIndex: 'deviceName',
                title: '设备名称',
                width: '25%',
            },
            {
                key: 'deviceTypeName',
                dataIndex: 'deviceTypeName',
                title: '设备类型',
                width: '25%',
            }
        ]
        const Height =tbHeightStyle();
        const tableLeft = {
            dataSource: unDeviceList || [],
            columns: columns,
            onRow: (record) =>  {return {
                 onClick: () => {
                     this.onRow(record, 'left')
                 }
            }},
            rowClassName: (record) => this.rowClassName(record),
            pagination: false,
            scroll: {y: Height - 98 - 43},
            loading: leftloading
        }
        const tableRight = {
            dataSource:  haveDeviceList || [],
            columns: columns,
            onRow: (record) =>  { return {
                    onClick: () => {
                        this.onRow(record, 'right')
                    }
                }
            },
            rowClassName: (record) => this.rowClassName(record),
            pagination: false,
            scroll: {y: Height - 98 - 43},
            loading: rightloading
        }
        const formlayout = {
            wrapperCol: {
                span: 24
            },
            style: {
                width: '100%',
                marginRight: '6px'
            }
        }
        return (
            <div className={styles.container}>
                 <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <span>标签管理</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div style={{height:Height+'px'}}>
                <Row className={styles.row}>
                    <Col span={4} className={styles.col}>
                        <div className={styles.tagArea}>
                            <p className={styles.tagHead}><span>标签管理</span><a onClick={this.addTag}>新增标签</a></p>
                            <div className={styles.tagBody}>
                                {tagList && tagList.length && tagList.map((item) => {
                                    return <div className={item.iotTagId == iotTagId ? styles.tagchoosed:styles.tag} onClick={() => {this.chooseTag(item.iotTagId)}} key={item.iotTagId}>
                                        <p>{item.tagName}</p>
                                        <Icon type="delete" style={{fontSize: '16px', cursor: 'pointer'}} onClick={(e)=>this.deleteTag(e,item.iotTagId)}/>
                                    </div>
                                })}
                            </div>
                        </div>
                    </Col>
                    <Col span={20} className={styles.col}>
                        <div className={styles.deviceArea}>
                            <p>添加设备</p>
                            <Form layout='inline' style={{height:Height-48-10}}>
                            <Row style={{height: '100%'}} type="flex" justify="space-around" align="middle">
                                
                                    <Col span={11} style={{height: '100%'}}>
                                        <div className={styles.notchoosed}>
                                            <Row className={styles.searchdiv}>
                                                <Col span={3}>未选</Col>
                                                    <Col span={16}>
                                                        <FormItem {...formlayout}>
                                                            {getFieldDecorator('keywordsleft',{

                                                            })(
                                                                <Input placeholder='设备编码/业务编码/设备名称/设备类型' style={{verticalAlign: 'middle'}}/>
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={4}>    
                                                        <FormItem style={{marginRight: '0'}}>
                                                            <Button onClick={()=>this.search('notchoosed')} style={{verticalAlign: 'middle'}} type="primary">搜索</Button>
                                                        </FormItem>
                                                    </Col>
                                            </Row>
                                            <Table {...tableLeft} />
                                        </div>
                                    </Col>
                                    <Col span={2} className={styles.middlebut}>
                                        <p>
                                            <Button onClick={this.toRight} type= 'primary' disabled={!leftRows.length}>{'>>'}</Button>
                                        </p>
                                        <p>
                                            <Button onClick={this.toLeft} type= 'primary' disabled={!rightRows.length}>{'<<'}</Button>
                                        </p>
                                    </Col>
                                    <Col span={11} style={{height: '100%'}}>
                                        <div className={styles.notchoosed}>
                                            <Row className={styles.searchdiv}>
                                                <Col span={3}>已选</Col>
                                                <Col span={16}>
                                                    <FormItem {...formlayout}>
                                                        {getFieldDecorator('keywordsright',{

                                                        })(
                                                            <Input placeholder='设备编码/业务编码/设备名称/设备类型' style={{verticalAlign: 'middle'}}/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col span={4}>
                                                    <FormItem style={{marginRight: '0'}}>
                                                        <Button onClick={()=>this.search('choosed')} style={{verticalAlign: 'middle'}} type="primary">搜索</Button>
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Table {...tableRight} /> 
                                        </div>
                                    </Col>
                                
                            </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
                </div>
                <Modal {...this.state.modalInfo}>
                    <TagAdd ref='tagadd'/>
                </Modal>
            </div>
        )
    }
    
}

export default connect(({tagmanage}) => ({tagmanage}))(Form.create()(Tag))