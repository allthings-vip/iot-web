import request from '../utils/request';

export async function query(params) {
    return request('/dos/factors',{
        body:params
    });
}
export async function queryDataAggType(params) {
    return request('/dos/dataaggtypes',{
        body:params
    });
}
export async function add(params) {
    return request('/dos/factors',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function edit(params) {
    params._method='put';
    return request('/dos/factors',{
        body:params,
        method:'post'
    });
}
export async function deleteE(params) {
    params._method='delete';
    return request('/dos/factors',{
        body:params,
        method:'post'
    });
}

export async function queryDetail(params) {
    return request('/dos/factors'
        ,{
            body: params,
            method:'get',
            requestType: 1
        }
    );
}