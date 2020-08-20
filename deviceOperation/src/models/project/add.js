import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query} from '../../services/home';

export default modelExtend(model, {
    namespace: 'projectAdd',

    state: {
        list: [], // 货单列表
        total: 0, // 总条数
        pageIndex: 1, // 当前页
        pageSize: 4, // 每页显示条数
        statusNum: {} // 状态数量
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/') {
                    dispatch({
                        type: 'query'
                    });
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put}) {
            const data = yield call(query, payload);
            if (data && data.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: {
                        carrier: data.data
                    }
                });
            }
        },        
    },

    reducers: {
    }
})
