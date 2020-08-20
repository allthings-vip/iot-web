import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query, queryRoad, queryDevice, queryTag} from '../../services/deviceDistribution';
// import {querydata} from './data';
export default modelExtend(model, {
    namespace: 'devicedistribution',

    state: {
         data: [],
         text: 'hahahahhaha',
         roadData: [],
         deviceData: '',
         tagData: ''
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname,search}) => {
                if (pathname === '/distribution') {
                    let iotProjectId = localStorage.getItem('iotProjectId')
                    dispatch({
                        type: 'queryDevice',
                        payload:{
                            iotProjectId
                        }
                    });
                    dispatch({
                        type: 'queryTag',
                        payload:{
                            iotProjectId
                        }
                    });
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(query, {...payload, iotProjectId});
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        data: data.data
                    }
                });
            }
        },
        * queryRoad({payload}, {call, put}) {
            let iotProjectId = localStorage.getItem('iotProjectId')
            const data = yield call(queryRoad, {...payload, iotProjectId});
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        roadData: data.data
                    }
                });
            }
        },
        * queryDevice({payload}, {call, put}) {
            const data = yield call(queryDevice, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceData: data.data
                    }
                });
            }
        },
        * queryTag({payload}, {call, put}) {
            const data = yield call(queryTag, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        tagData: data.data
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