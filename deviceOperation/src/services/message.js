
import request from '../utils/request';

// 获取承运商消息数量
export function queryStatusNum(params) {
    return request('/tf56mall/msgCenter/pcMsgCount', {
        body: params
    });
}


// 获取承运商消息列表
export function queryMsgList(params) {
    return request('/tf56mall/msgCenter/pcMsgList', {
        body: params
    });
}
