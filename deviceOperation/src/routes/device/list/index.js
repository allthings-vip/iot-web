import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import { Modal, Icon, Input, Button, Row, Col, Breadcrumb, Card, Pagination, Table, Popconfirm, Tabs, Form, Select, DatePicker, message } from 'antd';
import { getStampTime, getLocalTimeF } from '../../../utils/time';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import { deviceStatus, deviceConnectStatus } from '../../../utils/const'
import { Page } from '../../../utils/constant';
import Detail from '../../../components/device/detail/Detail';
import AddModal from '../../../components/device/AddModal';
import EditModal from '../../../components/device/EditModal';
import ImportModal from '../../../components/device/ImportModal';
import DeviceData from '../../../components/device/detail/DeviceData';
import DeviceEvent from '../../../components/device/detail/DeviceEvent';
import DeviceLog from '../../../components/device/detail/DeviceLog';
import ChannelData from '../../../components/device/detail/ChannelData';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const formItemLayout1 = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
    style: {
        marginBottom: 0
    }
}

class Device extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnVisiable: true,
            delBtn: true,
            disableBtn: true,
            enableBtn: true,
            selectItems: [],
            selectedRowKeys: [],
        }
    }
    onClean = () => {
        this.props.form.setFieldsValue({
            iotProjectId: {},
            iotDeviceTypeId: {},
            iotTagId: {},
            onlineStatus: {},
            keywords: ''
        });

    }
    handleSubmit = () => {
        const { form, dispatch } = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            !fieldsValue.iotDeviceTypeId ? delete fieldsValue.iotDeviceTypeId : fieldsValue.iotDeviceTypeId = fieldsValue.iotDeviceTypeId.key;
            //!fieldsValue.iotProjectId ? delete fieldsValue.iotProjectId : fieldsValue.iotProjectId = fieldsValue.iotProjectId.key;
            !fieldsValue.iotTagId ? delete fieldsValue.iotTagId : fieldsValue.iotTagId = fieldsValue.iotTagId.key;
            //!fieldsValue.onlineStatus ? delete fieldsValue.onlineStatus : fieldsValue.onlineStatus = fieldsValue.onlineStatus.key;
            !fieldsValue.keywords && delete fieldsValue.keywords;
            dispatch({
                type: 'device/updateState',
                payload: {
                    searchData: fieldsValue,
                }
            })
            dispatch({
                type: 'device/query',
                payload: {
                    ...fieldsValue,
                    pageIndex: Page.pageIndex,
                    pageSize: Page.pageSize
                }
            })
            dispatch({
                type: 'device/queryDeviceCounts',
                payload: {
                    ...fieldsValue,
                }
            })
        });
    }
    //点击详情
    detail = (item) => {
        const { history, dispatch } = this.props;
        dispatch({
            type: 'device/updateState',
            payload: {
                detailModal: true,
                selectItem: item,
                addressPoint: {}
            }
        })
        dispatch({
            type: 'device/detailQuery',
            payload: {
                iotDeviceId: item.iotDeviceId
            }
        })
        // history.push('/device/detail?iotDeviceId='+item.iotDeviceId)
    }
    selectDisable = (e) => {
        let that = this;
        const { selectItems } = this.props.device

        if (selectItems.length > 0) {
            confirm({
                title: '停用',
                content: '确定停用？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    that.props.dispatch({
                        type: 'device/changeStatus',
                        payload: {
                            iotDeviceIds: selectItems.map(v => {
                                return v.iotDeviceId
                            }),
                            enabled: 0
                        }
                    })
                }
            });
            this.setState({
                selectedRowKeys: [],
                enableBtn: true,
                disableBtn: true
            })
        } else {
            message.error('请选择一条记录', 2);
        }

    }
    selectEnable = (item) => {
        let that = this;
        const { selectItems } = this.props.device
        console.log(selectItems)
        if (selectItems.length > 0) {
            confirm({
                title: '启用',
                content: '确定启用？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    that.props.dispatch({
                        type: 'device/changeStatus',
                        payload: {
                            iotDeviceIds: selectItems.map(v => {
                                return v.iotDeviceId
                            }),
                            enabled: 1
                        }
                    })
                    this.setState({
                        selectedRowKeys: [],
                        enableBtn: true,
                        disableBtn: true
                    })
                }
            });
        } else {
            message.error('请选择一条记录', 2);
        }

    }
    disable = (item) => {
        let that = this;
        confirm({
            title: '停用',
            content: '确定停用？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                that.props.dispatch({
                    type: 'device/changeStatus',
                    payload: {
                        iotDeviceIds: [item.iotDeviceId],
                        enabled: 0
                    }
                })
            }
        });
    }
    enable = (item) => {
        let that = this;
        confirm({
            title: '启用',
            content: '确定启用？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                that.props.dispatch({
                    type: 'device/changeStatus',
                    payload: {
                        iotDeviceIds: [item.iotDeviceId],
                        enabled: 1
                    }
                })
            }
        });
    }
    edit = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'device/detail',
            payload: {
                iotDeviceId: item.iotDeviceId
            }
        })
        dispatch({
            type: 'device/updateState',
            payload: {
                addressPoint: {
                    lng: '',
                    lat: ''
                },
                addressEditPoint: {
                    lng: '',
                    lat: ''
                },
                editModal: true
            }
        })
    }
    add = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'device/updateState',
            payload: {
                addModal: true,
                addressPoint: {}
            }
        })
    }
    delete = (e) => {
        confirm({
            title: '删除',
            content: '确定删除？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                // this.props.onDelete(this.props.item.tmiMailListId);
            }
        });
    }
    import = (e) => {
        const { dispatch } = this.props;
        // dispatch({
        //     type:'device/getProjectName',
        // })
        dispatch({
            type: 'device/updateState',
            payload: {
                importModal: true
            }
        })
        // confirm({
        //     title: '删除',
        //     content: '确定导入？',
        //     okText:'确定',
        //     cancelText:'取消',
        //     onOk: () => {
        //        // this.props.onDelete(this.props.item.tmiMailListId);
        //     }
        // });
    }
    tabsChange = (e) => {
        const endDates = moment();
        const startDates = moment().clone().set({ hour: 0, minute: 0 });
        // if(e === '1'){
        //     this.setState({
        //         btnVisiable:true
        //     })
        // }
        if (e === '2') {
            this.props.dispatch({
                type: 'device/queryPointslatest'
            })
            // this.props.dispatch({
            //     type:'device/detail'
            // })
            this.props.dispatch({
                type: 'device/queryFactorList'
            })
        }
        if (e === '3') {
            this.props.dispatch({
                type: 'device/updateState',
                payload: {
                    bodyLoading: true
                }
            })
            // this.props.dispatch({
            //     type:'device/queryChannelData',
            //     payload:{

            //     }
            // })
            this.props.dispatch({
                type: 'device/queryAllByIotDeviceType'
            })
            this.channelNode && this.channelNode.resetFields(['channelType', 'channelCode', 'channelName']);
            this.props.dispatch({
                type: 'device/updateState',
                payload: {
                    channelSelected: {},
                    channelFactorsList: [],
                    channelKvspoints: [],
                    channelFactors: [],
                    bodyLoading: true
                }
            })
        }
        if (e === '4') {
            this.props.dispatch({
                type: 'device/updateState',
                payload: {
                    eventPageIndex: Page.pageIndex,
                    eventPageSize: Page.pageSize,
                    eventStarttime: startDates.valueOf(),
                    eventEndtime: endDates.valueOf(),
                }
            })
            this.props.dispatch({
                type: 'device/queryevents',
                payload: {
                    startTime: startDates.valueOf(),
                    endTime: endDates.valueOf(),
                }
            })
            this.eventNode.resetFields();
        }
        if (e === '5') {
            this.props.dispatch({
                type: 'device/updateState',
                payload: {
                    logPageIndex: Page.pageIndex,
                    logPageSize: Page.pageSize,
                    logStarttime: startDates.valueOf(),
                    logEndtime: endDates.valueOf(),
                }
            })
            this.props.dispatch({
                type: 'device/querylogs',
                payload: {
                    startTime: startDates.valueOf(),
                    endTime: endDates.valueOf(),
                }
            })
            this.logNode.resetFields();
        }
    }
    goList = () => {
        this.props.dispatch({
            type: 'device/updateState',
            payload: {
                detailModal: false,
                kvspoints: [],
                factors: [],
                latestPoints: [],
                deviceInfo: {},
                detailModal: false,
                eventModal: false,
                factorsList: [],
                channelLatestPoints: [], // 通道实时数据
                channelSelected: {}, //选中的通道
                channelFactors: [], // 通道数据因子列表
                channelFactorsList: [], // 通道数据checkbox因子列表
                channelKvspoints: [] // 通道数据因子数据
            }
        })
        if (window.location.href.indexOf('iotDeviceId') > -1) {
            const { history } = this.props;
            history.push('/device');
        }
    }
    render () {
        let that = this
        const { device, dispatch, history, loading,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const { deviceCounts, detailModal, addModal, projectData, editModal, editData, deviceTypeData, importModal, addressPoint, addressEditPoint, searchData } = device;
        const { list, listMap, total, pageSize, pageIndex, projects, tags, deviceTypes, deviceTypesByProjectId } = device;
        const isloading = loading.effects['device/query'];
        const pagination = {
            total: total,
            current: pageIndex,
            defaultCurrent: pageIndex,
            pageSize: pageSize,
            onChange: setPage,
            onShowSizeChange: onShowSizeChange,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: showTotal,
            scroll: { x: 900 }
        }
        function onShowSizeChange (current, pageSize) {
            that.setState({
                selectedRowKeys: [],
                disableBtn: true,
                enableBtn: true,
            })
            dispatch({
                type: 'device/query',
                payload: {
                    ...searchData,
                    pageIndex: current,
                    pageSize: pageSize,
                }
            });
            dispatch({
                type: 'device/updateState',
                payload: {
                    pageIndex: current,
                    pageSize: pageSize,
                }
            });
        }

        function setPage (page) {
            that.setState({
                selectedRowKeys: [],
                disableBtn: true,
                enableBtn: true,
            })
            dispatch({
                type: 'device/query',
                payload: {
                    ...searchData,
                    pageIndex: page,
                    pageSize: pageSize,
                }
            });
            dispatch({
                type: 'device/updateState',
                payload: {
                    pageIndex: page,
                    pageSize: pageSize,
                }
            });
        }
        function showTotal (total, range) {
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const dataSource = list.map(v => {
            return {
                ...v,
                key: v.iotDeviceId
            }
        })
        const columns = [{
            title: '设备编码',
            dataIndex: 'deviceCode',
            key: 'deviceCode',
            render: (text, record) => {
                return (record.deviceCode)
            }
        }, {
            title: '业务编码',
            key: 'bizCode',
            dataIndex: 'bizCode',
        }, {
            title: '设备名称',
            key: 'deviceName',
            dataIndex: 'deviceName',
        }, {
            title: '设备类型',
            key: 'deviceTypeName',
            dataIndex: 'deviceTypeName',
        }, {
            title: '所属机构',
            key: 'agencyName',
            dataIndex: 'agencyName',
        }, {
            title: '状态/连接(断开)时间',
            key: 'connected',
            dataIndex: 'connected',
            render: (text, record) => {
                return (
                    <React.Fragment>
                        <div style={{ marginRight: '8px', width: '12px', height: '12px', display: 'inline-block', borderRadius: '6px', backgroundColor: text ? '#00B603' : '#CACACA' }}></div>
                        <span>{text ? record.latestConnectDatetime ? getLocalTimeF(record.latestConnectDatetime) : '' : record.latestDisconnectDatetime ? getLocalTimeF(record.latestDisconnectDatetime) : ''}</span>
                    </React.Fragment>
                )

            }
        }, {
            title: '创建时间',
            key: 'inputDate',
            dataIndex: 'inputDate',
            render: (text, record) => {
                return text ? getLocalTimeF(text) : ''
            }
        }, {
            title: '最近上报时间',
            key: 'latestUploadDatetime',
            dataIndex: 'latestUploadDatetime',
            render: (text, record) => {
                return text ? getLocalTimeF(text) : ''
            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            render: (text, record) => {
                return (

                    <div>
                        <a onClick={this.detail.bind(this, record)}>详情</a>
                        <a onClick={this.edit.bind(this, record)} style={{ paddingLeft: '16px' }}>编辑</a>
                        {
                            record.enabled ?
                                <a style={{ paddingLeft: '16px', color: '#666' }} onClick={this.disable.bind(this, record)}>停用</a>
                                :
                                <a style={{ paddingLeft: '16px' }} onClick={this.enable.bind(this, record)}>启用</a>
                        }
                    </div>

                );
            },
        }
        ];

        const addProps = {
            projectData,
            deviceTypeData,
            addressPoint,
            dispatch,
            tags,
            deviceTypes,
            handleOk (item) {
                dispatch({
                    type: 'device/add',
                    payload: {
                        item: item
                    }
                })

            },
            handleCancel () {
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        addressPoint: {
                        },
                        addModal: false,

                    }
                })
            }
        }
        const editProps = {
            projectData,
            editData,
            deviceTypeData,
            addressEditPoint,
            dispatch,
            tags,
            deviceTypes,
            handleOk (item) {
                dispatch({
                    type: 'device/edit',
                    payload: {
                        item: item
                    }
                })
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        editData: {}
                    }
                })
            },
            handleCancel () {
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        editModal: false,
                        addressEditPoint: {},
                        editData: {}
                    }
                })
            }
        }
        const importProps = {
            dispatch,
            projects,
            handleOk () {
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        importModal: false
                    }
                })
            },
            handleCancel () {
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        importModal: false
                    }
                })
            }
        }
        // 通过 rowSelection 对象表明需要行选择
        //已完成按钮灰掉，新建按钮高亮
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange (selectedRowKeys, selectedRows) {
                selectedRowKeys = (selectedRows || []).map(v => {
                    return v.iotDeviceId
                })
                that.setState({
                    selectedRowKeys: selectedRowKeys
                })
                // const rows1 = selectedRows.map(v=>{
                //     if(v.enabled){
                //         return v
                //     }
                // })
                // const rows1 = selectedRows.map(v=>{
                //     if(v.enabled){
                //     } else {
                //         return v
                //     }
                // })
                // console.log(rows);
                const rows = selectedRows.filter(v => v.enabled == false);
                const rows1 = selectedRows.filter(v => v.enabled == true);
                if (rows.length > 0 && rows1.length > 0) {
                    that.setState({
                        enableBtn: true,
                        disableBtn: true,
                    })
                } else {
                    if (rows.length > 0) {
                        that.setState({
                            enableBtn: false,
                            disableBtn: true,
                        })
                    } else if (rows1.length > 0) {
                        that.setState({
                            enableBtn: true,
                            disableBtn: false,
                        })
                    } else {
                        that.setState({
                            enableBtn: true,
                            disableBtn: true,
                        })
                    }
                }
            },
            onSelect (record, selected, selectedRows) {
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        selectItems: selectedRows
                    }
                });
                const rows = selectedRows.filter(v => v.enabled == false);
                const rows1 = selectedRows.filter(v => v.enabled == true);
                // const rows = selectedRows.filter(v=>v.enabled==false);
                // const rows1 = selectedRows.filter(v=>v.enabled==true);
                if (rows.length > 0 && rows1.length > 0) {
                    that.setState({
                        enableBtn: true,
                        disableBtn: true,
                    })
                } else {
                    if (rows.length > 0) {
                        that.setState({
                            enableBtn: false,
                            disableBtn: true,
                        })
                    } else if (rows1.length > 0) {
                        that.setState({
                            enableBtn: true,
                            disableBtn: false,
                        })
                    } else {
                        that.setState({
                            enableBtn: true,
                            disableBtn: true,
                        })
                    }
                }
            },

            onSelectAll (selected, selectedRows, changeRows) {
                dispatch({
                    type: 'device/updateState',
                    payload: {
                        selectItems: selectedRows
                    }
                });
                const rows = selectedRows.filter(v => v.enabled == false);
                const rows1 = selectedRows.filter(v => v.enabled == true);
                if (rows.length > 0 && rows1.length > 0) {
                    that.setState({
                        enableBtn: true,
                        disableBtn: true,
                    })
                } else {
                    if (rows.length > 0) {
                        that.setState({
                            enableBtn: false,
                            disableBtn: true,
                        })
                    } else if (rows1.length > 0) {
                        that.setState({
                            enableBtn: true,
                            disableBtn: false,
                        })
                    } else {
                        that.setState({
                            enableBtn: true,
                            disableBtn: true,
                        })
                    }
                }
            },
        };
        let { deviceInfo, roadData, roadModal } = device;
        const detailProps = {
            dispatch,
            loading,
            deviceInfo,
            roadData,
            roadModal
        }
        let { latestPoints, factors, kvspoints, factorsList } = device
        const dataProps = {
            dispatch,
            loading,
            latestPoints,
            factors,
            kvspoints,
            factorsList,
        }
        let { eventModal, eventList, eventPageIndex, eventPageSize, iotDeviceEventId, eventDetailData, eventStarttime, eventEndtime, eventTotal } = device;
        const eventProps = {
            dispatch,
            loading,
            eventModal,
            eventList,
            eventPageIndex,
            eventPageSize,
            iotDeviceEventId,
            eventDetailData,
            eventEndtime,
            eventStarttime,
            eventTotal
        }
        let { logList, logTotal, logPageIndex, logPageSize, logStarttime, logEndtime } = device;
        const logProps = {
            dispatch,
            loading,
            logList,
            logTotal,
            logPageIndex,
            logPageSize,
            logEndtime,
            logStarttime
        }
        let { channelData, passTypeData, channelLatestPoints, channelSelected, channelFactors, channelFactorsList, channelKvspoints, videoModal, liveStreamUrl, videoButton, bodyLoading } = device;
        const channelProps = {
            loading,
            dispatch,
            channelData,
            passTypeData,
            channelLatestPoints,
            channelSelected,
            channelFactors,
            channelFactorsList,
            channelKvspoints,
            videoModal,
            liveStreamUrl,
            videoButton,
            bodyLoading
        }
        return (
            <div>
                {
                    detailModal ? <div>
                        <Breadcrumb style={{ display: 'inline-block' }}>
                            <Breadcrumb.Item>
                                <TfIcon type="local" style={{ color: '#0385ff' }} />
                                <span>设备管理</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span>设备详情</span>
                            </Breadcrumb.Item>

                        </Breadcrumb>
                        <a onClick={this.goList.bind(this)} style={{ marginLeft: '20px', textDecoration: 'underline' }}>返回列表</a>
                        <div className={styles.detailCon}>
                            <Row className={styles.detailHead}>
                                <Col span={8}>
                                    <p>设备编码：<span title={deviceInfo.deviceCode || ''}>{deviceInfo.deviceCode || ''}</span></p>
                                </Col>
                                <Col span={4}>
                                    <p>连接状态：
                                        <span className={styles.tags} style={{ color: '#0289FF' }} title={deviceInfo.connected ? '在线' : '离线'}>
                                            {deviceInfo.connected ? '在线' : '离线'}
                                        </span>
                                    </p>
                                </Col>
                                <Col span={6}>
                                    <p>最近连接时间：
                                        <span title={deviceInfo.latestConnectDatetime ? getLocalTimeF(deviceInfo.latestConnectDatetime) : ''}>
                                            {deviceInfo.latestConnectDatetime ? getLocalTimeF(deviceInfo.latestConnectDatetime) : ''}
                                        </span>
                                    </p>
                                </Col>
                                <Col span={6}>
                                    <p>最近上报数据时间：
                                        <span title={deviceInfo.latestUploadDatetime ? getLocalTimeF(deviceInfo.latestUploadDatetime) : ''}>
                                            {deviceInfo.latestUploadDatetime ? getLocalTimeF(deviceInfo.latestUploadDatetime) : ''}
                                        </span>
                                    </p>
                                </Col>
                            </Row>
                            <Row className={styles.tabPane}>
                                <Tabs defaultActiveKey="1" onChange={this.tabsChange.bind(this)}>
                                    <TabPane tab="设备详情" key="1">
                                        <Detail {...detailProps} />
                                    </TabPane>
                                    <TabPane tab="设备数据" key="2">
                                        <DeviceData {...dataProps} />
                                    </TabPane>
                                    <TabPane tab="通道数据" key="3">
                                        <ChannelData {...channelProps} ref={node => this.channelNode = node} />
                                    </TabPane>
                                    <TabPane tab="设备事件" key="4">
                                        <DeviceEvent  {...eventProps} ref={node => this.eventNode = node} />
                                    </TabPane>
                                    <TabPane tab="设备日志" key="5" ref={node => this.logNode = node}>
                                        <DeviceLog  {...logProps} />
                                    </TabPane>
                                </Tabs>
                            </Row>
                        </div>
                    </div> : ''
                }

                <div style={detailModal ? { display: 'none' } : { display: 'block' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <TfIcon type="local" style={{ color: '#0385ff' }} />
                            <span>设备管理</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={styles.container}>
                        <Form className={styles.search}>
                            <Row gutter={16}>
                                <Col span={7}>
                                    <FormItem {...formItemLayout1} label='设备类型' className={styles.type}>
                                        {
                                            searchData.iotDeviceTypeId ? getFieldDecorator('iotDeviceTypeId', {
                                                initialValue:
                                                {
                                                    key: searchData.iotDeviceTypeId ? parseInt(searchData.iotDeviceTypeId) : '',
                                                    label: deviceTypes.filter(item => item.iotDeviceTypeId === parseInt(searchData.iotDeviceTypeId)).length > 0 ?
                                                        deviceTypes.filter(item => item.iotDeviceTypeId === parseInt(searchData.iotDeviceTypeId))[0].deviceTypeName : ''
                                                }
                                            })(
                                                <Select size="default" showSearch placeholder="设备类型" labelInValue optionFilterProp="children">
                                                    <Option value="" style={{ color: '#bfbfbf' }}>--请选择--</Option>
                                                    {(deviceTypes || []).map(v => {
                                                        return <Option value={v.iotDeviceTypeId}> {v.deviceTypeName}</Option>
                                                    })}
                                                </Select>
                                            ) : getFieldDecorator('iotDeviceTypeId')(
                                                <Select size="default" showSearch placeholder="设备类型" labelInValue optionFilterProp="children">
                                                    <Option value="" style={{ color: '#bfbfbf' }}>--请选择--</Option>
                                                    {(deviceTypes || []).map(v => {
                                                        return <Option value={v.iotDeviceTypeId}> {v.deviceTypeName}</Option>
                                                    })}
                                                </Select>
                                            )
                                        }

                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem {...formItemLayout1} label='标签'>
                                        {getFieldDecorator('iotTagId')(
                                            <Select size="default" showSearch placeholder="标签" labelInValue optionFilterProp="children">
                                                <Option value="">--请选择--</Option>
                                                {(tags || []).map(v => {
                                                    return <Option value={v.iotTagId}> {v.tagName}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={4}>
                                    <FormItem {...formItemLayout1} label='状态'>
                                        {getFieldDecorator('connected')(
                                            <Select size="default" placeholder="在线状态" allowClear={true} >
                                                <Option value="">--请选择--</Option>
                                                {(deviceConnectStatus || []).map(v => {
                                                    return <Option value={v.value}> {v.label}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ paddingLeft: 10 }}>
                                    <FormItem style={{ marginBottom: 0 }}>
                                        {getFieldDecorator('keywords', {
                                            initialValue: ''
                                        })(
                                            <Input placeholder="设备编码/业务编码/设备名称/所属机构" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={3} key='button'>
                                    <FormItem {...formItemLayout1}>
                                        <Button type="primary" onClick={this.handleSubmit}>查询</Button>
                                        {/* <Button type="default" style={{marginLeft: 5}}
                                            onClick={this.onClean}>清除</Button> */}
                                    </FormItem>
                                </Col>
                            </Row>

                        </Form>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.list}>
                            <Row className={styles.head}>
                                <Col span={12}>
                                    <Row style={{ color: "#999" }}>
                                        <div className={styles.counts}>
                                            设备总数：
                                                <span style={{ color: '#0289ff' }} title={deviceCounts.deviceTotal || ''}>
                                                {deviceCounts.deviceTotal || '0'}
                                            </span>

                                        </div>
                                        <div className={styles.counts}>
                                            在线：
                                            <span style={{ color: '#0289ff' }} title={deviceCounts.onlineTotal || ''}>
                                                {deviceCounts.onlineTotal || '0'}
                                            </span>
                                        </div>
                                        <div className={styles.counts}>
                                            离线：
                                            <span style={{ color: '#333' }} title={deviceCounts.offlineTotal || ''}>
                                                {deviceCounts.offlineTotal || '0'}
                                            </span>
                                        </div>
                                    </Row>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Button type="primary" onClick={this.add.bind(this)}>新增设备</Button>
                                    <Button type="primary" onClick={this.import.bind(this)} style={{ marginLeft: '10px' }}>批量导入</Button>
                                    {this.state.btnVisiable ?
                                        <span>
                                            <Button type="primary" onClick={this.selectEnable.bind(this)} disabled={this.state.enableBtn} style={{ marginLeft: '10px' }}>启用</Button>
                                            <Button type="primary" ghost onClick={this.selectDisable.bind(this)} disabled={this.state.disableBtn} style={{ marginLeft: '10px' }}>停用</Button>
                                            {/* <Button type="primary" ghost onClick={this.delete.bind(this)} disabled={this.state.delBtn}>删除</Button> */}
                                        </span>
                                        : ''
                                    }
                                </Col>
                            </Row>
                            <Table
                                loading={isloading}
                                rowSelection={rowSelection}
                                dataSource={dataSource}
                                columns={columns}
                                style={{ textAlign: 'center', marginTop: '10px' }}
                                pagination={pagination}
                                scroll={{ x: true }} />
                        </div>
                    </div>
                    {
                        addModal ?
                            <AddModal {...addProps} />
                            : ''
                    }
                    {
                        editModal ?
                            <EditModal {...editProps} />
                            : ''
                    }
                    {
                        importModal ?
                            <ImportModal {...importProps} />
                            : ''
                    }
                </div>
            </div>
        );
    }



    componentDidMount () {

    }

    componentWillUnmount () {

    }
}

export default connect(({ device, loading }) => ({ device, loading }))(Form.create()(Device));
