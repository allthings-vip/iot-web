import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query,queryAlarm} from '../../services/alarm';
import {Page} from '../../utils/constant';
export default modelExtend(model, {
    namespace: 'alarm',

    state: {
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        statusNum: {}, // 状态数量
        alarmList: [], // 项目数据列表
        alarmTotal: 0, // 总条数
        alarmPageIndex: Page.pageIndex, // 当前页
        alarmPageSize: Page.pageSize, // 每页显示条数
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/alarm') {
                    dispatch({
                        type: 'updateState',
                        payload:{
                            pageIndex:Page.pageIndex,
                            pageSize:Page.pageSize,
                            list:[],
                            total:0,
                            alarmList: [], // 项目数据列表
                            alarmTotal: 0, // 总条数
                            alarmPageIndex: Page.pageIndex, // 当前页
                            alarmPageSize: Page.pageSize, // 每页显示条数
                        }
                    });
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put}) {
            const data = yield call(query, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.ret.items || [],
                        total:data.ret.rowCount,
                        pageIndex:payload.pageIndex || Page.pageIndex,
                        pageSize:payload.pageSize ||  Page.pageSize,
                    }
                });
            }
        },   
        * queryAlarm({payload}, {call, put}) {
            const data = yield call(queryAlarm, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        alarmList: data.ret.items || [],
                        alarmTotal:data.ret.rowCount,
                        alarmPageIndex:payload.pageIndex || Page.pageIndex,
                        alarmPageSize:payload.pageSize ||  Page.pageSize,
                    }
                });
            }
        },
             
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
    }
})
