import modelExtend from 'dva-model-extend';
import { model } from '../common';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {login,getnewphoto,register,getCode} from '../../services/login';
import {Page} from '../../utils/constant';
import { toIndex } from '../../utils/common';
export default modelExtend(model, {
    namespace: 'login',

    state: {
       //列表数据
       list: [], // 项目数据列表
       total: 0, // 总条数
       pageIndex: Page.pageIndex, // 当前页
       pageSize: Page.pageSize, // 每页显示条数
       statusNum: {}, // 状态数量
       photo:''
    },

    subscriptions: {
        setup({dispatch, history}){
            return history.listen(({pathname, query}) => {
                if (pathname === '/login') {
                    const userName = window.localStorage.getItem('userName');
                    if(userName){
                        //toIndex()
                    }
                }
            });
        }
    },
    
    effects: {
        * getnewphoto({payload}, {call, put}) {
            const data = yield call(getnewphoto, payload);
            if (data && data.code === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        photo: data.data ? 'data:image/png;base64,'+data.data.replace(/\s+/g, "") : ''
                    }
                });
            } else {
                message.error(data.msg);
            }
        },
        * query({payload}, {call, put}) {
            const data = yield call(login, payload);
            if (data && data.code === 0) {
                localStorage.setItem('username',data.data.username || '');
                toIndex()
            } else if(data && data.code === '5002'){
                yield put({
                    type: 'updateState',
                    payload: {
                        photo: data.data ? 'data:image/png;base64,'+data.data.replace(/\s+/g, "") : ''
                    }
                });
                message.error(data.msg);
            } else if(data && data.code === -10707){
                yield put({
                    type: 'updateState',
                    payload: {
                        photo: data.data ? 'data:image/png;base64,'+data.data.replace(/\s+/g, "") : ''
                    }
                });
                message.error(data.msg);
            } else if(data && data.code === -10409){
                yield put({
                    type: 'updateState',
                    payload: {
                        photo: data.data ? 'data:image/png;base64,'+data.data.replace(/\s+/g, "") : ''
                    }
                });
            }
        }, 
        * register({payload, callback}, {call, put}) {
            const data = yield call(register, payload)
            if (data && data.code == 0) {
                callback && callback(data);
                message.success('注册成功，请登录')
            }
        },
        * getCode({payload}, {call, put}) {
            const data = yield call(getCode, payload);
            if (data && data.code == 0) {
                message.success('验证码已发送')
            }
        }       
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
    }
})
