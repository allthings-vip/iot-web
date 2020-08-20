/**
 * Created by zhengchangshun on 2018/2/9.
 */
import modelExtend from 'dva-model-extend';
import {model} from "./common";
import {queryStatusNum, queryMsgList} from '../services/message'

export default modelExtend(model, {
    namespace: 'message',
    state: {
        list: [],   // 消息列表
        total: 0,    // 总条数
        pageNum: 1,     // 当前页
        pageSize: 10,  // 每页显示条数
        tabStatus: '业务消息', // 货单状态，默认是全部
        statusNum: [], // 状态数量
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname == '/message') {
                    dispatch({
                        type: 'updateState',
                        payload: {
                            tabStatus: query && query.status || '系统消息'
                        }
                    });
                    dispatch({
                        type: 'queryStatusNum'
                    });
                }
            })
        }
    },

    effects: {
        /*获取消息数量*/
        * queryStatusNum(action, {call, put}) {
            const data = yield call(queryStatusNum, {targetRole: 'express'});
            if (data && data.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: {
                        statusNum: data.data || {}
                    }
                });
            }
        },

        /*获取消息列表*/
        * queryMsgList({payload}, {call, put}) {
            const data = yield call(queryMsgList,
                Object.assign({}, payload, {targetRole: 'express'})
            );
            if (data && data.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.data || {},
                        total: data.count
                    }
                });
            }
        },
    },
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    }
})
