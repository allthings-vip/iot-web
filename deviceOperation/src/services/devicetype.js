import request from '../utils/request';

export async function query(params) {
    return request('/dos/devicetypes/list',{
        body:params
    });
}
export async function changeStatus(params) {
    params._method = 'put'
    return request('/dos/devicetypes/status',{
        body:params,
        method:'post'
    });
}
export async function add(params) {
    return request('/dos/devicetypes/save',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function edit(params) {
    // params._method = 'put'
    return request('/dos/devicetypes/update',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function deleteType(params) {
    // params._method = 'delete'
    return request('/dos/devicetypes/delete',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function queryFactor(params) {
    return request('/dos/factors',{
        body:params,
        method:'get'
    });
}