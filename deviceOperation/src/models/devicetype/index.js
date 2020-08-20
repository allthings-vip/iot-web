import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {queryFactor,queryTags,queryProtocols} from '../../services/common';
import {query,changeStatus,deleteType,add,edit} from '../../services/devicetype';
import {Page} from '../../utils/constant';
export default modelExtend(model, {
    namespace: 'deviceType',

    state: {
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        statusNum: {}, // 状态数量
        keywords:"",
        //新增页面数据
        addModal: false,
        addData:{},

        //编辑页面数据
        editModal: false,
        editData:[],

        //详情页面数据
        detailModal: false,
        detailData:[],

        //因子factors
        factors:[],
        protocols:[],
        tags:[]
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/deviceType') {
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
            let iotProjectId = localStorage.getItem('iotProjectId')
            let { keywords } = yield select(state => state.deviceType);
            payload.keywords = keywords;
            const data = yield call(query, {...payload, iotProjectId});
            
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.data.data || [],
                        total:data.data.total,
                        pageIndex:payload.pageIndex || Page.pageIndex,
                        pageSize:payload.pageSize ||  Page.pageSize,
                    }
                });
            }
        }, 
        * changeStatus({payload}, {call, put}) {
            const data = yield call(changeStatus, payload);
            if (data && data.rc === 0) {
                message.success('操作成功');
                yield put({
                    type: 'updateState',
                    payload: {
                    }
                });
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex:Page.pageIndex,
                        pageSize:Page.pageSize,
                    }
                });
            }
        },
        * delete({payload}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(deleteType, {...payload, iotProjectId});
            if (data && data.code === 0) {
                message.success('操作成功');
                yield put({
                    type: 'updateState',
                    payload: {
                        keywords:''
                    }
                });
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex:Page.pageIndex,
                        pageSize:Page.pageSize,
                    }
                });
            }
        },  
        *  add({payload}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(add, {...payload, iotProjectId});
            if (data && data.code === 0) {
                message.success('保存成功')
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
        *  edit({payload}, {call, put,select}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(edit, {...payload, iotProjectId});
            if (data && data.code === 0) {
                message.success('保存成功')
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
        *  queryDataAggType({payload}, {call, put}) {
            // const data = yield call(queryFactor, payload);
            // if (data && data.rc === 0) {
            //     yield put({
            //         type: 'updateState',
            //         payload: {
            //             factors: data.ret.items || [],
            //         }
            //     });
            // }
            // const Tags = yield call(queryTags);
            // if (Tags && Tags.rc === 0) {
            //     yield put({
            //         type: 'updateState',
            //         payload:{
            //             tags: Tags.ret.items || [],
            //         }
            //     });
            // }
            const Protocols = yield call(queryProtocols,payload);
            if (Protocols && Protocols.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        protocols: Protocols.data || [],
                    }
                });
            }
        },  
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
        changeDetailModal(state, { payload }) {
            return {...state, ...payload}
        },
        changeAddModal(state, { payload }) {
            return {...state, ...payload}
        },
        changeEditModal(state, { payload }) {
            return {...state, ...payload}
        },
    }
})
