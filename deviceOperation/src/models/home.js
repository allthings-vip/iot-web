import modelExtend from 'dva-model-extend';
import { model } from './common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {queryOverview,query,add,edit,deleteProject,queryCollaborators,queryDeviceType,confirmProject, detail} from '../services/home';
// import {queryOverview} from '../services/index'
import {Page} from '../utils/constant';
let index = 1;
let size = 12;
export default modelExtend(model, {
    namespace: 'home',

    state: {
        //统计数据
        overview:{},
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: index, // 当前页
        pageSize: size, // 每页显示条数
        statusNum: {}, // 状态数量
        deviceTypes:[],//设备类型
        projectName:"",
        collaborators:[],//协作者列表
        //编辑页面数据
        editModal: false,
        editData:{},

        //新增页面数据
        addModal:false,
        
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/') {
                    dispatch({
                        type: 'query',
                        payload:{
                            pageIndex: index,
                            pageSize: size, 
                        }
                    });
                    dispatch({
                        type: 'queryOverview'
                    });

                }
            });
        }
    },
    
    effects: {
        * queryOverview({payload}, {call, put, select }) {
            const data = yield call(queryOverview);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        overview:data.data
                    }
                });
            }
        }, 
        * query({payload}, {call, put, select }) {
            const data = yield call(query, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.data ? data.data.data : [],
                        total:data.data ? data.data.total : 0,
                        pageIndex:payload.pageIndex || index,
                        pageSize:payload.pageSize ||  size,
                    }
                });
            }
        },  
        * queryCollaborators({payload}, {call, put, select }) {
            const {collaborators} = yield select(state => state.home)
            const data = yield call(queryCollaborators, payload);
            if (data && data.code === 0) {
                if (data.data) {
                    let doexist = ''
                    doexist = collaborators.length && collaborators.some(item => {
                        return item.iotUserId == data.data.iotUserId
                    })
                    if (doexist) {
                        message.error('已添加')
                    } else {
                        yield put({
                            type: 'updateState',
                            payload: {
                                collaborators: collaborators.concat(data.data ? [data.data] : [])
                            }
                        });
                    }
                } else {
                    message.info('没有符合条件的协作人员')
                }
            }
        }, 
        
        *  add({payload}, {call, put}) {
            const data = yield call(add, payload.item);
            if (data && data.code === 0) {
                yield put({
                    type: 'queryOverview'
                });
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
                        projectName:'',
                        addModal:false,
                        pageIndex:index,
                        pageSize:size,
                        collaborators: []
                    }
                });
            }
        },   
        *  edit({payload}, {call, put,select}) {
            const data = yield call(edit, payload.item);
            if (data && data.code === 0) {
                let { projectName,pageIndex,pageSize } = yield select(state => state.home);
                yield put({
                    type: 'query',
                    payload: {
                        projectName,
                        pageIndex: index,
                        pageSize: size, 
                    }
                });
                yield put({
                    type: 'queryOverview'
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        editModal:false,
                        pageIndex:index,
                        pageSize:size,
                        collaborators: []
                    }
                });
            }
        },   
        *  delete({payload}, {call, put,select}) {
            const data = yield call(deleteProject, payload);
            let { projectName,pageIndex,pageSize } = yield select(state => state.home);
            console.log(data);
            if (data && data.code === 0) {
                yield put({
                    type: 'queryOverview'
                });
                yield put({
                    type: 'query',
                    payload: {
                        projectName,
                        pageIndex: index,
                        pageSize: size, 
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        pageIndex:index,
                        pageSize:size
                    }
                });
                message.success('操作成功');
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
        * confirmProject({payload}, {call, put,select}) {
            const data = yield call(confirmProject, payload);
            let { projectName,pageIndex,pageSize } = yield select(state => state.home);
            if (data && data.data === 0) {
                yield put({
                    type: 'queryOverview'
                });
                yield put({
                    type: 'query',
                    payload: {
                        projectName,
                        pageIndex: index,
                        pageSize: size,  
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        pageIndex:index,
                        pageSize:size
                    }
                });
                message.success('审核成功');
            }
        }, 
        * detail({payload}, {call, put}) {
            const data = yield call(detail, payload.iotProjectId);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        collaborators: data.data.iotUserList || []
                    }
                })
            }
        },  
         
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        }
    }
})
