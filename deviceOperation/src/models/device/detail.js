import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {detail,getalarm,getFactorValues} from '../../services/device';
import {Page} from '../../utils/constant';
import qs from 'query-string';
import {throttle } from 'lodash'
let timer = null;
export default modelExtend(model, {
    namespace: 'deviceDetail',

    state: {
        //列表数据
        deviceInfo:{},
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        statusNum: {}, // 状态数量
        factorValue:[], // 因子时间，值
        chartList:[],   //图表数据。
        factorCodes:[],
        deviceCode:'',
        factorName:'',
        //
        chartModal:false,
        alarmInfo:[],
        totalA: 0, // 总条数
        pageIndexA: Page.pageIndex, // 当前页
        pageSizeA: Page.pageSize, // 每页显示条数
        factorTimer:timer,
        series:[]
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, search}) => {
                console.log(pathname);
                
                if (pathname === '/device/detail') {
                    const query = qs.parse(search);
                    dispatch({
                        type: 'detail',
                        payload:{
                            iotDeviceId:query.iotDeviceId || '',
                            onComplate: (deviceInfo) => {
                                dispatch({
                                    type: 'getFactorValues',
                                    payload: {
                                        deviceCode: deviceInfo.deviceCode || '',
                                        factorCodes: (deviceInfo.factorList || []).map(v=>{
                                            return v.factorCode
                                        })
                                    },
                                });
                                timer = setInterval(() => {
                                    dispatch({
                                        type: 'getFactorValues',
                                        payload: {
                                            deviceCode: deviceInfo.deviceCode || '',
                                            factorCodes: (deviceInfo.factorList || []).map(v=>{
                                                return v.factorCode
                                            })
                                        },
                                    });
                                }, 3000);
                                dispatch({
                                    type: 'updateState',
                                    payload: {
                                        factorTimer: timer
                                    },
                                });
                            }
                        }
                        
                    });
                } else {
                    clearInterval(timer);
                    //clearInterval(factorTimer);
                    dispatch({
                        type: 'clearFactorTimer',
                    });
                }
            });
        }
    },
    
    effects: {
        * detail({payload}, {call, put}) {
            const data = yield call(detail, payload.iotDeviceId);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceInfo: data.ret || {},
                        total:data.ret.rowCount || 0,
                        pageIndex:payload.pageIndex || Page.pageIndex,
                        pageSize:payload.pageSize ||  Page.pageSize,
                    }
                });
                console.log('dsd2')
                payload.onComplate &&  payload.onComplate(data.ret || {})
                console.log('dsd3')
                
            }
        },
        * getFactorValues({payload}, {call, put}) {
            const data = yield call(getFactorValues, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        factorValue: data.ret.items || [],
                    }
                });
            }
        },
        
        * getAlarm({payload}, {call, put}) {
            const data = yield call(getalarm, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        alarmInfo: data.ret.items || [],
                    }
                });
            }
        },
        * getChartVlaue({payload}, {call, put}) {
            const data = yield call(getFactorValues, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        chartList: data.ret.items || [],
                        factorCodes: payload.factorCodes,
                        deviceCode:payload.deviceCode
                    }
                });
            }
        
        },
        * clearFactorTimer ({payload}, {call, put,select}) {
            let {factorTimer} =yield select(state => state.deviceDetail);
            clearInterval(factorTimer);
        }
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
        changeChartModal(state, { payload }) {
            return {...state, ...payload}
        },
    }
})
