import modelExtend from 'dva-model-extend';
import {model} from '../common';
import queryString from 'query-string';
import {message} from 'antd'
import {queryDetail, querylogisticsInfo} from '../../services/manifest/detail';
import {rejectOrder, updateOrderStatus, handleExcept, handleReceive} from '../../services/manifest/list';

export default modelExtend(model, {
    namespace: 'manifestDetail',
    state: {
        exceptModalKey: Math.random(),   // 异常处理Modal的key值
        exceptModalVisible: false, // 异常处理Modal是否可见
        exceptOkBtnDisabled: false, // 异常处理的确定按钮是否可操作
        receiveModalKey: Math.random(), // 确认接货Modal的key值
        receiveModalVisible: false, // 确认接货Modal是否可见
        receiveOkBtnDisabled: false, // 确认收货的确定按钮是否可操作
        orderInfo: {
            button: {},
            goods: [{
                goodsName: "",
                goodsType: "",
                goodsWeight: "",
                goodsVolume: "",
                goodsNumber: "",
                goodsValue: "",
            }],
            paymentCollection: [],
            requestOrder: {
                status: "",
                mallWorthList: []
            }
        },
        logisticsInfo: []
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname,search}) => {
                if (pathname === '/manifest/detail') {
                    const query = queryString.parse(search);
                    if (query && query.requestOrderNo && query.businessPartId) {
                        dispatch({
                            type: 'queryManifestDetail',
                            payload: {
                                requestOrderNo: query.requestOrderNo,
                                businessPartId: query.businessPartId
                            }
                        });

                        dispatch({
                            type: 'querylogisticsInfo',
                            payload: {
                                requestOrderNoList: query.requestOrderNo,
                            }
                        });
                    }
                }
            });
        }

    },

    effects: {
        /*获取订单信息*/
        * queryManifestDetail({payload}, {call, put}) {
            const res = yield call(queryDetail, payload);
            yield put({
                type: 'updateState',
                payload: {
                    orderInfo: res.data || {},
                }
            });
        },
        /*获取物流信息*/
        * querylogisticsInfo({payload}, {call, put}) {
            const res = yield call(querylogisticsInfo, payload);
            yield put({
                type: 'updateState',
                payload: {
                    logisticsInfo: res.data[0].tfLogisticsNodeInfoList || [],
                }
            });
        },
        /*拒绝订单*/
        * rejectOrder(action, {call, put}) {
            const data = yield call(rejectOrder, action.payload);
            if (data && data.code === '0') {
                message.success('操作成功！', 2);
                action.onComplete && action.onComplete();
            }
        },
        /*确认签收，已处理*/
        * updateOrderStatus(action, {call, put}) {
            const data = yield call(updateOrderStatus, action.payload);
            if (data && data.code === '0') {
                message.success('操作成功！', 2);
                action.onComplete && action.onComplete();
            }
        },
        /*异常处理*/
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
        /*确认接货*/
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
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    }

})
