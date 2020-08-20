import request from '../utils/request';

export async function detail(params) {
    return request('/dos/projects'
        ,{
            body:params,
            method:'get',
            requestType: 1
        }
    );
}

export async function queryStatus(params) {
    return request('/dos/devices/counts/status'
        ,{
            body:params,
            method:'get',
        }
    );
}

export async function query(params) {
    return request('/dos/projects/overview',{
        body:params
    });
}
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
    console.log('123123')
    return request('/dos/logout',{
        body:params
    });
}
export async function getKvsPoint(params) {
    return request('/dos/devices/tag/counts',{
        body:params
    });
}

export async function getAppSecret(params) {
    return request('/dos/projects/appsecret',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}

export async function getCode(params) {
    return request('/dos/code/appsecret/get',{
        body:params
    });
}

export async function saveCallbackAddress(params) {
    return request('/dos/project/push/url',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}

export async function getCallbackAddress(params) {
    return request('/dos/project/get/push/url',{
        body:params
    });
}
