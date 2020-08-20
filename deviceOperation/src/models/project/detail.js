import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {weekDays, oneMonthDays, threeMonthDays} from '../../utils/time';
import moment from 'moment';
import {detail,queryStatus,query,getDeviceCounts,getPointCounts,getDeviceTop,getPointTop,logout,getKvsPoint,getAppSecret, getCode,getCallbackAddress,saveCallbackAddress} from '../../services/projectDetail';
import {Page} from '../../utils/constant';
import qs from 'query-string';

const timePresetData = [{val: weekDays + '', text: '近一周'}, {val: oneMonthDays + '', text: '近1月'}];
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const today = moment().add(0, 'days');
const timePreset = [moment().subtract(parseInt(timePresetData[1].val, 10), 'days'), today];

export default modelExtend(model, {
    namespace: 'projectDetail',

    state: {
         //列表数据
         queryData:{},
         statusNum: {}, // 状态数量,
         iotProjectId: '',
         statusData:{},
         devicesData:[],
         detailData:{},

         totalDeviceCounts:[],   //总设备数
         addDeviceCounts:[],   //新增设备数
         totalPointCounts:[],    //数据点数上升趋势
         addPointCounts:[],      //数据点数上升趋势
        //  projectTop:[],          //项目排行
        //  deviceTypeTop:[],       //设备类型排行
        //  pointTypeTop:[],        //点数按设备类型
        //  pointProjectTop:[],     //点数按项目
        //  tags:[],                //标签分布
        //  kvsPoints: [],          //点击标签
        //  kvsPointsTitle:'',
         timeFormat,
         timePreset,
         timePresetData,
        //  total: 0,               // 总条数
        //  page: 1,                // 当前页
        //  pageSize: 4,            // 每页显示条数
        //  statusNum: {}           // 状态数量
        appSecret: '',
        addressModal: false
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname,search}) => {
                if (pathname === '/project') {
                   let iotProjectId =  localStorage.getItem('iotProjectId');
                   let endTime = new Date(moment().add(0, 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime()+86400000;
                   let startTime =new Date(moment().subtract(parseInt(oneMonthDays, 10), 'days').format('YYYY-MM-DD') + ' 00:00:00').getTime();
                    dispatch({
                        type: 'detail',
                        payload:{
                            iotProjectId: iotProjectId || ''
                        }
                    });

                    dispatch({
                        type: 'query',
                        payload: {iotProjectId}
                    });
                    //总设备数
                    dispatch({
                        type: 'getTotalDeviceCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'total',
                            iotProjectId
                        }
                    });
                    //新增设备数
                    dispatch({
                        type: 'getAddDeviceCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'added',
                            iotProjectId
                        }
                    });
                    dispatch({
                        type: 'getTotalPointCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'total',
                            iotProjectId
                        }
                    });
                    dispatch({
                        type: 'getAddPointCounts',
                        payload:{
                            endDatetime:endTime,
                            startDatetime:startTime,
                            type:'added',
                            iotProjectId
                        }
                    });
                    // dispatch({
                    //     type: 'getProjectTop',
                    //     payload:{
                    //         endDatetime:endTime,
                    //         startDatetime:startTime,
                    //         type:'project',
                    //         top:5
                    //     }
                    // });
                    // dispatch({
                    //     type: 'getDeviceTypeTop',
                    //     payload:{
                    //         endDatetime:endTime,
                    //         startDatetime:startTime,
                    //         type:'deviceType',
                    //         top:5
                    //     }
                    // });
                    // //点数按项目排行
                    // dispatch({
                    //     type: 'getPointProject',
                    //     payload:{
                    //         endDatetime:endTime,
                    //         startDatetime:startTime,
                    //         type:'project',
                    //         top:5
                    //     }
                    // });
                    // //点数按类型排行
                    // dispatch({
                    //     type: 'getPointType',
                    //     payload:{
                    //         endDatetime:endTime,
                    //         startDatetime:startTime,
                    //         type:'deviceType',
                    //         top:5
                    //     }
                    // });
                    // //标签分布
                    // dispatch({
                    //     type: 'getPointTag',
                    //     payload:{
                    //         endDatetime:endTime,
                    //         startDatetime:startTime,
                    //         type:'tag',
                    //         top:5
                    //     }
                    // });
                }
            });
        }
    },
    
    effects: {
        * detail({payload}, {call, put}) {
            const data = yield call(detail, payload.iotProjectId);
            if (data && (data.code === 0 || data.rc === 0)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        detailData: data.data || data.ret,
                        iotProjectId: payload.iotProjectId
                    }
                });
                localStorage.setItem('createOperator', data.data.createOperator)
                localStorage.setItem('projectName', data.data.projectName)
                localStorage.setItem('iconUrl', data.data.imageUrl)
                // yield put({
                //     type: 'queryStatus',
                //     payload: {
                //         iotDeviceTypeId: data.ret.deviceTypes ? data.ret.deviceTypes[0].iotDeviceTypeId : '' ,
                //         iotProjectId: payload.iotProjectId, 
                //     }
                // });
            }
        },  
        * queryStatus({payload}, {call, put}) {
            const data = yield call(queryStatus, payload);
            // const data = yield call(detail);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        statusData: data.ret
                    }
                });
            }
        },
        * query({payload}, {call, put}) {
            const data = yield call(query, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        queryData: data.data
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
            if (data && (data.code === 0 || data.rc === 0)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        totalDeviceCounts: data.data || data.ret.items
                    }
                });
            }
        },
        //新增设备数
        * getAddDeviceCounts({payload}, {call, put}) {
            const data = yield call(getDeviceCounts, payload);
            if (data && (data.code === 0 || data.rc === 0)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addDeviceCounts: data.data || data.ret.items
                    }
                });
            }
        },
        //新增点数
        * getAddPointCounts({payload}, {call, put}) {
            const data = yield call(getPointCounts, payload);
            if (data && (data.code === 0 || data.rc === 0)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addPointCounts: data.data || data.ret.items
                    }
                });
            }
        },
        //总点数
        * getTotalPointCounts({payload}, {call, put}) {
            const data = yield call(getPointCounts, payload);
            if (data && (data.code === 0 || data.rc === 0)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        totalPointCounts: data.data || data.ret.items
                    }
                });
            }
        },
        * getAppSecret({payload}, {call, put}) {
            const data = yield call(getAppSecret, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        appSecret: data.data
                    }
                });
            }
        },
        * getCode({payload}, {call, put}) {
            const data = yield call(getCode, payload);
            if (data && data.code === 0) {
               message.success('验证码发送成功')
            }
        },
        * getCallbackAddress({payload}, {call, put}) {
            let iotProjectId =  localStorage.getItem('iotProjectId');
            payload.iotProjectId = iotProjectId;
            const data = yield call(getCallbackAddress, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        callbackAddress: data.data.pushUrl
                    }
                });
            }
        },
        * saveCallbackAddress({payload}, {call, put}) {
            const data = yield call(saveCallbackAddress, payload);
            if (data && data.code === 0) {
                // yield put({
                //     type: 'updateState',
                //     payload: {
                //         addressModal: false
                //     }
                // });
                message.success('保存成功')
            }
        },
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        }
    }
})
