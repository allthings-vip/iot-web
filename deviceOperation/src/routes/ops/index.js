import React from 'react';
import {connect} from 'dva';
import {Tabs, Breadcrumb, Spin} from 'antd';
const TabPane = Tabs.TabPane;

import TopoPage from '../../components/ops/topoPage';
import ListPage from '../../components/ops/listPage';
import OpsDetail from '../../components/ops/opsDetail'
import TfIcon from '../../components/common/TfIcon/index';

import styles from './index.less';

class OpsMonitor extends React.Component {
    constructor(props) {
        super(props);
    }

    queryDetailData = (record) => {
        this.props.dispatch({
            type: 'opsmonitor/opsDetail',
            payload: {
                ip: record.ip,
                port: record.port
            }
        })

        this.timeout = setTimeout(() => this.queryDetailData(record), 2000);
    }

    cancelTimeout = () => {
        clearTimeout(this.timeout);
    }

    onChange = (activeKey) => {
        if (activeKey == '1') {
            this.props.dispatch({
                type: 'opsmonitor/updateState',
                payload: {
                    activeKey
                }
            })
        } else {
            this.props.dispatch({
                type: 'opsmonitor/updateState',
                payload: {
                    activeKey,
                    loadingTopo: true
                }
            })
            this.props.dispatch({
                type: 'opsmonitor/opsTopo',
            })
        }

        
    }

    render() {
        const { opsmonitor, dispatch, loading, app } = this.props;
        const { userInfo } = app;
        const { listData, total, pageIndex, pageSize, detailModal, detailData, cpuData, reportTime, topoData, heapData, nonHeapData, netSpeedData, detailRecord, loading1, activeKey, loadingTopo } = opsmonitor;
        const listProps = {
            queryDetailData: this.queryDetailData,
            dispatch,
            loading,
            userInfo,
            ...opsmonitor
        }
        const topoProps = {
            topoData,
            queryDetailData: this.queryDetailData,
            dispatch
        }

        const opsDetailProps = {
            dispatch,
            detailData,
            cancelTimeout: this.cancelTimeout,
            cpuData,
            reportTime,
            heapData,
            nonHeapData,
            netSpeedData,
            detailRecord,
            loading1
        }
        return (
            <div className={styles.container}>
                {
                    detailModal ? (
                        <OpsDetail {...opsDetailProps}/> 
                    ) : (
                        <React.Fragment>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <TfIcon type="local" style={{color:'#0385ff'}}/>
                                    <span>运维监控</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <Tabs activeKey={activeKey} onChange={this.onChange}>
                                <TabPane tab='列表展示' key='1'>
                                    <ListPage {...listProps} ref={node => this.listpage  = node}/>
                                </TabPane>
                                <TabPane tab='拓扑展示' key='2'>
                                    <Spin spinning={loadingTopo}>
                                        {loadingTopo ? ('') : <TopoPage {...topoProps}/>}
                                    </Spin>
                                </TabPane>
                            </Tabs>
                        </React.Fragment>
                    )
                }
            </div>
        )
    }
}

export default connect(({app, opsmonitor, loading})=>({app, opsmonitor, loading}))(OpsMonitor);

