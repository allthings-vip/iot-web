import modelExtend from 'dva-model-extend';
import {message} from 'antd'
import {routerRedux} from 'dva/router';
import {model} from './common';
import {getCertifyInfo, setCertifyInfo} from '../services/certify'
import {exitCarrier} from '../services/home'

export default modelExtend(model, {
    namespace: 'certify',

    state: {
        businessPartId: "",//合作TMS业务平台编号
        enterStatus: '',  //承运商是否入驻（true:已入驻;false:未入驻）
        activeState: '',//承运商是否启用（Y：启用；N:禁用）
        mallCarrierRegisterId: '',    //承运商id
        step: 0, //承运商入驻流程节点（0,1,2,3）
        idCardStatus: '',//身份证审核状态(未申请,审核中,已审核,已退回)
        bizLicenseStatus: '',//营业执照审核状态
        roadPermitStatus: '',//道路许可证审核状态
        companyName: '',//公司名称
        legalPerson: '',//法人姓名
        legalPersonMobile: '',//法人联系电话
        mallSessionBean: {}
    },

    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname == "/certify") {
                    // dispatch({
                    //     type: "getCertifyInfo",
                    //     payload: {}
                    // })
                }
            })
        }
    },


    effects: {
        // 获取承运商信息
        * getCertifyInfo({payload}, {call, put, select}) {
            let stateMap = yield  select(state => state.certify);
            const res = yield call(getCertifyInfo, {})

            const {result, data} = res;
            // 接口数据都会返回用户信息
            if (data) {
                for (let key in stateMap) {
                    stateMap[key] = data[key];
                }
                yield put({
                    type: "updateState",
                    payload: {...stateMap}
                })
            }
            //承运商登录，个人登录时request统一做跳转处理
            if (result) {
                // 承运商已经入驻
                if (data.mallSessionBean.enterStatus) {
                    message.success('承运商已经入驻');
                    yield put(routerRedux.push('/'));
                }
            }
        },

        // 保存承运商信息
        * setCertifyInfo({payload}, {call, put, select}) {
            const res = yield call(setCertifyInfo, payload)
            if (res.result) {
                let step = yield  select(state => state.certify.step);
                yield put({
                    type: "updateState",
                    payload: {
                        step: ++step
                    }
                })
            }
        },

        //注销
        * exitCarrier(action, {call, put}) {
            const data = yield call(exitCarrier);
            if (data && data.result === 'success') {
                action.onComplete && action.onComplete();
            }
        },
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    }
    ,

})
