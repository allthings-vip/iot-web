import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import { getStampTime,getLocalTime } from '../../../utils/time';
import {Icon, Input, Button ,Row, Col,Breadcrumb,Card,Pagination,Table,Popconfirm,Tabs,Form,Select,DatePicker   } from 'antd';
import styles from './index.less';
import TfIcon from '../../../components/common/TfIcon/index';
import MapList from '../../../components/device/MapList'
const FormItem = Form.Item;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

const formLayout = {
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
const formLayout1 = {
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
class ProjectDetail extends React.Component {
    constructor(props) {
        super(props);
    }
    goUrl = () => {
        const {history} = this.props;
        history.push('/device');
    }
    render() {
        const {element, dispatch,
            form: {
                getFieldDecorator
            }
        } = this.props;
        const pagination = {
            total: 50,
            current: 1,
            defaultCurrent: 1,
            pageSize: 10,
            onChange: setPage,
            onShowSizeChange:onShowSizeChange,
            showTotal:showTotal,
            showQuickJumper:true, 
            showSizeChanger:true,
        }
        function onShowSizeChange(current, pageSize){
            
        }
        function setPage(page){
            dispatch({
                type: 'systemBase/queryBrandList',
                payload:{
                    domainId: domainId,
                    nodeId: nodeId,
                    params:{
                        pageNo:page-1,
                        pageSize:data.pageSize,
                    }
                    
                }
            });
        }
        function showTotal(total, range){ 
            return `第${range[0]} - ${range[1]}条记录， 共 ${total} 条`
        }
        const columns = [{
                title: '名称',
                dataIndex: 'name',
                width: '30%',
                render: (text, record) => {
                    return (record.name)
                }
            }, {
                title: '类型',
                dataIndex: 'age',
            }, {
                title: '当前值',
                dataIndex: 'age1',
            },{
                title: '单位',
                dataIndex: 'age2',
            },{
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                return (
                    dataSource.length > 1 ?
                    (
                        <div>
                            <a>实时曲线</a>
                        </div>
                        
                    ) : null
                );
                },
            }];
        const dataSource= [{
                key: '0',
                name: 'SD',
                age: '32',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }
        ]
        const operations = <div className={styles.btnGroup}>
                <Button type="primary">新增设备</Button>
                <Button type="primary">批量导入</Button>
                <Button type="primary" ghost>启用</Button>
                <Button type="primary" ghost>停用</Button>
                <Button type="primary" ghost>删除</Button>
            </div>;
        return (
            <div>
                {/* <Breadcrumb>
                    <Breadcrumb.Item>
                        <TfIcon type="local" style={{color:'#0385ff'}}/>
                        <Link to="/project">项目管理</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <span>项目详情</span>
                    </Breadcrumb.Item>
                </Breadcrumb> */}
                <div className={styles.container}>
                    <div className={styles.deviceDetail}>
                        <div  className={styles.titleWrap}>
                            <div>
                                <img src={require('../../../assets/image/project/project.png')} style={{width:100,height:100,}}/>
                            </div>
                            <div className={styles.project}>
                                <p> 慧通车联网项目</p>
                                <Row>
                                    <Form>
                                        <Col span={8}>
                                            <FormItem {...formLayout} label="设备总数">
                                                <span>287</span>
                                            </FormItem>
                                        </Col>
                                        <Col  span={8}>
                                            <FormItem {...formLayout} label="设备总数">
                                                <span>287</span>
                                            </FormItem>
                                        </Col>
                                        <Col  span={8}>
                                            <FormItem {...formLayout} label="设备总数">
                                                <span>287</span>
                                            </FormItem>
                                        </Col>
                                    </Form>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <Form>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <FormItem {...formLayout1} label="设备类型">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formLayout1} label="mac地址">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formLayout1} label="固件型号">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formLayout1} label="固件版本号">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col span={6}>
                                <FormItem {...formLayout1} label="地址">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formLayout1} label="用户名">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formLayout1} label="创建时间">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formLayout1} label="状态">
                                    {getFieldDecorator('transportStatus', {
                                        initialValue: ''
                                    })(
                                        <span>123</span>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.container}>
                    <div className={styles.list}> 
                    <Table 
                        rowSelection={rowSelection}
                        dataSource={dataSource} 
                        columns={columns} 
                        style={{textAlign:'center'}} 
                        pagination={pagination}/>
                    </div>
                </div>
            </div>
        );
    }



    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export default connect(({ projectDetail }) => ({ projectDetail }))(Form.create()(ProjectDetail));
