import request from '../utils/request';
export async function queryUrlAuth(params) {
    return request('/dos/authority/judge',{
        body:params
    });
}
export async function query(params) {
    return request('/dos/overview');
}
export async function queryOverview(params) {
    return request('/dos/overview');
}
//
export async function getDeviceCounts(params) {
    return request('/dos/devices/counts',{
        body:params
    });
}
export async function getPointCounts(params) {
    return request('/dos/kvs/points/counts',{
        body:params
    });
}
export async function getDeviceTop(params) {
    return request('/dos/devices/counts/top',{
        body:params
    });
}
export async function getPointTop(params) {
    return request('/dos/points/counts/top',{
        body:params
    });
}
export async function logout(params) {
    return request('/dos/logout',{
        body:params
    });
}
export async function getKvsPoint(params) {
    return request('/dos/devices/tag/counts',{
        body:params
    });
}
export async function queryUserInfo(params){
    return request('/dos/user/get',{
        body:params
    });
}
export async function qeuryPhoneCode(params){
    return request('/dos/code/get',{
        body:params
    })
}
export async function updateUserInfo(params){
    return request('/dos/user/update',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    })
}
export async function updatePassword(params){
    return request('/dos/user/update/password',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    })
}
