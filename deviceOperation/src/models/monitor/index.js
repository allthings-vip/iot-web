import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {queryTags} from '../../services/common';
import {query,queryDetail,queryDeviceTypeByProjectId,queryProtocols,queryProject,regist,batchRegist} from '../../services/monitor';
import {Page} from '../../utils/constant';
export default modelExtend(model, {
    namespace: 'monitor',

    state: {
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        statusNum: {}, // 状态数量
        searchData:{},  //查询条件
        protocols:[],//协议类型下拉框的值
        //
        registModal:false,  //注册
        elementData:{},
        batchRegistModal:false, //批量注册
        keywords:'',
        projects:[] ,//所属项目
        deviceTypesByProjectId:[], //设备类型
       
        addressPoint:{
            address: '',
            lng: '',
            lat: '',
            province:'',
            city:'',
            district:''
        },
        tags:[],
        selectItem:{},
        selectItems:[],
        selectedRowKeys:[],
        batchBtn:true
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/monitor') {
                    dispatch({
                        type: 'query',
                        payload:{
                            pageIndex:Page.pageIndex,
                            pageSize:Page.pageSize,
                        }
                    });
                    dispatch({
                        type: 'queryProtocols'
                    });
                    
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put,select}) {
            let { searchData } = yield select(state => state.monitor);
            const data = yield call(query, payload);
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
        * queryProtocols({payload}, {call, put,select}) {
            const data = yield call(queryProtocols);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        protocols: data.data || [],
                    }
                });
            }
        },
        *  getProjectName({payload}, {call, put}) {
            const projectList = yield call(queryProject,
                {
                    pageIndex: 1,
                    pageSize: 10000, 
                });
            if (projectList && projectList.code === 0) {
                yield put({
                    type: 'updateState',
                    payload:{
                        projects: projectList.data.data || [],
                    }
                });
                
            }
        }, 
        *  getDeviceTypeByProjectId({payload}, {call, put}) {
            const deviceTypes = yield call(queryDeviceTypeByProjectId,payload);
            if (deviceTypes && deviceTypes.code === 0) {
                yield put({
                    type: 'updateState',
                    payload:{
                        deviceTypesByProjectId: deviceTypes.data || [],
                    }
                });
            }
        },
        *  getTags({payload}, {call, put}) {
            const Tags = yield call(queryTags,payload);
            if (Tags && Tags.code === 0) {
                yield put({
                    type: 'updateState',
                    payload:{
                        tags: Tags.data || [],
                    }
                });
            }
            
        }, 
        *  batchRegist({payload}, {call, put,select}) {
            let { searchData,pageIndex,pageSize } = yield select(state => state.monitor);
            const data = yield call(batchRegist, payload);
            if (data && data.code === 0) {
                message.success('操作成功');
                yield put({
                    type: 'query',
                    payload: {
                        ...searchData,
                        pageIndex: pageIndex ||Page.pageIndex,
                        pageSize: pageSize || Page.pageSize, 
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        batchRegistModal:false,
                    }
                });
            }
        }, 
        *  regist({payload}, {call, put,select}) {
            let { searchData,pageIndex,pageSize } = yield select(state => state.monitor);
            console.log(payload)
            const data = yield call(regist, payload);
            if (data && data.code === 0) {
                message.success('操作成功');
                yield put({
                    type: 'query',
                    payload: {
                        ...searchData,
                        pageIndex: pageIndex ||Page.pageIndex,
                        pageSize: pageSize || Page.pageSize, 
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        registModal:false,
                    }
                });
            }
        },     
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        }
    }
})
