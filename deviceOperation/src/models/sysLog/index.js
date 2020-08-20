import modelExtend from 'dva-model-extend';
import { model } from '../common';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {queryTags} from '../../services/common';
import {query, queryType, queryProject} from '../../services/syslog';
import {Page} from '../../utils/constant';
export default modelExtend(model, {
    namespace: 'syslog',

    state: {
        logList: [],
        total: '',
        pageIndex: Page.pageIndex,
        pageSize: Page.pageSize,

        logType: [],
        projectName: [],
         value: {}
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/syslog') {
                   dispatch({
                       type: 'query',
                       payload: {
                            pageIndex:Page.pageIndex,
                            pageSize:Page.pageSize,
                            endDatetime: moment().valueOf(),
                            startDatetime: moment().clone().set({hour:0,minute:0}).valueOf()
                       }
                   })

                   dispatch({
                       type: 'updateState',
                       payload: {
                            value: {
                                endDatetime: moment().valueOf(),
                                startDatetime: moment().clone().set({hour:0,minute:0}).valueOf()
                            }
                       }
                   })

                   dispatch({
                       type: 'queryType',
                   })
                   dispatch({
                       type: 'queryProject',
                   })
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put, select}) {
            const data = yield call(query, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                       logList: data.data.data || [],
                       total:data.data.total,
                       pageIndex:payload.pageIndex || Page.pageIndex,
                       pageSize:payload.pageSize ||  Page.pageSize,
                    }
                })
            }
       },
       * queryType({payload}, {call, put, select}) {
            const data = yield call(queryType, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        logType: data.data
                    }
                })
            }
        },
        * queryProject({payload}, {call, put, select}) {
            const data = yield call(queryProject, payload);

            if(data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        projectName: data.data
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
