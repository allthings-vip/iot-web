import request from '../utils/request';

export async function query(params) {
    return request('/dos/user/list',{
        body:params
    });
}

export async function edit(params) {
    return request('/dos/user/admin/update',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}

export async function openClose(params) {
    return request('/dos/user/update/status',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}