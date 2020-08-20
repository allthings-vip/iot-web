import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {message} from 'antd';
import {queryList, queryStatusNum, rejectOrder, updateOrderStatus, handleExcept, handleReceive} from '../../services/manifest/list';

const initState = {
    list: [], // 货单列表
    total: 0, // 总条数
    page: 1, // 当前页
    pageSize: 10, // 每页显示条数
    manifestStatus: '全部', // 货单状态，默认是全部
    statusNum: {}, // 状态数量
    exceptModalKey: Math.random(), // 异常处理Modal的key值
    exceptModalVisible: false, // 异常处理Modal是否可见
    exceptItem: {}, // 传入异常处理Modal的数据
    exceptOkBtnDisabled: false, // 异常处理的确定按钮是否可操作
    receiveModalKey: Math.random(), // 确认接货Modal的key值
    receiveModalVisible: false, // 确认接货Modal是否可见
    receiveItem: {}, // 传入确认接货Modal的数据
    receiveOkBtnDisabled: false, // 确认收货的确定按钮是否可操作
};

export default modelExtend(model, {
    namespace: 'manifestList',

    state: initState,

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/manifest/list') {
                    dispatch({
                        type: 'updateState',
                        payload:{
                            manifestStatus: query && query.status || '全部'
                        }
                    });
                    dispatch({
                        type: 'queryStatusNum'
                    });
                }
            });
        }
    },

    effects: {
        * queryList({payload}, {call, put}) {
            const data = yield call(queryList, payload);
            if (data && data.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.data || [],
                        total: data.count
                    }
                });
            }
        },
        * queryStatusNum(action, {call, put}) {
            const data = yield call(queryStatusNum, {});
            if (data && data.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: {
                        statusNum: data.data || {}
                    }
                });
            }
        },

        * rejectOrder(action, {call, put}) {
            const data = yield call(rejectOrder, action.payload);
            if (data && data.code === '0') {
                message.success('拒绝成功！', 2);
                action.onComplete && action.onComplete();
            }
        },

        * updateOrderStatus(action, {call, put}) {
            const data = yield call(updateOrderStatus, action.payload);
            if (data && data.code === '0') {
                message.success('操作成功！', 2);
                action.onComplete && action.onComplete();
            }
        },

        * handleExcept(action, {call, put}) {
            const data = yield call(handleExcept, action.payload);
            if (data && data.code === '0') {
                message.success('操作成功！', 2);
                action.onComplete && action.onComplete();
            } 
            yield put({
                type: 'updateState',
                payload: {
                    exceptOkBtnDisabled: false
                }
            });
        },

        * handleReceive(action, {call, put}) {
            const data = yield call(handleReceive, action.payload);
            if (data && data.code === '0') {
                message.success('操作成功！', 2);
                action.onComplete && action.onComplete();
            }
            yield put({
                type: 'updateState',
                payload: {
                    receiveOkBtnDisabled: false
                }
            });
        },
    },

    reducers: {
        
    }
})
