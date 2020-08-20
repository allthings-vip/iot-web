import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query,add,edit,deleteE,queryFactor,queryDetail} from '../../services/protocol';
import {Page} from '../../utils/constant';
export default modelExtend(model, {
    namespace: 'protocol',

    state: {
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        statusNum: {}, // 状态数量
        factors:[],
        //
        editModal:false,
        protocolData:{},
        addModal:false,
        dataAggType:[], //聚合类型
        keywords:''
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/protocol') {
                    dispatch({
                        type: 'query',
                        payload:{
                            pageIndex:Page.pageIndex,
                            pageSize:Page.pageSize,
                        }
                    });
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put,select}) {
            let { keywords } = yield select(state => state.protocol);
            payload.keywords = keywords;
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
        *  add({payload}, {call, put}) {
            const data = yield call(add, payload.item);
            if (data && data.rc === 0) {
                message.success('操作成功');
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: Page.pageIndex,
                        pageSize: Page.pageSize, 
                    }
                });
                yield put({
                    type: 'changeAddModal',
                    payload: {
                        addModal:false
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        keywords:''
                    }
                });
            }
        },   
        *  edit({payload}, {call, put}) {
            const data = yield call(edit, payload.item);
            if (data && data.rc === 0) {
                message.success('操作成功');
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: Page.pageIndex,
                        pageSize: Page.pageSize, 
                    }
                });
                yield put({
                    type: 'changeEditModal',
                    payload: {
                        editModal:false
                    }
                });
            }
        },   
        *  delete({payload}, {call, put}) {
            const data = yield call(deleteE, payload);
            if (data && data.rc === 0) {
                message.success('操作成功');
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: Page.pageIndex,
                        pageSize: Page.pageSize, 
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        keywords:''
                    }
                });
            }
        },       
        *  queryFactor({payload}, {call, put}) {
            const data = yield call(queryFactor, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        factors: data.ret.items || [],
                    }
                });
            }
        }, 
        *  queryDetail({payload}, {call, put}) {
            const data = yield call(queryDetail, payload.iotProtocolId);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        protocolData: data.ret || {},
                    }
                });
            }
        }, 
        
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
        changeAddModal(state, { payload }) {
            return {...state, ...payload}
        },
        changeEditModal(state, { payload }) {
            return {...state, ...payload}
        },
    }
})
