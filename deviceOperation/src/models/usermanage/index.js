import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query, edit, openClose} from '../../services/usermanage';
import {Page} from '../../utils/constant';
import qs from 'query-string';

export default modelExtend(model, {
    namespace: 'usermanage',

    state: {
         //列表数据
         dataSource: '', // 项目数据列表
         total: 0, // 总条数
         pageIndex: Page.pageIndex, // 当前页
         pageSize: Page.pageSize, // 每页显示条数
         keywords: '',
         loading: ''
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname,search}) => {
                if (pathname === '/user') {
                    dispatch({
                        type: 'updateState',
                        payload: {loading: true}
                    })
                    dispatch({
                        type: 'query',
                        payload:{
                            pageIndex:Page.pageIndex,
                            pageSize:Page.pageSize,
                        }
                    });
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put}) {
            const data = yield call(query, {...payload,});
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        dataSource: data.data.data,
                        total:data.data.total,
                        pageIndex: payload.pageIndex || Page.pageIndex,
                        pageSize: payload.pageSize ||  Page.pageSize,
                        keywords: payload.keywords || '',
                        loading: false
                    }
                });
            }
        },
        * edit({payload}, {call, put, select}) {
            const data = yield call(edit, payload);
            let { keywords,pageIndex,pageSize } = yield select(state => state.usermanage);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {loading: true}
                })
                yield put({
                    type: 'query',
                    payload: {
                        keywords,
                        pageIndex,
                        pageSize
                    }
                })
                message.success('保存成功')
            } else {
                message.error(data.msg)
            }
        },
        * openClose({payload}, {call, put, select}) {
            const data = yield call(openClose, payload);
            let { keywords,pageIndex,pageSize } = yield select(state => state.usermanage);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {loading: true}
                })
                yield put({
                    type: 'query',
                    payload: {
                        keywords,
                        pageIndex,
                        pageSize
                    }
                })
                message.success('保存成功')
            } else {
                message.error(data.msg)
            }
        },  
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        }
    }
})
