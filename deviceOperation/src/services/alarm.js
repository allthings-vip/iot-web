import request from '../utils/request';

export async function query(params) {
    return request('/dos/events',{
        body:params,

    });
}
export async function queryAlarm(params) {
    return request('/dos/alarms',{
        body:params,

    });
}