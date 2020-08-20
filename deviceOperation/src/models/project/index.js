import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query,add,edit,deleteProject,queryDeviceType} from '../../services/project';
import {Page} from '../../utils/constant';
let index = 1;
let size = 12;
export default modelExtend(model, {
    namespace: 'project',

    state: {
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: index, // 当前页
        pageSize: size, // 每页显示条数
        statusNum: {}, // 状态数量
        deviceTypes:[],//设备类型
        keywords:"",
        //编辑页面数据
        editModal: false,
        editData:{},

        //新增页面数据
        addModal:false,
        
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/project') {
                    dispatch({
                        type: 'query',
                        payload:{
                            pageIndex: index,
                            pageSize: size, 
                        }
                    });

                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put, select }) {
            let { keywords } = yield select(state => state.project);
            payload.projectName = keywords;
            const data = yield call(query, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.ret ? data.ret.items : [],
                        total:data.ret ? data.ret.rowCount : 0,
                        pageIndex:payload.pageIndex || index,
                        pageSize:payload.pageSize ||  size,
                    }
                });
            }
        },   
        *  add({payload}, {call, put}) {
            const data = yield call(add, payload.item);
            if (data && data.rc === 0) {
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: index,
                        pageSize: size, 
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
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: index,
                        pageSize: size, 
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
            const data = yield call(deleteProject, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: index,
                        pageSize: size, 
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
        * queryDeviceType({payload}, {call, put}) {
            const data = yield call(queryDeviceType, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceTypes: data.ret.items || [],
                    }
                });
            }
        }, 
         
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
        changeEditModal(state, { payload }) {
            return {...state, ...payload}
        },
        changeAddModal(state, { payload }) {
            return {...state, ...payload}
        },
    }
})
