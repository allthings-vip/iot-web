
import React, {Component} from 'react'
import {connect} from 'dva'
import {Tabs} from 'antd';
import { getStampTime,getLocalTime } from '../../../utils/time';
import styles from './index.less';
import MsgList from '../../components/message/msgList';

const TabPane = Tabs.TabPane;

class Message extends Component {
    constructor(props) {
        super(props)
    }

    onTabChange = (key) => {
        this.props.dispatch({
            type: 'message/updateState',
            payload: {
                tabStatus: key,
                pageNum: 1
            }
        });

        if((key === '系统消息' && this.system !== undefined)
            || (key === '业务消息' && this.business !== undefined)
            || (key === '支付消息' && this.pay !== undefined)  ){
            setTimeout(() => {
                this.queryMsgList();
                this.props.dispatch({
                    type: 'message/queryStatusNum',
                });
            }, 0);
        }
    }

    queryMsgList = (params = {}) => {
        const {tabStatus, pageSize, pageNum} = this.props.message;
        let paramsData = {
            pageNum: params.pageNum !== undefined ? params.pageNum : pageNum,
            pageSize: pageSize,
            messageBusiType: params.status || tabStatus
        };
        this.props.dispatch({type: 'message/queryMsgList', payload: paramsData});
    }


    render() {
        const {message, dispatch} = this.props;
        const {list, total, pageNum, pageSize, tabStatus, statusNum} = message;
        /*消息数量*/
        let statusNumMap = {};
        statusNum.forEach(item => {
            statusNumMap[item.messageBusiType] = item.count
        })

        const tab1Num = statusNumMap['系统消息'] ? ('(' + statusNumMap['系统消息'] + ')') : '';
        const tab2Num = statusNumMap['业务消息'] ? ('(' + statusNumMap['业务消息'] + ')') : '';
        const tab3Num = statusNumMap['支付消息'] ? ('(' + statusNumMap['支付消息'] + ')') : '';

        const MsgListProps = {
            list,
            total,
            pageNum,
            pageSize,
            tabStatus,
            queryMsgList: this.queryMsgList,
            setPage: (pageNum) => {
                this.queryMsgList({pageNum})
                dispatch({
                    type: "message/updateState",
                    payload: {
                        pageNum
                    }
                })

            }
        }

        return (
            <div className={styles.listWrap}>
                <Tabs type="card" onChange={this.onTabChange} defaultActiveKey={tabStatus} className='tf-tabs'>
                    <TabPane tab={"系统消息" + tab1Num} key="系统消息">
                        <MsgList ref={el => this.system = el}  {...MsgListProps}/>
                    </TabPane>
                    <TabPane tab={"业务消息" + tab2Num} key="业务消息">
                        <MsgList ref={el => this.business = el} {...MsgListProps}/>
                    </TabPane>
                    <TabPane tab={"支付消息" + tab3Num} key="支付消息">
                        <MsgList ref={el => this.pay = el} {...MsgListProps}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default connect(({message}) => ({message}))(Message);
