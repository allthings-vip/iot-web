import modelExtend from 'dva-model-extend';
import { model } from './common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {weekDays, oneMonthDays, threeMonthDays} from '../utils/time';
import moment from 'moment';
import {query,getDeviceCounts,getPointCounts,getDeviceTop,getPointTop,logout,getKvsPoint } from '../services/index';
const timePresetData = [{val: weekDays + '', text: '近一周'}, {val: oneMonthDays + '', text: '近1月'}];
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const today = moment().add(0, 'days');
const timePreset = [moment().subtract(parseInt(timePresetData[1].val, 10), 'days'), today];

export default modelExtend(model, {
    namespace: 'index',

    state: {
        queryData:{},           //首页汇总数据
        totalDeviceCounts:[],   //总设备数
        addedDeviceCounts:[],   //新增设备数
        totalPointCounts:[],    //数据点数上升趋势
        addPointCounts:[],      //数据点数上升趋势
        projectTop:[],          //项目排行
        deviceTypeTop:[],       //设备类型排行
        pointTypeTop:[],        //点数按设备类型
        pointProjectTop:[],     //点数按项目
        tags:[],                //标签分布
        kvsPoints: [],          //点击标签
        kvsPointsTitle:'',
        timeFormat,
        timePreset,
        timePresetData,
        total: 0,               // 总条数
        page: 1,                // 当前页
        pageSize: 4,            // 每页显示条数
        statusNum: {}           // 状态数量
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/') {
                    let endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
                    let startTime =new Date(moment().subtract(parseInt(weekDays, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime();
                    dispatch({type: 'query'});
                    //总设备数
                    dispatch({
                        type: 'getTotalDeviceCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'total'
                        }
                    });
                    //新增设备数
                    dispatch({
                        type: 'getAddDeviceCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'added'
                        }
                    });
                    dispatch({
                        type: 'getTotalPointCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'total'
                        }
                    });
                    dispatch({
                        type: 'getAddPointCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'added',
                            top:5
                        }
                    });
                    dispatch({
                        type: 'getProjectTop',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'project',
                            top:5
                        }
                    });
                    dispatch({
                        type: 'getDeviceTypeTop',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'deviceType',
                            top:5
                        }
                    });
                    //点数按项目排行
                    dispatch({
                        type: 'getPointProject',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'project',
                            top:5
                        }
                    });
                    //点数按类型排行
                    dispatch({
                        type: 'getPointType',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'deviceType',
                            top:5
                        }
                    });
                    //标签分布
                    dispatch({
                        type: 'getPointTag',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'tag',
                            top:5
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
                        queryData: data.ret
                    }
                });
            }
        },
        * logout({payload}, {call, put}) {
            const data = yield call(logout, payload);
            if (data && data.rc === 0) {
            }
        },
        
        //总设备数
        * getTotalDeviceCounts({payload}, {call, put}) {
            const data = yield call(getDeviceCounts, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        totalDeviceCounts: data.ret.items
                    }
                });
            }
        },
        //新增设备数
        * getAddDeviceCounts({payload}, {call, put}) {
            const data = yield call(getDeviceCounts, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addDeviceCounts: data.ret.items
                    }
                });
            }
        },
        //新增点数
        * getAddPointCounts({payload}, {call, put}) {
            const data = yield call(getPointCounts, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addPointCounts: data.ret.items
                    }
                });
            }
        },
        //总点数
        * getTotalPointCounts({payload}, {call, put}) {
            const data = yield call(getPointCounts, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        totalPointCounts: data.ret.items
                    }
                });
            }
        },
        //按项目排行
        * getProjectTop({payload}, {call, put}) {
            const data = yield call(getDeviceTop, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        projectTop: data.ret.items
                    }
                });
            }
        },
        //按设备类型排行
        * getDeviceTypeTop({payload}, {call, put}) {
            const data = yield call(getDeviceTop, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceTypeTop: data.ret.items
                    }
                });
            }
        },
        //点数按项目排行
        * getPointProject({payload}, {call, put}) {
            const data = yield call(getPointTop, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        pointProjectTop: data.ret.items
                    }
                });
            }
        },   
        * getPointType({payload}, {call, put}) {
            const data = yield call(getPointTop, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        pointTypeTop: data.ret.items
                    }
                });
            }
        },     
        //按标签分布
        * getPointTag({payload}, {call, put}) {
            const data = yield call(getDeviceTop, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        tags: data.ret.items || []
                    }
                });
                yield put ({
                    type:'getKvsPoint',
                    payload:{
                        startDatetime: payload.startDatetime,
                        endDatetime: payload.endDatetime,
                        iotTagId: data.ret.items.length>0  ? data.ret.items[0].iotTitleId :'',
                        ///devices/tag/counts
                    }
                })
                yield put ({
                    type:'updateState',
                    payload:{
                        kvsPointsTitle:data.ret.items.length>0  ? data.ret.items[0].title :'',
                        ///devices/tag/counts
                    }
                })
            }
        },
        * getKvsPoint({payload}, {call, put}) {
            const data = yield call(getKvsPoint, payload);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        kvsPoints: data.ret.items || []
                    }
                });
            }
        },

    },
    reducers: {
    }
})
