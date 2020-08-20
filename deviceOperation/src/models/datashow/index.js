import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {query,queryFactors} from '../../services/datashow';
import {Page} from '../../utils/constant';
export default modelExtend(model, {
    namespace: 'datashow',

    state: {
        list: [], // 数据列表
        total: 0, // 总条数
        pageIndex: Page.pageIndex, // 当前页
        pageSize: Page.pageSize, // 每页显示条数
        factors:[],//因子列表
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/') {
                    // dispatch({
                    //     type: 'query'
                    // });
                }
            });
        }
    },
    
    effects: {
        * query({payload}, {call, put}) {
            const data = yield call(query, payload);
            if (data && data.rc === 0) {
                console.log(data.ret.items)
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.ret.items || [],
                        total:data.ret.rowCount,
                    }
                });
            }
        },     
        * queryFactors({payload}, {call, put}) {
            const data = yield call(queryFactors, payload.deviceCode);
            if (data && data.rc === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        factors: data.ret.factorList || [],
                    }
                });
            }
        },  
            
    },

    reducers: {
    }
})
