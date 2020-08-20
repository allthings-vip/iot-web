import request from '../utils/request';
export async function queryTags(params) {
    return request('/dos/tag/list',{
        body:params,
        method:'get'
    });
}
export async function queryFactor(params) {
    return request('/dos/factors',{
        body:params,
        method:'get'
    });
}
export async function queryProtocols(params) {
    return request('/dos/protocols/get',{
        body:params,
        method:'get'
    });
}