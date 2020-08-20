import request from '../utils/request';

export async function deleteDevice(params) {
    return request('/dos/tag/device/delete',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method: 'post'
    });
}

export async function addDevice(params) {
    return request('/dos/tag/device/save',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method: 'post'
    });
}

export async function haveDeviceList(params) {
    return request('/dos/tag/device/choose/list',{
        body:params
    });
}

export async function unDeviceList(params) {
    return request('/dos/tag/device/unchoose/list',{
        body:params
    });
}

export async function queryTagList(params) {
    return request('/dos/tag/list',{
        body:params
    });
}

export async function addTag(params) {
    return request('/dos/tag/save',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method: 'post'
    });
}

export async function deleteTag(params) {
    return request('/dos/tag/delete',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method: 'post'
    });
}