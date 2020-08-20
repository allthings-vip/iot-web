import request from '../utils/request';

export async function query(params) {
    return request('/dos/systemlogs/list',{
        body:params
    });
}

export async function queryType(params) {
    return request('/dos/system/loggertype',{
        body:params
    });
}

export async function queryProject(params) {
    return request('/dos/projects/name',{
        body:params
    });
}