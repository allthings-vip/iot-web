import modelExtend from 'dva-model-extend';
import { model } from '../common';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
    query, detail, detailQuery, changeStatus, deleteType, add, edit,
    projectsName, deviceType, queryProject,
    queryDeviceType, queryDeviceTypeByProjectId,
    queryPointslatest, queryFactorList, querykvsPoints, queryAllByIotDeviceType,
    queryevents, querylogs, handleEvent, queryDeviceCounts, queryevent, queryChannel, eventDetail, getLiveStream, cameraCtrl, cameraStop, getPlayBack
} from '../../services/device';
import { queryTags, queryFactor } from '../../services/common';
import { queryRoad } from '../../services/deviceDistribution';
import { Page } from '../../utils/constant';
import qs from 'query-string';
export default modelExtend(model, {
    namespace: 'device',

    state: {
        //列表数据
        list: [], // 项目数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        statusNum: {}, // 状态数量
        selectItems: [],
        selectItem: {},//点击列表中详情
        searchData: {},
        listMap: [],//地图数据
        //列表页面
        projects: [],
        tags: [],
        deviceTypes: [],
        deviceTypesByProjectId: [],
        status: [],
        deviceCounts: {}, //在线离线数据
        //新增页面数据
        addModal: false,
        projectData: [],
        deviceTypeData: [],
        addressPoint: {
            address: '',
            lng: '',
            lat: '',
            province: '',
            city: '',
            district: ''
        },

        //编辑页面数据
        editModal: false,
        editData: {},
        addressEditPoint: {
            address: '',
            lng: '',
            lat: '',
            province: '',
            city: '',
            district: ''
        },
        //导入数据
        importModal: false,

        //详情页面数据
        detailModal: false,
        deviceInfo: {},//设备详情数据
        //设备数据页面
        latestPoints: [], //实时数据
        factors: [],//因子列表
        factorsList: [],//checkbox因子列表
        kvspoints: [], // 因子数据(图表用)
        //设备事件页面
        eventList: [],   //事件列表数据
        eventTotal: 0,   //事件条数
        iotDeviceEventId: '',//处理事件ID
        eventModal: false,//设备事件处理
        eventPageIndex: Page.pageIndex, // 当前页
        eventPageSize: Page.pageSize, // 每页显示条数
        eventDetailData: {}, //事件详情
        //设备日志页面
        logList: [], //日志列表
        logTotal: 0,   //日志条数
        logPageIndex: Page.pageIndex, // 当前页
        logPageSize: Page.pageSize, // 每页显示条数
        roadData: [],
        roadModal: false,

        channelLatestPoints: [], // 通道实时数据
        channelData: [], // 通道数据
        passTypeData: [],//通道类型
        channelSelected: {}, //选中的通道
        channelFactors: [], // 通道数据因子列表
        channelFactorsList: [], // 通道数据checkbox因子列表
        channelKvspoints: [], // 通道数据因子数据
        videoModal: false,
        liveStreamUrl: {},
        videoButton: false, //控制查看视频按钮显隐
        bodyLoading: false //通道页加载效果
    },

    subscriptions: {
        setup ({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/device') {
                    const searchData = qs.parse(search);
                    const { iotDeviceId, deviceCode, iotProjectId, iotDeviceTypeId } = searchData
                    dispatch({
                        type: 'updateState',
                        payload: {
                            kvspoints: [],
                            factorsList: [],
                            channelFactorsList: [],
                            channelKvspoints: [],
                            channelSelected: {},
                            channelFactors: [],
                            liveStreamUrl: {},
                            videoButton: false, //控制查看视频按钮显隐
                            bodyLoading: false
                        }
                    })

                    if (iotDeviceId) {
                        dispatch({
                            type: 'detailQuery',
                            payload: {
                                iotDeviceId
                            },
                            callback: () => {
                                dispatch({
                                    type: 'updateState',
                                    payload: {
                                        detailModal: true,
                                    }
                                })
                            }
                        })
                        dispatch({
                            type: 'updateState',
                            payload: {
                                // detailModal:true,
                                selectItem: { iotDeviceId, deviceCode, iotProjectId },
                                searchData: {}
                            }
                        })
                    } else {
                        dispatch({
                            type: 'updateState',
                            payload: {
                                searchData: {
                                    iotDeviceTypeId: searchData.iotDeviceTypeId || ''
                                },
                                detailModal: false,
                            }
                        });
                        dispatch({
                            type: 'query',
                            payload: {
                                ...searchData,
                                pageIndex: Page.pageIndex,
                                pageSize: Page.pageSize,
                            }
                        });
                        dispatch({
                            type: 'querySearchList',
                        });
                        dispatch({
                            type: 'device/queryDeviceCounts',
                            payload: { iotDeviceTypeId }
                        })
                    }
                }
            });
        }
    },

    effects: {
        * query ({ payload }, { call, put, select }) {
            let { searchData } = yield select(state => state.device);
            console.log('searchData', searchData)
            let iotProjectId = localStorage.getItem('iotProjectId');
            payload.iotProjectId = iotProjectId;
            const data = yield call(query, {
                ...searchData,
                ...payload
            });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.data.data,
                        total: data.data.total,
                        pageIndex: payload.pageIndex || Page.pageIndex,
                        pageSize: payload.pageSize || Page.pageSize,
                    }
                });
            }
        },
        * queryDeviceCounts ({ payload }, { call, put, select }) {
            let { searchData } = yield select(state => state.device);
            let iotProjectId = localStorage.getItem('iotProjectId');
            const counts = yield call(queryDeviceCounts, { ...payload, iotProjectId });
            if (counts && counts.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceCounts: counts.data || {},
                    }
                });
            }
        },
        * queryMap ({ payload }, { call, put, select }) {
            let { searchData } = yield select(state => state.device);
            const data = yield call(query, { ...searchData, ...payload });
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        listMap: data.ret.items,
                    }
                });
            }
        },
        * changeStatus ({ payload }, { call, put }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            payload.iotProjectId = iotProjectId;
            const data = yield call(changeStatus, payload);
            if (data && data.code === 0) {
                message.success('操作成功');
                yield put({
                    type: 'updateState',
                    payload: {
                    }
                });
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: Page.pageIndex,
                        pageSize: Page.pageSize,
                    }
                });
                // yield put({
                //     type: 'queryMap',
                //     payload: {
                //         pageIndex:1,
                //         pageSize:10000,
                //     }
                // });
            }
        },
        * delete ({ payload }, { call, put }) {
            const data = yield call(deleteType, payload);
            if (data && data.code === 0) {
                message.success('操作成功');
                yield put({
                    type: 'updateState',
                    payload: {
                    }
                });
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: Page.pageIndex,
                        pageSize: Page.pageSize,
                    }
                });
            }
        },
        *  add ({ payload }, { call, put }) {
            const data = yield call(add, payload.item);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addModal: false,
                        addressEditPoint: {},
                        addressPoint: {},
                        searchData: {}
                    }
                });
                yield put({
                    type: 'query',
                    payload: {
                        pageIndex: Page.pageIndex,
                        pageSize: Page.pageSize,
                    }
                });
                yield put({
                    type: 'queryDeviceCounts',
                })
            }
        },
        * detailQuery ({ payload, callback }, { call, put }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            payload.iotProjectId = iotProjectId;
            const data = yield call(detailQuery, payload);
            if (data && data.code === 0) {
                callback && callback()
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceInfo: data.data || {},
                    }
                });
            }
        },
        //点击编辑获取详情
        * detail ({ payload }, { call, put, select }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            payload.iotProjectId = iotProjectId;
            const data = yield call(detailQuery, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        editData: data.data || {},

                    }
                });
            }
        },
        *  edit ({ payload }, { call, put, select }) {
            const data = yield call(edit, payload.item);
            let { searchData, pageIndex, pageSize } = yield select(state => state.device);
            if (data && data.code === 0) {
                yield put({
                    type: 'query',
                    payload: {
                        ...searchData,
                        pageIndex: pageIndex || Page.pageIndex,
                        pageSize: pageSize || Page.pageSize,
                    }
                });
                yield put({
                    type: 'queryDeviceCounts',
                    payload: {
                        ...searchData,
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        editModal: false,
                        addressEditPoint: {},
                        addressPoint: {}
                    }
                });
            }
        },
        *  getProjectName ({ payload }, { call, put }) {
            const projectList = yield call(queryProject,
                {
                    pageIndex: 1,
                    pageSize: 10000,
                });
            if (projectList && projectList.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        projects: projectList.data || [],
                    }
                });

            }
        },
        *  getDeviceType ({ payload }, { call, put }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            const data = yield call(queryDeviceType,
                {
                    iotProjectId,
                });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceTypes: data.data || [],
                    }
                });
            }
        },
        *  getDeviceTypeByProjectId ({ payload }, { call, put }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            const data = yield call(queryDeviceTypeByProjectId, {
                iotProjectId,
            });
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceTypesByProjectId: data.data || [],
                    }
                });
            }
        },
        * querySearchList ({ payload }, { call, put }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            //获取标签下拉列表
            const Tags = yield call(queryTags, { iotProjectId });
            if (Tags && Tags.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        tags: Tags.data || [],
                    }
                });
            }
            //获取设备类型下拉列表
            const deviceTypes = yield call(queryDeviceType,
                {
                    iotProjectId
                });
            if (deviceTypes && deviceTypes.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceTypes: deviceTypes.data || [],
                    }
                });
            }
            // //获取设备在离线数
            // const counts = yield call(queryDeviceCounts,{iotProjectId});
            // if (counts && counts.data === 0) {
            //     yield put({
            //         type: 'updateState',
            //         payload:{
            //             deviceCounts: counts.data || {},
            //         }
            //     });
            // }
        },

        //获取设备实时数据
        * queryPointslatest ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            console.log(selectItem)
            let iotProjectId = selectItem.iotProjectId || '';
            let deviceCode = selectItem.deviceCode || '';
            const data = yield call(queryPointslatest, {
                iotProjectId,
                deviceCode,
            });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        latestPoints: data.data || [],
                    }
                });
            }
        },
        // 获取通道实时数据
        * queryChannelPointslatest ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            let iotProjectId = selectItem.iotProjectId || '';

            const data = yield call(queryPointslatest, {
                ...payload,
                iotProjectId,
            });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        channelLatestPoints: data.data || [],
                    }
                });
            }
        },
        //获取因子列表
        * queryFactorList ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            console.log(selectItem)
            let iotDeviceId = selectItem.iotDeviceId || '';
            let iotProjectId = selectItem.iotProjectId || '';
            const data = yield call(queryFactorList, {
                iotDeviceId,
                iotProjectId,
            });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        factors: data.data || [],
                    }
                });
            }
        },
        * queryChannelFactorList ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            let iotProjectId = selectItem.iotProjectId || '';
            const data = yield call(queryFactorList, {
                ...payload,
                iotProjectId,
            });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        channelFactors: data.data || [],
                    }
                });
            }
        },
        //获取设备历史数据
        * querykvsPoints ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            console.log(selectItem)
            let iotProjectId = selectItem.iotProjectId || '';
            let deviceCode = selectItem.deviceCode || '';
            payload.iotProjectId = iotProjectId;
            payload.deviceCode = deviceCode
            const data = yield call(querykvsPoints, payload);
            if (data && data.code === 0) {
                let factorsList = data.data.map(item => {
                    return item.factorCode
                })
                yield put({
                    type: 'updateState',
                    payload: {
                        kvspoints: data.data || [],
                        factorsList
                    }
                });
            }
        },
        // 通道历史数据
        * querychannelKvsPoints ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            console.log(selectItem)
            let iotProjectId = selectItem.iotProjectId || '';

            payload.iotProjectId = iotProjectId;

            const data = yield call(querykvsPoints, payload);
            if (data && data.code === 0) {
                let channelFactorsList = data.data.map(item => {
                    return item.factorCode
                })
                yield put({
                    type: 'updateState',
                    payload: {
                        channelKvspoints: data.data || [],
                        channelFactorsList
                    }
                });
            }
        },
        //获取设备事件列表
        * queryevents ({ payload }, { call, put, select }) {
            let { selectItem, eventPageIndex, eventPageSize } = yield select(state => state.device);
            let iotProjectId = selectItem.iotProjectId || '';
            let iotDeviceId = selectItem.iotDeviceId || '';
            payload.iotProjectId = iotProjectId;
            payload.iotDeviceId = iotDeviceId;
            payload.pageIndex = eventPageIndex;
            payload.pageSize = eventPageSize;
            const data = yield call(queryevent, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        eventList: data.data.data || [],
                        eventTotal: data.data.total
                    }
                });
            }
        },
        //获取设备历史数据
        * querylogs ({ payload }, { call, put, select }) {
            let { selectItem, logPageIndex, logPageSize } = yield select(state => state.device);
            let iotProjectId = selectItem.iotProjectId || '';
            let iotDeviceId = selectItem.iotDeviceId || '';
            payload.iotProjectId = iotProjectId;
            payload.iotDeviceId = iotDeviceId;
            payload.pageIndex = logPageIndex;
            payload.pageSize = logPageSize;
            const data = yield call(querylogs, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        logList: data.data.data || [],
                        logTotal: data.data.total,
                    }
                });
            }
        },
        //获取设备历史数据
        * queryTags ({ payload }, { call, put, select }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            //获取标签下拉列表
            const Tags = yield call(queryTags, { iotProjectId });
            if (Tags && Tags.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        tags: Tags.data || [],
                    }
                });
            }
        },
        //获取设备历史数据
        * handleEvent ({ payload }, { call, put, select }) {
            let { selectItem, } = yield select(state => state.device);
            let iotProjectId = selectItem.iotProjectId || '';
            payload.iotProjectId = iotProjectId;
            const data = yield call(handleEvent, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        eventModal: false
                    }
                });
            }
        },

        //获取历史轨迹数据
        * queryRoadData ({ payload }, { call, put, select }) {
            let iotProjectId = localStorage.getItem('iotProjectId');
            //获取标签下拉列表
            const data = yield call(queryRoad, { ...payload, iotProjectId });
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        roadData: data.data || [],
                    }
                });
            }
        },
        //查询通道数据
        * queryChannelData ({ payload }, { call, put, select }) {
            let { selectItem, channelSelected } = yield select(state => state.device);
            payload.iotDeviceId = selectItem.iotDeviceId || '';
            payload.iotProjectId = selectItem.iotProjectId || '';
            const data = yield call(queryChannel, payload)
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        channelData: data.data || [],
                    }
                });
                if (data.data.length) {
                    let channelItem = Object.keys(channelSelected).length == 0 ? data.data[0] : channelSelected;
                    yield put({
                        type: 'updateState',
                        payload: {
                            channelSelected: channelItem
                        }
                    })
                    yield put({
                        type: 'queryChannelPointslatest',
                        payload: {
                            deviceCode: channelItem.passCode
                        }
                    })
                    yield put({
                        type: 'queryChannelFactorList',
                        payload: {
                            iotDeviceId: channelItem.iotDevicePassId
                        }
                    })

                    yield put({
                        type: 'getLiveStream',
                        payload: {}
                    })
                } else {
                    message.info('暂无通道数据')
                    yield put({
                        type: 'updateState',
                        payload: {
                            videoButton: false,
                            bodyLoading: false
                        }
                    })
                }
            }
        },
        //查询通道类型列表
        * queryAllByIotDeviceType ({ payload }, { call, put, select }) {

            let { selectItem, channelSelected } = yield select(state => state.device);
            console.log('sss', selectItem)
            //payload.iotDeviceTypeId = selectItem.iotDeviceId || '';
            const data = yield call(queryAllByIotDeviceType, { ...payload, iotDeviceTypeId: selectItem.iotDeviceTypeId || '' })
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        passTypeData: data.data || [],
                    }
                });
                yield put({
                    type: 'queryChannelData',
                    payload: {
                        iotPassTypeId: data.data && data.data.length > 0 ? data.data[0].iotPassTypeId : '',
                        iotDeviceId: selectItem.iotDeviceId,
                    }
                })
            }
        },
        //事件详情
        * eventDetail ({ payload }, { call, put, select }) {
            let { selectItem } = yield select(state => state.device);
            let iotDeviceId = selectItem.iotDeviceId || '';
            let iotProjectId = selectItem.iotProjectId || '';
            const data = yield call(eventDetail, { ...payload, iotDeviceId, iotProjectId })
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        eventDetailData: data.data || {}
                    }
                })
            }
        },
        // 直播地址
        * getLiveStream ({ payload }, { call, put, select }) {
            let { channelSelected, selectItem } = yield select(state => state.device);
            payload.iotDevicePassId = channelSelected.iotDevicePassId;
            payload.iotProjectId = selectItem.iotProjectId;
            const data = yield call(getLiveStream, payload)
            if (data && data.code === 0 && data.data) {
                yield put({
                    type: 'updateState',
                    payload: {
                        liveStreamUrl: data.data || {},
                        videoButton: true,
                        bodyLoading: false
                    }
                })
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        videoButton: false,
                        bodyLoading: false
                    }
                })
            }
        },
        // 云台控制
        * cameraCtrl ({ payload }, { call, put, select }) {
            let { channelSelected, selectItem } = yield select(state => state.device);
            payload.iotDevicePassId = channelSelected.iotDevicePassId;
            payload.iotProjectId = selectItem.iotProjectId;
            const data = yield call(cameraCtrl, payload)
            if (data && data.code === 0) {

            }
            return data;
        },
        * cameraStop ({ payload }, { call, put, select }) {
            let { channelSelected, selectItem } = yield select(state => state.device);
            payload.iotDevicePassId = channelSelected.iotDevicePassId;
            payload.iotProjectId = selectItem.iotProjectId;
            const data = yield call(cameraStop, payload)
            if (data && data.code === 0) {
            }
        },
        * getPlayBack ({ payload }, { call, put, select }) {
            let { channelSelected, selectItem } = yield select(state => state.device);
            payload.iotDevicePassId = channelSelected.iotDevicePassId;
            payload.iotProjectId = selectItem.iotProjectId;
            const data = yield call(getPlayBack, payload)
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        playbackStreamUrl: data.data || {},
                    }
                })
            }
            return data;
        },
    },

    reducers: {
        updateState (state, { payload }) {
            return { ...state, ...payload };
        },
        setLocation (state, { payload }) {
            return { ...state, addressPoint: payload.addressPoint, addressEditPoint: payload.addressPoint }
        },

    }
})
