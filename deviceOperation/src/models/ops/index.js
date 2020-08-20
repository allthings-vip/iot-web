import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {queryTags} from '../../services/common';
import {opsList, opsDetail, opsTopo, addService, detailService, editService, delService} from '../../services/ops';
import {Page} from '../../utils/constant';
import { getLocalTimeF } from '../../utils/time';
export default modelExtend(model, {
    namespace: 'opsmonitor',

    state: {
        listData: [], // 列表
        total: '',
        pageIndex: Page.pageIndex,
        pageSize: Page.pageSize,

        detailData: {}, //服务详情
        detailModal: false,

        cpuData: [], // CPU使用率
        reportTime: [], // 上报时间
        heapData: [], //堆内存
        nonHeapData: [], // 非堆内存
        netSpeedData: [], //网络流量

        detailRecord: {}, //列表传给详情的数据

        topoData: [],
        addModal: false,
        value: {},

        detail: {},
        editModal: false,
        loading1: false,

        activeKey: '1',
        loadingTopo: false
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/ops') {
                   dispatch({
                       type: 'opsList',
                       payload: {
                            pageIndex:Page.pageIndex,
                            pageSize:Page.pageSize,
                       }
                   })
                //    dispatch({
                //        type: 'opsTopo',
                //    })
                    dispatch({
                        type: 'updateState',
                        payload: {
                            detailModal: false,
                            detailData: {},
                            value: {},
                            activeKey: '1'
                        }
                    })
                }
            });
        }
    },
    
    effects: {
        * opsList({payload}, {call, put, select}) {
             const data = yield call(opsList, payload);

             if(data && data.code === 0) {
                 yield put({
                     type: 'updateState',
                     payload: {
                        listData: data.data.data || [],
                        total:data.data.total,
                        pageIndex:payload.pageIndex || Page.pageIndex,
                        pageSize:payload.pageSize ||  Page.pageSize,
                     }
                 })
             }
        },
        * opsTopo({payload}, {call, put, select}) {
            const data = yield call(opsTopo, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        topoData: data.data.data,
                        loadingTopo: false
                        // activeKey: '2'
                    }
                })
            }
        },
        * opsDetail({payload}, {call, put, select}) {
            let { cpuData, reportTime, heapData, nonHeapData, netSpeedData } = yield select(state => state.opsmonitor)
            const data = yield call(opsDetail, payload);
            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        loading1: true,
                       detailData: data.data || {},
                    }
                })
                if (data.data && Object.keys(data.data).length) {
                    yield put({
                        type: 'updateState',
                        payload: {
                           cpuData: cpuData.concat([data.data.cpu]),
                           heapData: heapData.concat([data.data.heap]),
                           nonHeapData: nonHeapData.concat([data.data.nonHeap]),
                           netSpeedData: netSpeedData.concat([data.data.netSpeed]),
                           reportTime: reportTime.concat([getLocalTimeF(data.data.reportTime)])
                        }
                    })
                }
            } 
       },
       * addService({payload}, {call, put, select}) {
            const data = yield call(addService, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addModal: false,
                        value: {}
                    }
                })

                yield put({
                    type: 'opsList',
                    payload: {
                        pageIndex:Page.pageIndex,
                        pageSize:Page.pageSize
                    }
                })
            }
        },
        * editService({payload}, {call, put, select}) {
            const data = yield call(editService, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        editModal: false,
                        value: {}
                    }
                })

                yield put({
                    type: 'opsList',
                    payload: {
                        pageIndex:Page.pageIndex,
                        pageSize:Page.pageSize
                    }
                })
            }
        },
        * detailService({payload}, {call, put, select}) {
            const data = yield call(detailService, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        detail: data.data,
                        editModal: true
                    }
                })
            }
        },
        * delService({payload}, {call, put, select}) {
            const data = yield call(delService, payload);

            if(data && data.code === 0) {
                message.success('删除成功');
                yield put({
                    type: 'updateState',
                    payload: {
                        value: {}
                    }
                })

                yield put({
                    type: 'opsList',
                    payload: {
                        pageIndex:Page.pageIndex,
                        pageSize:Page.pageSize
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
