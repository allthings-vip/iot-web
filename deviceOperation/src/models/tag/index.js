import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {deleteDevice, addDevice, haveDeviceList, unDeviceList, queryTagList, addTag, deleteTag} from '../../services/tag';


export default modelExtend(model, {
    namespace: 'tagmanage',

    state: {
         tagList: '',
         haveDeviceList: '',
         unDeviceList: '',
         iotTagId: '',
         leftloading: false,
         rightloading: false
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname,search}) => {
                if (pathname === '/tag') {
                    let iotProjectId = localStorage.getItem('iotProjectId')
                    dispatch({
                        type: 'queryTagList',
                        payload:{
                            iotProjectId
                        }
                    });
                }
            });
        }
    },
    
    effects: {
        * queryTagList({payload, callback}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(queryTagList, payload);
            console.log('taglist', data)
            if (data && data.code === 0) {
                    if (callback && typeof callback === 'function') {
                        callback()
                    }
                    
                    if (data.data && data.data.length) {
                        yield put({
                            type: 'updateState',
                            payload: {
                                tagList: data.data,
                                iotTagId: data.data[0].iotTagId,
                                leftloading: true,
                                rightloading: true
                            }
                        });
                        yield put({
                            type: 'unDeviceList',
                            payload: {
                                iotTagId: data.data[0].iotTagId,
                                iotProjectId
                            }
                        })
                        yield put({
                            type: 'haveDeviceList',
                            payload: {
                                iotTagId: data.data[0].iotTagId,
                                iotProjectId
                            }
                        })
                    } else {
                        yield put({
                            type: 'updateState',
                            payload: {
                                tagList: '',
                                iotTagId: '',
                                haveDeviceList: '',
                                unDeviceList: '',
                            }
                        });
                    }
            }
        },
        * haveDeviceList({payload, callback}, {call, put}) {
            const data = yield call(haveDeviceList, payload);
            if (callback && typeof callback === 'function') {
                callback(data.code); 
            }
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        haveDeviceList: data.data,
                        rightloading: false 
                    }
                })
            }
        },
        * unDeviceList({payload, callback}, {call, put}) {
            const data = yield call(unDeviceList, payload);
            if (callback && typeof callback === 'function') {
                callback(data.code); 
            }
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        unDeviceList: data.data,
                        leftloading: false
                    }
                })
            }
        },
        * deleteDevice({payload, callback}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(deleteDevice, payload);
            if (callback && typeof callback === 'function') {
                callback(data.code); 
            }
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        leftloading: true,
                        rightloading: true
                    }
                })
                yield put({
                    type: 'unDeviceList',
                    payload: {
                        iotTagId: payload.iotTagId,
                        iotProjectId
                    }
                })
                yield put({
                    type: 'haveDeviceList',
                    payload: {
                        iotTagId: payload.iotTagId,
                        iotProjectId
                    }
                })
            }
        },
        * addDevice({payload, callback}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(addDevice, payload);
            if (callback && typeof callback === 'function') {
                callback(data.code); 
            }
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        leftloading: true,
                        rightloading: true
                    }
                })
                yield put({
                    type: 'unDeviceList',
                    payload: {
                        iotTagId: payload.iotTagId,
                        iotProjectId
                    }
                })
                yield put({
                    type: 'haveDeviceList',
                    payload: {
                        iotTagId: payload.iotTagId,
                        iotProjectId
                    }
                })
            }
        },
        * deleteTag({payload, callback}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(deleteTag, payload);

            if (data && data.code === 0) {
                yield put({
                    type: 'queryTagList',
                    payload: { iotProjectId },
                    callback
                })
            }
        },
        * addTag({payload, callback}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(addTag, payload);

            if (data && data.code === 0) {
                yield put({
                    type: 'queryTagList',
                    payload: { iotProjectId },
                    callback
                })
            }
        }       
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        }
    }
})