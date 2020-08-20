/**
 * 基础的 model
 */
import modelExtend from 'dva-model-extend';

export const model = {
    state: {},

    subscriptions: {
        // setup({ dispatch, history }) {
        //     return history.listen((location) => {
                
        //     })
        // }
    },

    reducers: {
        updateState(state, { payload }) {
            return {...state, ...payload}
        }
    }
}

