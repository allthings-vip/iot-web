import request from '../utils/request';

export async function opsList(params) {
    return request('/dos/serviceInfo/list', {
        body: params
    })
}

export async function opsDetail(params) {
    return request('/dos/serviceInfo/realtime', {
        body: params
    })
}

export async function opsTopo(params) {
    return request('/dos/serviceInfo/topology', {
        body: params
    })
}

export async function addService(params) {
    return request('/dos/serviceInfo/save', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    })
}

export async function detailService(params) {
    return request('/dos/serviceInfo/get', {
        body: params
    })
}

export async function editService(params) {
    return request('/dos/serviceInfo/update', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    })
}

export async function delService(params) {
    return request('/dos/serviceInfo/delete', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    })
}

