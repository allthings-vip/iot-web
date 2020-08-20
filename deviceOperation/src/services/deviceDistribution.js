import request from '../utils/request';

export async function query(params) {
    return request('/dos/devices/location',{
        body:params
    });
}

export async function queryRoad(params) {
    return request('/dos/devices/history',{
        body:params
    });
}

export async function queryDevice(params) {
    return request('/dos/devicetypes/down',{
        body:params
    });
}

export async function queryTag(params) {
    return request('/dos/tag/list',{
        body:params
    });
}