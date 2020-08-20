import modelExtend from 'dva-model-extend';
import {model} from './common';
import {routerRedux} from 'dva/router';
import {logout,queryUserInfo,queryUrlAuth,qeuryPhoneCode,updatePassword,updateUserInfo} from '../services/index';
import { toIndex,toLoginIndex } from '../utils/common';
import {isEmpty} from 'lodash';
export default modelExtend(model, {
    namespace: 'app',

    state: {
        login: true, // false,表示没有认证过
        carrier: {}, // 承运商
        updateUserInfoModal:false,
        updatePasswordModal:false,
        userInfo:{},

    },

    subscriptions: {
        setup({dispatch, history}) {
            // 此处有大坑，发请求会导致整个react生命周期出现问题
        }

    },

    effects: {
        * logout({payload}, {call, put}) {
            const data = yield call(logout, payload);
            if (data && data.code === 0) {
                //window.localStorage.removeItem('userName')
                toLoginIndex();
            }
        },
        * queryUserInfo({payload}, {call, put}) {
            const data = yield call(queryUserInfo);
            if (data && data.code === 0) {
                localStorage.setItem('mobilenumber', data.data.mobile)
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo: data.data
                    }
                });
                if(isEmpty(data.data)){
                    toLoginIndex();
                }
                //window.localStorage.removeItem('userName')
            // toLoginIndex();
            }
        },
        * queryUrlAuth({payload}, {call, put}) {
            const data = yield call(queryUrlAuth, payload);
            if (data && data.code === 0) {
            } else if(data && data.code === 5002) {
                setTimeout(() => {
                    message.error('您没有该页面的访问权限，3秒后将为您跳转到首页', 3);
                    setTimeout(toIndex(), 3000);
                }, 0);
            }
        },
        * qeuryPhoneCode({payload}, {call, put}) {
            const data = yield call(qeuryPhoneCode, payload);
            if (data && data.code === 0) {
            } else if(data && data.code === 5002) {
                setTimeout(() => {
                    message.error('您没有该页面的访问权限，3秒后将为您跳转到首页', 3);
                    setTimeout(toIndex(), 3000);
                }, 0);
            }
        },
        * updateUserInfo({payload}, {call, put}) {
            const data = yield call(updateUserInfo, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'queryUserInfo'
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        updateUserInfoModal:false
                    }
                });
            } 
        },
        * updatePassword({payload}, {call, put}) {
            const data = yield call(updatePassword, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        updatePasswordModal:false
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
