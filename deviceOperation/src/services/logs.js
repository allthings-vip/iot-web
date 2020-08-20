import request from '../utils/request';

export async function query(params) {
    return request('/dos/logs',{
        body:params
    });
}