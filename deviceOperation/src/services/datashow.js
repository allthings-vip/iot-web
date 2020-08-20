import request from '../utils/request';

export async function query(params) {
    return request('/dos/kvs/points',{
        body:params,

    });
}
export async function queryFactors(params) {
    return request('/dos/devices'
        ,{
            body:'d'+params,
            method:'get',
            requestType: 1
        }
    );
}